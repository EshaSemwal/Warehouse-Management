from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.models.item import ProductInventory
from .. import schemas
from ..database import get_db

router = APIRouter(prefix="/inventory")

@router.get("/", response_model=List[schemas.InventoryBase])

def get_inventory(db: Session = Depends(get_db)):
    return db.query(ProductInventory).all()

@router.post("/", response_model=schemas.InventoryBase, status_code=201)
def create_item(item: schemas.InventoryCreate, db: Session = Depends(get_db)):
    db_item = ProductInventory(**item.dict())
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

@router.patch("/{product_id}", response_model=schemas.InventoryBase)
def update_item(
    product_id: str,
    item: schemas.InventoryUpdate,
    db: Session = Depends(get_db)
):
    db_item = db.query(ProductInventory).filter(
        ProductInventory.ProductID == product_id
    ).first()
    
    if not db_item:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Product {product_id} not found"
        )
    
    update_data = item.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_item, field, value)
    
    # Recalculate total weight if relevant fields change
    if 'Quantity' in update_data or 'IndividualWeight_kg' in update_data:
        db_item.TotalWeight_kg = db_item.Quantity * db_item.IndividualWeight_kg
    
    db.commit()
    db.refresh(db_item)
    return db_item