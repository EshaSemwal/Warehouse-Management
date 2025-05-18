from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from typing import List

# Add these imports
from app.schemas.inventory import (
    InventoryItemBase,
    InventoryItemCreate,
    InventoryItemUpdate
)
from app.models.item import ProductInventory
from app.database import get_db

router = APIRouter(prefix="/api", tags=["inventory"])

# Updated GET endpoint
@router.get("/inventory", response_model=List[InventoryItemBase])
def get_inventory(db: Session = Depends(get_db)):
    try:
        return db.query(ProductInventory).all()
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Database error: {str(e)}")

# New POST endpoint (for creating items)
@router.post("/inventory", response_model=InventoryItemBase)
def create_item(
    item: InventoryItemCreate,  # This will auto-validate the input
    db: Session = Depends(get_db)
):
    db_item = ProductInventory(**item.dict())
    db.add(db_item)
    db.commit()
    db.refresh(db_item)
    return db_item

# New PATCH endpoint (for partial updates)
@router.patch("/inventory/{product_id}", response_model=InventoryItemBase)
def update_item(
    product_id: str,
    item_update: InventoryItemUpdate,  # Only allows updating specific fields
    db: Session = Depends(get_db)
):
    db_item = db.query(ProductInventory).filter(ProductInventory.ProductID == product_id).first()
    if not db_item:
        raise HTTPException(status_code=404, detail="Item not found")
    
    update_data = item_update.dict(exclude_unset=True)
    for field, value in update_data.items():
        setattr(db_item, field, value)
    
    db.commit()
    db.refresh(db_item)
    return db_item