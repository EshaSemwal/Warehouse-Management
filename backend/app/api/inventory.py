from fastapi import APIRouter, Depends, HTTPException, status
from sqlalchemy.orm import Session
from typing import List
from app.models.item import ProductInventory
from app.schemas.inventory import RackCapacityBase, InventoryBase, InventoryCreate, InventoryUpdate
from ..database import get_db
from app.services.arrangement import WarehouseArranger
from sqlalchemy import text
from fastapi import Response

router = APIRouter(prefix="/inventory")

@router.post("/optimize")
def optimize_storage(db: Session = Depends(get_db)):
    WarehouseArranger.rearrange_inventory(db)
    return {"message": "Storage optimized"}

@router.get("/", response_model=List[InventoryBase])
def get_inventory(db: Session = Depends(get_db)):
    items = db.query(ProductInventory).all()
    return [InventoryBase.from_orm(item) for item in items]

@router.post("/", response_model=InventoryBase, status_code=201)
def create_item(item: InventoryCreate, db: Session = Depends(get_db)):
    existing_item = db.query(ProductInventory).filter(
        ProductInventory.ProductName == item.ProductName,
        ProductInventory.Category == item.Category
    ).first()
    if existing_item:
        existing_item.Quantity += item.Quantity
        existing_item.TotalWeight_kg = existing_item.Quantity * existing_item.IndividualWeight_kg
        db.commit()
        db.refresh(existing_item)
        # Rearrange inventory to distribute new quantity into racks
        WarehouseArranger.rearrange_inventory(db)
        db.refresh(existing_item)
        return InventoryBase.from_orm(existing_item)
    else:
        db_item = ProductInventory(**item.dict())
        db.add(db_item)
        db.commit()
        db.refresh(db_item)
        WarehouseArranger.rearrange_inventory(db)
        db.refresh(db_item)
        return InventoryBase.from_orm(db_item)

@router.patch("/{product_id}", response_model=InventoryBase)
def update_item(
    product_id: str,
    item: InventoryUpdate,
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
    
    if 'Quantity' in update_data or 'IndividualWeight_kg' in update_data:
        db_item.TotalWeight_kg = db_item.Quantity * db_item.IndividualWeight_kg
    db.commit()
    db.refresh(db_item)
    # Rearrange inventory to update rack allocation
    WarehouseArranger.rearrange_inventory(db)
    db.refresh(db_item)
    return InventoryBase.from_orm(db_item)

@router.patch("/retrieve/{product_id}", response_model=InventoryBase)
def retrieve_item(product_id: str, quantity: int, db: Session = Depends(get_db)):
    db_item = db.query(ProductInventory).filter(ProductInventory.ProductID == product_id).first()
    if not db_item:
        raise HTTPException(status_code=404, detail=f"Product {product_id} not found")
    if db_item.Quantity < quantity:
        raise HTTPException(status_code=400, detail="Not enough quantity in stock")
    db_item.Quantity -= quantity
    db_item.DemandPastMonth += quantity
    db_item.TotalWeight_kg = db_item.Quantity * db_item.IndividualWeight_kg
    db.commit()
    db.refresh(db_item)
    # Rearrange inventory to remove from last racks first
    WarehouseArranger.rearrange_inventory(db)
    db.refresh(db_item)
    return InventoryBase.from_orm(db_item)

@router.get("/rack-capacity", response_model=List[RackCapacityBase])
def get_rack_capacity(db: Session = Depends(get_db)):
    # Get all existing racks from the table
    result = db.execute(text("SELECT id, zone, shelf, rack, used_weight FROM rack_capacity")).fetchall()
    existing = {(row[1], row[2], row[3]): (row[0], row[4]) for row in result}

    # All possible zones (from ZONE_MAPPING)
    all_zones = ['A', 'B', 'C', 'D', 'F', 'G', 'H', 'I', 'J', 'Z']
    all_shelves = range(1, 21)
    all_racks = range(1, 11)
    racks = []
    next_id = max([row[0] for row in result], default=0) + 1
    for zone in all_zones:
        for shelf in all_shelves:
            for rack in all_racks:
                key = (zone, shelf, rack)
                if key in existing:
                    racks.append(RackCapacityBase(
                        id=existing[key][0],
                        zone=zone,
                        shelf=shelf,
                        rack=rack,
                        used_weight=existing[key][1]
                    ))
                else:
                    racks.append(RackCapacityBase(
                        id=next_id,
                        zone=zone,
                        shelf=shelf,
                        rack=rack,
                        used_weight=0.0
                    ))
                    next_id += 1
    return racks

@router.get("/debug/rack-contents")
def debug_rack_contents(db: Session = Depends(get_db)):
    result = db.execute(text("SELECT * FROM rack_capacity LIMIT 20")).fetchall()
    return [dict(row) for row in result]