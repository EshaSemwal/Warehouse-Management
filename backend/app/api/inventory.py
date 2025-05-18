from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from backend.app.models.item import InventoryItem
from app.database import get_db
from app.schemas import InventoryItemBase
from typing import List

router = APIRouter(prefix="/api", tags=["inventory"])

@router.get("/inventory", response_model=List[InventoryItemBase])
def get_inventory(db: Session = Depends(get_db)):
    try:
        items = db.query(InventoryItem).all()
        return items
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))