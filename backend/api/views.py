from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.decorators import (
    action,
    api_view,
    permission_classes,
    parser_classes,
)
from rest_framework.response import Response
from rest_framework.parsers import MultiPartParser, FormParser
from django.contrib.auth.models import User
from django.db.models import Q
import csv
from .models import (
    Person,
    Cosmetic,
    IngredientINCI,
    CosmeticComposition,
    Review,
    CarePlan,
    CarePlanContent,
    CarePlanRating,
    FavoriteProduct,
)
from django.views.decorators.csrf import csrf_exempt
from .serializers import (
    PersonSerializer,
    UserSerializer,
    CosmeticSerializer,
    IngredientINCISerializer,
    CosmeticCompositionSerializer,
    CosmeticCompositionReadSerializer,
    ReviewSerializer,
    CarePlanSerializer,
    CarePlanContentSerializer,
    CarePlanRatingSerializer,
    FavoriteProductSerializer,
)


# importing COSING.csv
@csrf_exempt
@api_view(["POST"])
@permission_classes([IsAuthenticated])
@parser_classes([MultiPartParser, FormParser])
def import_cosing_view(request):
    if not request.user.is_staff:
        return Response({"error": "Admin privileges required."}, status=403)

    file = request.FILES.get("file")
    if not file:
        return Response({"error": "No file provided."}, status=400)
    decoded_file = file.read().decode("utf-8").splitlines()
    reader = csv.DictReader(decoded_file)
    count = 0
    for row in reader:
        try:
            cosing_ref_no = int(row["COSING Ref No"].strip())
            inci_name = row["INCI name"].strip()
            common_name = (
                row.get("INN name", "").strip() or row.get("Ph. Eur. Name", "").strip()
            )
            action_description = row.get("Chem/IUPAC Name / Description", "").strip()
            function = row.get("Function", "").strip()
            restrictions = row.get("Restriction", "").strip()
            update_date = row.get("Update Date", "").strip()
            IngredientINCI.objects.update_or_create(
                cosing_ref_no=cosing_ref_no,
                defaults={
                    "inci_name": inci_name,
                    "common_name": common_name,
                    "action_description": action_description,
                    "function": function,
                    "restrictions": restrictions,
                    "update_date": update_date,
                },
            )
            count += 1
        except Exception as e:
            continue
    return Response({"success": True, "imported": count})


class PersonViewSet(viewsets.ModelViewSet):
    queryset = Person.objects.all()
    serializer_class = PersonSerializer


class UserViewSet(viewsets.ModelViewSet):
    queryset = User.objects.all()
    serializer_class = UserSerializer
    permission_classes = [AllowAny]

    @action(detail=False, methods=["post"], permission_classes=[AllowAny])
    def register(self, request, *args, **kwargs):
        serializer = self.get_serializer(data=request.data)
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        return Response(
            {
                "id": user.id,
                "username": user.username,
                "email": user.email,
            },
            status=status.HTTP_201_CREATED,
        )

    @action(detail=False, methods=["get"], permission_classes=[IsAuthenticated])
    def me(self, request):
        """
        It returns information about the currently logged-in user.
        The token is verified by the JWTAuthentication mechanism,
        and the user object available in request.user.
        """
        serializer = self.get_serializer(request.user)
        return Response(serializer.data)

    @action(detail=False, methods=["patch"], permission_classes=[IsAuthenticated])
    def change_email(self, request):
        user = request.user
        new_email = request.data.get("new_email", "").strip()
        if not new_email:
            return Response(
                {"detail": "Nie podano adresu e-mail."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user.email = new_email
        user.save()
        return Response(
            {"detail": "Email został zmieniony."}, status=status.HTTP_200_OK
        )

    @action(detail=False, methods=["patch"], permission_classes=[IsAuthenticated])
    def change_password(self, request):
        user = request.user
        old_password = request.data.get("old_password", "")
        new_password = request.data.get("new_password", "")
        confirm_password = request.data.get("confirm_password", "")

        if not user.check_password(old_password):
            return Response(
                {"detail": "Stare hasło jest niepoprawne."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        if not new_password or new_password != confirm_password:
            return Response(
                {"detail": "Nowe hasła nie są identyczne."},
                status=status.HTTP_400_BAD_REQUEST,
            )

        user.set_password(new_password)
        user.save()
        return Response(
            {"detail": "Hasło zostało zmienione."}, status=status.HTTP_200_OK
        )


class CosmeticViewSet(viewsets.ModelViewSet):
    queryset = Cosmetic.objects.all()
    serializer_class = CosmeticSerializer
    permission_classes = [AllowAny]

    def create(self, request, *args, **kwargs):
        print(f"CosmeticViewSet - received data: {request.data}")

        serializer = self.get_serializer(data=request.data)
        if not serializer.is_valid():
            print(f"CosmeticViewSet - validation errors: {serializer.errors}")
            return Response(serializer.errors, status=status.HTTP_400_BAD_REQUEST)

        self.perform_create(serializer)
        headers = self.get_success_headers(serializer.data)
        return Response(
            serializer.data, status=status.HTTP_201_CREATED, headers=headers
        )

    def get_queryset(self):
        queryset = super().get_queryset()
        search_query = self.request.query_params.get("query", None)
        if search_query:
            queryset = queryset.filter(
                Q(product_name__icontains=search_query)
                | Q(barcode__icontains=search_query)
                | Q(manufacturer__icontains=search_query)
            )
        return queryset


class IngredientINCIViewSet(viewsets.ModelViewSet):
    queryset = IngredientINCI.objects.all()
    serializer_class = IngredientINCISerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        queryset = super().get_queryset()
        search_query = self.request.query_params.get("search", None)
        function_filter = self.request.query_params.get("function", None)

        if search_query:
            queryset = queryset.filter(
                Q(inci_name__icontains=search_query)
                | Q(common_name__icontains=search_query)
            )

        if function_filter:
            queryset = queryset.filter(function__icontains=function_filter)

        return queryset


class CosmeticCompositionViewSet(viewsets.ModelViewSet):
    queryset = CosmeticComposition.objects.select_related(
        "cosmetic", "ingredient"
    ).all()
    serializer_class = CosmeticCompositionSerializer
    permission_classes = [AllowAny]

    def get_serializer_class(self):
        # different serializers for read and write operations
        if self.action in ["list", "retrieve"]:
            return CosmeticCompositionReadSerializer
        return CosmeticCompositionSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        barcode = self.request.query_params.get("cosmetic", None)
        if barcode:
            queryset = queryset.filter(cosmetic__barcode=barcode)

        return queryset.order_by("order_in_composition", "ingredient__inci_name")


class ReviewViewSet(viewsets.ModelViewSet):
    queryset = Review.objects.all()
    serializer_class = ReviewSerializer


class CarePlanViewSet(viewsets.ModelViewSet):
    queryset = CarePlan.objects.all()
    serializer_class = CarePlanSerializer


class CarePlanContentViewSet(viewsets.ModelViewSet):
    queryset = CarePlanContent.objects.all()
    serializer_class = CarePlanContentSerializer


class CarePlanRatingViewSet(viewsets.ModelViewSet):
    queryset = CarePlanRating.objects.all()
    serializer_class = CarePlanRatingSerializer


class FavoriteProductViewSet(viewsets.ModelViewSet):
    queryset = FavoriteProduct.objects.all()
    serializer_class = FavoriteProductSerializer
