from sqlalchemy.orm import Session
from backend.app.models.item import ProductInventory
from app.schemas.product import ProductCreate

def get_product(db: Session, product_id: str):
    return db.query(ProductInventory).filter(ProductInventory.ProductID == product_id).first()

def get_products(db: Session, skip: int = 0, limit: int = 100):
    return db.query(ProductInventory).offset(skip).limit(limit).all()

def get_products_by_location(db: Session, location: str):
    return db.query(ProductInventory).filter(ProductInventory.ShelfLocation == location).all()

def create_product(db: Session, product: ProductCreate):
    db_product = ProductInventory(**product.dict())
    db.add(db_product)
    db.commit()
    db.refresh(db_product)
    return db_product

def update_product_quantity(db: Session, product_id: str, new_quantity: int):
    db_product = db.query(ProductInventory).filter(ProductInventory.ProductID == product_id).first()
    if db_product:
        db_product.Quantity = new_quantity
        db.commit()
        db.refresh(db_product)
    return db_product