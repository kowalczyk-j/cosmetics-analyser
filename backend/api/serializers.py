from rest_framework import serializers
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


class PersonSerializer(serializers.ModelSerializer):
    class Meta:
        model = Person
        fields = ["id", "skin_type", "skin_problems", "specialization"]


class UserSerializer(serializers.ModelSerializer):
    person = PersonSerializer()

    class Meta:
        model = User
        fields = ["id", "username", "email", "password", "person"]
        extra_kwargs = {"password": {"write_only": True}}

    def create(self, validated_data):
        # Pobierz dane związane z Person
        person_data = validated_data.pop("person", None)

        # Stwórz użytkownika
        user = User.objects.create_user(**validated_data)

        # Powiąż obiekt Person, jeśli dane zostały podane
        if person_data:
            Person.objects.create(user=user, **person_data)

        return user


class CosmeticSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cosmetic
        fields = [
            "id",
            "product_name",
            "manufacturer",
            "barcode",
            "description",
            "category",
            "purchase_link",
        ]


class IngredientINCISerializer(serializers.ModelSerializer):
    class Meta:
        model = IngredientINCI
        fields = [
            "cosing_ref_no",
            "inci_name",
            "common_name",
            "action_description",
            "function",
            "restrictions",
        ]


class CosmeticCompositionSerializer(serializers.ModelSerializer):
    cosmetic = CosmeticSerializer()
    ingredient = IngredientINCISerializer()

    class Meta:
        model = CosmeticComposition
        fields = ["id", "cosmetic", "ingredient"]


class ReviewSerializer(serializers.ModelSerializer):
    cosmetic = CosmeticSerializer()
    user = UserSerializer()

    class Meta:
        model = Review
        fields = ["id", "cosmetic", "user", "title", "content", "rating", "review_date"]


class CarePlanSerializer(serializers.ModelSerializer):
    user = UserSerializer()

    class Meta:
        model = CarePlan
        fields = ["id", "user", "plan_name", "description", "start_date", "end_date"]


class CarePlanContentSerializer(serializers.ModelSerializer):
    plan = CarePlanSerializer()
    cosmetic = CosmeticSerializer()

    class Meta:
        model = CarePlanContent
        fields = ["id", "plan", "cosmetic", "frequency", "time_of_day", "notes"]


class CarePlanRatingSerializer(serializers.ModelSerializer):
    plan = CarePlanSerializer()
    user = UserSerializer()

    class Meta:
        model = CarePlanRating
        fields = ["id", "plan", "user", "rating"]


class FavoriteProductSerializer(serializers.ModelSerializer):
    user = UserSerializer()
    cosmetic = CosmeticSerializer()

    class Meta:
        model = FavoriteProduct
        fields = ["id", "user", "cosmetic"]
