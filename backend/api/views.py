from rest_framework import viewsets, status
from rest_framework.permissions import IsAuthenticated, AllowAny
from rest_framework.decorators import action
from rest_framework.response import Response
from django.contrib.auth.models import User
from .models import (
    Person,
    User as CustomUser,
    Cosmetic,
    IngredientINCI,
    CosmeticComposition,
    Review,
    CarePlan,
    CarePlanContent,
    CarePlanRating,
    FavoriteProduct,
)
from .serializers import (
    PersonSerializer,
    UserSerializer,
    CosmeticSerializer,
    IngredientINCISerializer,
    CosmeticCompositionSerializer,
    ReviewSerializer,
    CarePlanSerializer,
    CarePlanContentSerializer,
    CarePlanRatingSerializer,
    FavoriteProductSerializer,
)


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

    def get_queryset(self):
        queryset = super().get_queryset()
        product_name = self.request.query_params.get("product_name", None)
        category = self.request.query_params.get("category", None)
        manufacturer = self.request.query_params.get("manufacturer", None)
        barcode = self.request.query_params.get("barcode", None)

        if product_name:
            queryset = queryset.filter(product_name__icontains=product_name)
        if category:
            queryset = queryset.filter(category__iexact=category)
        if manufacturer:
            queryset = queryset.filter(manufacturer__iexact=manufacturer)
        if barcode:
            queryset = queryset.filter(barcode__iexact=barcode)

        return queryset


class IngredientINCIViewSet(viewsets.ModelViewSet):
    queryset = IngredientINCI.objects.all()
    serializer_class = IngredientINCISerializer


class CosmeticCompositionViewSet(viewsets.ModelViewSet):
    queryset = CosmeticComposition.objects.all()
    serializer_class = CosmeticCompositionSerializer


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
