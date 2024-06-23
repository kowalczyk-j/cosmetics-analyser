import csv
from sqlalchemy.orm import Session
from models import INCIIngredient
from main import SessionLocal

def load_csv_to_db(file_path: str):
    db: Session = SessionLocal()
    with open(file_path, mode='r', encoding='ISO-8859-1') as file:
        reader = csv.DictReader(file, delimiter=';')
        for row in reader:
            ingredient = INCIIngredient(
                cosing_ref_no=row['COSING Ref No'],
                inci_name=row['INCI name'],
                common_name=row.get('INN name'),
                description=row.get('Chem/IUPAC Name / Description'),
                function=row['Function'],
                restrictions=row.get('Restriction')
            )
            db.add(ingredient)
        db.commit()

if __name__ == "__main__":
    load_csv_to_db('cosing_data.csv')
