from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from app.services.arrangement import WarehouseArranger
from app.database import get_db

router = APIRouter(prefix="/api")

@router.post("/rearrange-inventory")
def rearrange_inventory(db: Session = Depends(get_db)):
    try:
        WarehouseArranger.rearrange_inventory(db)
        return {"message": "Inventory rearrangement completed successfully"}
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))