from fastapi import APIRouter, HTTPException
from sqlalchemy.orm import Session
from app.database import get_db
from app.models import InventoryItem  # You'll need to create this model
from typing import List

router = APIRouter()

@router.get("/inventory", response_model=List[InventoryItem])
def get_inventory(db: Session = Depends(get_db)):
    try:
        inventory = db.query(InventoryItem).all()
        return inventory
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))