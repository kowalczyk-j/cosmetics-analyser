from django.db import models
from django.contrib.auth.models import User


class Person(models.Model):  # Osoba
    user = models.OneToOneField(
        User, on_delete=models.CASCADE, related_name="person", null=True
    )
    skin_type = models.CharField(
        max_length=50, verbose_name="Skin Type", default="normal"
    )
    skin_problems = models.TextField(verbose_name="Skin Problems", default="None")
    specialization = models.CharField(
        max_length=20, verbose_name="Specialization", default="user"
    )

    def __str__(self):
        return self.specialization


class Cosmetic(models.Model):  # Kosmetyk
    product_name = models.CharField(
        max_length=100, verbose_name="Product Name", db_index=True
    )
    manufacturer = models.CharField(
        max_length=50, verbose_name="Manufacturer", db_index=True
    )
    barcode = models.CharField(
        primary_key=True, max_length=13, verbose_name="Barcode"
    )  # id
    description = models.TextField(verbose_name="Description", blank=True, null=True)
    category = models.CharField(max_length=50, verbose_name="Category", db_index=True)
    purchase_link = models.URLField(
        max_length=200, verbose_name="Purchase Link", blank=True, null=True
    )
    is_verified = models.BooleanField(
        default=True, verbose_name="Is Verified", db_index=True
    )

    class Meta:
        indexes = [
            models.Index(fields=["product_name"]),
            models.Index(fields=["manufacturer"]),
            models.Index(fields=["category"]),
            models.Index(fields=["manufacturer", "category"]),
        ]
        verbose_name = "Cosmetic Product"
        verbose_name_plural = "Cosmetic Products"

    def __str__(self):
        return self.product_name


class IngredientINCI(models.Model):  # Składnik_INCI
    SAFETY_CHOICES = [
        ("harmful", "Potencjalnie szkodliwy"),
        ("neutral", "Neutralny"),
        ("beneficial", "Korzystny"),
    ]

    cosing_ref_no = models.IntegerField(primary_key=True, verbose_name="COSING Ref No")
    inci_name = models.CharField(
        max_length=200, verbose_name="INCI Name", db_index=True
    )
    common_name = models.CharField(
        max_length=200, verbose_name="Common Name", blank=True, null=True, db_index=True
    )
    action_description = models.TextField(
        verbose_name="Action Description", blank=True, null=True
    )
    function = models.CharField(
        max_length=200, verbose_name="Function", blank=True, null=True, db_index=True
    )
    restrictions = models.TextField(verbose_name="Restrictions", blank=True, null=True)
    update_date = models.CharField(
        max_length=20, verbose_name="Update Date", blank=True, null=True
    )
    safety_rating = models.CharField(
        max_length=20,
        choices=SAFETY_CHOICES,
        default="neutral",
        verbose_name="Safety Rating",
        db_index=True,
    )
    restriction_description = models.TextField(
        verbose_name="Restriction Description", blank=True, null=True
    )

    class Meta:
        indexes = [
            models.Index(fields=["inci_name"]),
            models.Index(fields=["common_name"]),
            models.Index(fields=["function"]),
            models.Index(fields=["inci_name", "function"]),
        ]
        verbose_name = "INCI Ingredient"
        verbose_name_plural = "INCI Ingredients"

    def __str__(self):
        return self.inci_name


class CosmeticComposition(models.Model):  # Skład_kosmetyku
    cosmetic = models.ForeignKey(
        Cosmetic,
        on_delete=models.CASCADE,
        related_name="ingredients",
        to_field="barcode",
    )
    ingredient = models.ForeignKey(
        IngredientINCI, on_delete=models.CASCADE, related_name="cosmetics"
    )
    order_in_composition = models.PositiveIntegerField(
        verbose_name="Order in INCI list",
        help_text="Order as listed on product (1=highest concentration)",
        null=True,
        blank=True,
    )

    class Meta:
        unique_together = ["cosmetic", "ingredient"]
        ordering = ["order_in_composition"]
        indexes = [
            models.Index(fields=["cosmetic"]),
            models.Index(fields=["ingredient"]),
            models.Index(fields=["cosmetic", "order_in_composition"]),
        ]
        verbose_name = "Cosmetic Composition"
        verbose_name_plural = "Cosmetic Compositions"

    def save(self, *args, **kwargs):
        # Automatyczne ustawienie kolejności
        if self.order_in_composition is None:
            last_order = CosmeticComposition.objects.filter(
                cosmetic=self.cosmetic
            ).aggregate(models.Max("order_in_composition"))["order_in_composition__max"]
            self.order_in_composition = (last_order or 0) + 1
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.cosmetic.product_name} - {self.ingredient.inci_name} (#{self.order_in_composition})"


class Review(models.Model):  # Recenzja
    cosmetic = models.ForeignKey(Cosmetic, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    title = models.CharField(max_length=100, verbose_name="Title")
    content = models.TextField(verbose_name="Content")
    rating = models.IntegerField(verbose_name="Rating")
    review_date = models.DateField(verbose_name="Review Date")

    def __str__(self):
        return f"{self.title} - {self.rating}"


class CarePlan(models.Model):  # Plan_pielęgnacji
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    plan_name = models.CharField(max_length=50, verbose_name="Plan Name")
    description = models.TextField(verbose_name="Description")
    start_date = models.DateField(verbose_name="Start Date")
    end_date = models.DateField(verbose_name="End Date", blank=True, null=True)

    def __str__(self):
        return self.plan_name


class CarePlanContent(models.Model):  # Zawartość_planu_pielęgnacji
    plan = models.ForeignKey(CarePlan, on_delete=models.CASCADE)
    cosmetic = models.ForeignKey(Cosmetic, on_delete=models.CASCADE)
    frequency = models.CharField(max_length=50, verbose_name="Frequency")
    time_of_day = models.CharField(max_length=50, verbose_name="Time of Day")
    notes = models.TextField(verbose_name="Notes", blank=True, null=True)


class CarePlanRating(models.Model):  # Ocena_planu_pielęgnacji
    plan = models.ForeignKey(CarePlan, on_delete=models.CASCADE)
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    rating = models.BooleanField(verbose_name="Rating")


class FavoriteProduct(models.Model):  # Ulubione_produkty
    user = models.ForeignKey(User, on_delete=models.CASCADE)
    cosmetic = models.ForeignKey(Cosmetic, on_delete=models.CASCADE)
