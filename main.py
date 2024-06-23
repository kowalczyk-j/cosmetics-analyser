from fastapi import FastAPI, File, UploadFile, Depends
from pyzbar.pyzbar import decode
from PIL import Image
from sqlalchemy.orm import Session
from models import Cosmetic, CosmeticIngredient, INCIIngredient
from database import SessionLocal, init_db

app = FastAPI()

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

@app.on_event("startup")
def on_startup():
    init_db()

@app.post("/scan/")
async def scan_barcode(file: UploadFile = File(...), db: Session = Depends(get_db)):
    image = Image.open(file.file)
    decoded_objects = decode(image)

    if not decoded_objects:
        return {"error": "Barcode not found"}

    barcode = decoded_objects[0].data.decode("utf-8")

    cosmetic = db.query(Cosmetic).filter(Cosmetic.barcode == barcode).first()

    if not cosmetic:
        return {"error": f"Cosmetic not found. Detected barcode: {barcode}."}

    ingredients = db.query(CosmeticIngredient).filter(CosmeticIngredient.cosmetic_id == cosmetic.id).all()
    ingredient_details = []
    for ci in ingredients:
        ingredient = db.query(INCIIngredient).filter(INCIIngredient.cosing_ref_no == ci.ingredient_id).first()
        if ingredient:
            ingredient_details.append({
                "cosing_ref_no": ingredient.cosing_ref_no,
                "inci_name": ingredient.inci_name,
                "common_name": ingredient.common_name,
                "description": ingredient.description,
                "function": ingredient.function,
                "restrictions": ingredient.restrictions
            })

    return {
        "product_name": cosmetic.product_name,
        "manufacturer": cosmetic.manufacturer,
        "description": cosmetic.description,
        "category": cosmetic.category,
        "purchase_link": cosmetic.purchase_link,
        "ingredients": ingredient_details
    }

@app.get("/inci_ingredients/")
def read_inci_ingredients(skip: int = 0, limit: int = 1000, db: Session = Depends(get_db)):
    ingredients = db.query(INCIIngredient).offset(skip).limit(limit).all()
    return ingredients

@app.get("/cosmetics/")
def read_cosmetics(skip: int = 0, db: Session = Depends(get_db)):
    ingredients = db.query(Cosmetic).offset(skip).all()
    return ingredients
