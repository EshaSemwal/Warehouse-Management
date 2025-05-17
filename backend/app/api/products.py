from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

# Import the specific classes you need
from app.schemas.product import Product, ProductCreate
from app.database import get_db
from app.crud import product as crud  # Import CRUD operations

router = APIRouter()

@router.get("/test-route")
def test():
    return {"message": "Test successful"}

@router.post("/products/", response_model=Product)
def create_product(product: ProductCreate, db: Session = Depends(get_db)):
    db_product = crud.get_product(db, ProductID=product.ProductID)
    if db_product:
        raise HTTPException(status_code=400, detail="Product already exists")
    return crud.create_product(db=db, product=product)

@router.get("/products/", response_model=List[Product])
def read_products(skip: int = 0, limit: int = 100, db: Session = Depends(get_db)):
    products = crud.get_products(db, skip=skip, limit=limit)
    return products

@router.get("/products/{product_id}", response_model=Product)
def read_product(product_id: str, db: Session = Depends(get_db)):
    db_product = crud.get_product(db, product_id=product_id)
    if db_product is None:
        raise HTTPException(status_code=404, detail="Product not found")
    return db_product

@router.get("/products/location/{location}", response_model=List[Product])
def read_products_by_location(location: str, db: Session = Depends(get_db)):
    products = crud.get_products_by_location(db, location=location)
    return products

