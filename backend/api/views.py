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
