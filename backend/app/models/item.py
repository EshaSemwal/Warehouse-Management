from typing import List, Dict
from sqlalchemy.orm import Session
from sqlalchemy import Column, Integer, String, Float
from app.database import Base

class ProductInventory(Base):
    __tablename__ = "product_inventory"
    ProductID = Column(String(10), primary_key=True, index=True)
    ProductName = Column(String(100))
    Category = Column(String(50))
    Quantity = Column(Integer)
    DemandPastMonth = Column(Integer)
    Price = Column(Float)
    Zone = Column(String(1))
    ShelfLocation = Column(String(100))
    RackLocation = Column(String(100), nullable=True)
    IndividualWeight_kg = Column(Float)
    TotalWeight_kg = Column(Float)

class WarehouseArranger:
    ZONE_MAPPING = {
        "groceries": "A",
        "electronics": "B",
        "clothing": "C",
        "toys and games": "C",
        "beauty and personal care": "D",
        "fitness": "F",
        "beverage": "G",
        "books": "H",
        "stationery": "I",
        "home decor": "J"
    }
    
    @staticmethod
    def get_zone(category: str) -> str:
        return WarehouseArranger.ZONE_MAPPING.get(category.lower(), "Z")
    
    @staticmethod
    def rearrange_inventory(db: Session):
        db.execute("TRUNCATE TABLE rack_capacity")
        items = db.query(ProductInventory).order_by(ProductInventory.DemandPastMonth.desc()).all()
        for item in items:
            if not item.TotalWeight_kg:
                item.TotalWeight_kg = item.IndividualWeight_kg * item.Quantity
            item.Zone = WarehouseArranger.get_zone(item.Category)
            remaining_quantity = item.Quantity
            current_shelf = 1
            current_rack = 1
            shelf_numbers = []
            rack_numbers = []
            while remaining_quantity > 0:
                rack = db.execute(
                    f"SELECT used_weight FROM rack_capacity WHERE zone = '{item.Zone}' AND shelf = '{current_shelf}' AND rack = '{current_rack}'"
                ).fetchone()
                available_capacity = 100 - (rack.used_weight if rack else 0)
                if available_capacity <= 0:
                    current_rack += 1
                    if current_rack > 10:
                        current_shelf += 1
                        current_rack = 1
                    continue
                weight_to_place = min(
                    remaining_quantity * item.IndividualWeight_kg,
                    available_capacity
                )
                quantity_to_place = int(weight_to_place / item.IndividualWeight_kg)
                if quantity_to_place == 0 and remaining_quantity > 0:
                    quantity_to_place = 1
                if rack:
                    db.execute(
                        f"UPDATE rack_capacity SET used_weight = used_weight + {quantity_to_place * item.IndividualWeight_kg} "
                        f"WHERE zone = '{item.Zone}' AND shelf = '{current_shelf}' AND rack = '{current_rack}'"
                    )
                else:
                    db.execute(
                        f"INSERT INTO rack_capacity (zone, shelf, rack, used_weight) "
                        f"VALUES ('{item.Zone}', '{current_shelf}', '{current_rack}', {quantity_to_place * item.IndividualWeight_kg})"
                    )
                # Only append the numbers, not the zone
                shelf_numbers.append(str(current_shelf))
                rack_numbers.append(str(current_rack))
                remaining_quantity -= quantity_to_place
                current_rack += 1
                if current_rack > 10:
                    current_shelf += 1
                    current_rack = 1
            item.ShelfLocation = ",".join(shelf_numbers)
            item.RackLocation = ",".join(rack_numbers)
        db.commit()