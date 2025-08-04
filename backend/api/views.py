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
import re
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


def parse_restriction_description(restriction_text):
    if not restriction_text or restriction_text.strip() == "":
        return ""

    annexes = {
        "II": "Substancja zakazana w kosmetykach UE",
        "III": "Dozwolona warunkowo z ograniczeniami stężenia",
        "IV": "Dozwolony barwnik z określonymi warunkami użycia",
        "V": "Dozwolony konserwant z limitami stężeń",
        "VI": "Dozwolony filtr UV z ograniczeniami użycia",
    }

    roman_numerals = re.findall(r"\b(I{1,3}|IV|V|VI)\b", restriction_text)

    descriptions = []
    for numeral in set(roman_numerals):
        if numeral in annexes:
            descriptions.append(annexes[numeral])

    return "; ".join(descriptions) if descriptions else ""


def evaluate_ingredient_safety(function_text, restrictions):
    if restrictions and restrictions.strip():
        return "harmful"

    if not function_text:
        return "neutral"

    beneficial_functions = {
        "ABRASIVE",
        "EXFOLIATING",
        "ANTI-DANDRUFF",
        "ANTI-SEBORRHEIC",
        "ANTI-SEBUM",
        "ANTIMICROBIAL",
        "ANTIOXIDANT",
        "ASTRINGENT",
        "BLEACHING",
        "EMOLLIENT",
        "HAIR CONDITIONING",
        "HAIR WAVING OR STRAIGHTENING",
        "HUMECTANT",
        "KERATOLYTIC",
        "MOISTURISING",
        "NAIL CONDITIONING",
        "ORAL CARE",
        "OXIDISING",
        "REDUCING",
        "REFRESHING",
        "SKIN CONDITIONING",
        "SKIN CONDITIONING - EMOLLIENT",
        "SKIN CONDITIONING - HUMECTANT",
        "SKIN CONDITIONING - MISCELLANEOUS",
        "SKIN CONDITIONING - OCCLUSIVE",
        "SKIN PROTECTING",
        "SMOOTHING",
        "SOOTHING",
        "TANNING",
        "TONIC",
        "UV ABSORBER",
        "UV FILTER",
    }

    functions = re.split(r"[,;/\|]", function_text.upper())
    functions = [f.strip() for f in functions if f.strip()]

    beneficial_count = 0
    total_count = len(functions)

    for func in functions:
        if func in beneficial_functions:
            beneficial_count += 1

    # if >= 50% of functions are beneficial, mark as beneficial
    if total_count > 0 and beneficial_count / total_count >= 0.5:
        return "beneficial"

    return "neutral"


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

            # Evaluate safety and parse restrictions
            safety_rating = evaluate_ingredient_safety(function, restrictions)
            restriction_description = parse_restriction_description(restrictions)

            IngredientINCI.objects.update_or_create(
                cosing_ref_no=cosing_ref_no,
                defaults={
                    "inci_name": inci_name,
                    "common_name": common_name,
                    "action_description": action_description,
                    "function": function,
                    "restrictions": restrictions,
                    "update_date": update_date,
                    "safety_rating": safety_rating,
                    "restriction_description": restriction_description,
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

    @action(detail=True, methods=["get", "delete"], permission_classes=[AllowAny])
    def composition(self, request, pk=None):
        """
        Get or delete composition for a specific cosmetic product.
        GET: Returns list of ingredients in the cosmetic
        DELETE: Removes all ingredients from the cosmetic (admin)
        """
        cosmetic = self.get_object()

        if request.method == "GET":
            compositions = (
                CosmeticComposition.objects.filter(cosmetic=cosmetic)
                .select_related("ingredient")
                .order_by("order_in_composition")
            )

            serializer = CosmeticCompositionReadSerializer(compositions, many=True)
            return Response(serializer.data)

        elif request.method == "DELETE":
            if not request.user.is_authenticated or not request.user.is_staff:
                return Response(
                    {"error": "Admin privileges required."},
                    status=status.HTTP_403_FORBIDDEN,
                )

            # delete all composition entries for this cosmetic
            deleted_count = CosmeticComposition.objects.filter(
                cosmetic=cosmetic
            ).delete()[0]

            return Response(
                {
                    "message": f"Deleted {deleted_count} composition entries for cosmetic {cosmetic.barcode}"
                },
                status=status.HTTP_200_OK,
            )

    @action(detail=True, methods=["patch"], permission_classes=[IsAuthenticated])
    def verify(self, request, pk=None):
        if not request.user.is_authenticated or not request.user.is_staff:
            return Response(
                {"error": "Admin privileges required."},
                status=status.HTTP_403_FORBIDDEN,
            )

        cosmetic = self.get_object()
        cosmetic.is_verified = True
        cosmetic.save()

        return Response(
            {
                "message": f"Cosmetic {cosmetic.product_name} has been verified.",
                "is_verified": True,
            },
            status=status.HTTP_200_OK,
        )


class IngredientINCIViewSet(viewsets.ModelViewSet):
    queryset = IngredientINCI.objects.all()
    serializer_class = IngredientINCISerializer
    permission_classes = [AllowAny]

    def get_queryset(self):
        queryset = super().get_queryset()
        search_query = self.request.query_params.get("search", None)
        function_filter = self.request.query_params.get("function", None)
        safety_filter = self.request.query_params.get("safety", None)

        if search_query:
            queryset = queryset.filter(
                Q(inci_name__icontains=search_query)
                | Q(common_name__icontains=search_query)
            )

        if function_filter:
            queryset = queryset.filter(function__icontains=function_filter)

        if safety_filter:
            queryset = queryset.filter(safety_rating=safety_filter)

        return queryset

    @action(detail=False, methods=["post"], permission_classes=[IsAuthenticated])
    def recalculate_safety(self, request):
        """
        Recalculate safety ratings for all existing ingredients (admin only)
        """
        if not request.user.is_authenticated or not request.user.is_staff:
            return Response(
                {"error": "Admin privileges required."},
                status=status.HTTP_403_FORBIDDEN,
            )

        updated_count = 0
        ingredients = IngredientINCI.objects.all()

        for ingredient in ingredients:
            old_rating = ingredient.safety_rating
            new_rating = evaluate_ingredient_safety(
                ingredient.function, ingredient.restrictions
            )
            new_restriction_desc = parse_restriction_description(
                ingredient.restrictions
            )

            if (
                old_rating != new_rating
                or ingredient.restriction_description != new_restriction_desc
            ):
                ingredient.safety_rating = new_rating
                ingredient.restriction_description = new_restriction_desc
                ingredient.save()
                updated_count += 1

        return Response(
            {
                "message": f"Updated safety ratings for {updated_count} ingredients.",
                "updated_count": updated_count,
                "total_count": ingredients.count(),
            },
            status=status.HTTP_200_OK,
        )


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
