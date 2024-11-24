from rest_framework import viewsets
from .models import (
    Person,
    User,
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


class CosmeticViewSet(viewsets.ModelViewSet):
    queryset = Cosmetic.objects.all()
    serializer_class = CosmeticSerializer

    def get_queryset(self):
        queryset = super().get_queryset()
        # Pobierz parametry zapytania z request
        product_name = self.request.query_params.get("product_name", None)
        category = self.request.query_params.get("category", None)
        manufacturer = self.request.query_params.get("manufacturer", None)

        # Filtruj dane na podstawie parametrów
        if product_name:
            queryset = queryset.filter(product_name__icontains=product_name)
        if category:
            queryset = queryset.filter(category__iexact=category)
        if manufacturer:
            queryset = queryset.filter(manufacturer__iexact=manufacturer)

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
