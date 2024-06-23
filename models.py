from sqlalchemy import Column, Integer, String, ForeignKey, Text, Date, Float
from sqlalchemy.orm import relationship
from database import Base

class User(Base):
    __tablename__ = "users"
    id = Column(Integer, primary_key=True, index=True)
    username = Column(String, unique=True, index=True)
    email = Column(String, unique=True, index=True)
    password = Column(String)
    skin_type = Column(String)
    skin_problems = Column(String)
    registration_date = Column(Date)
    specialization = Column(String, nullable=True)

class Cosmetic(Base):
    __tablename__ = "cosmetics"
    id = Column(Integer, primary_key=True, index=True)
    product_name = Column(String, index=True)
    manufacturer = Column(String)
    barcode = Column(String, unique=True)
    description = Column(Text)
    category = Column(String)
    purchase_link = Column(String)

class INCIIngredient(Base):
    __tablename__ = "inci_ingredients"
    cosing_ref_no = Column(String, primary_key=True, index=True)
    inci_name = Column(String, index=True)
    common_name = Column(String, nullable=True)
    description = Column(Text)
    function = Column(String)
    restrictions = Column(String)

class CosmeticIngredient(Base):
    __tablename__ = "cosmetic_ingredients"
    id = Column(Integer, primary_key=True, index=True)
    cosmetic_id = Column(Integer, ForeignKey("cosmetics.id"))
    ingredient_id = Column(String, ForeignKey("inci_ingredients.cosing_ref_no"))

class Review(Base):
    __tablename__ = "reviews"
    id = Column(Integer, primary_key=True, index=True)
    cosmetic_id = Column(Integer, ForeignKey("cosmetics.id"))
    user_id = Column(Integer, ForeignKey("users.id"))
    title = Column(String)
    content = Column(Text)
    rating = Column(Float)
    review_date = Column(Date)

class CarePlan(Base):
    __tablename__ = "care_plans"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    plan_name = Column(String)
    description = Column(Text)
    start_date = Column(Date)
    end_date = Column(Date, nullable=True)

class CarePlanContent(Base):
    __tablename__ = "care_plan_contents"
    id = Column(Integer, primary_key=True, index=True)
    plan_id = Column(Integer, ForeignKey("care_plans.id"))
    cosmetic_id = Column(Integer, ForeignKey("cosmetics.id"))
    frequency = Column(String)
    time_of_day = Column(String)
    notes = Column(Text, nullable=True)

class CarePlanRating(Base):
    __tablename__ = "care_plan_ratings"
    id = Column(Integer, primary_key=True, index=True)
    plan_id = Column(Integer, ForeignKey("care_plans.id"))
    user_id = Column(Integer, ForeignKey("users.id"))
    rating = Column(String)  # "positive" or "negative"

class FavoriteProduct(Base):
    __tablename__ = "favorite_products"
    id = Column(Integer, primary_key=True, index=True)
    user_id = Column(Integer, ForeignKey("users.id"))
    cosmetic_id = Column(Integer, ForeignKey("cosmetics.id"))
