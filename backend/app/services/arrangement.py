from typing import List, Dict
from app.models.item import ProductInventory
from sqlalchemy.orm import Session

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
        # Clear existing rack capacity data
        db.execute("TRUNCATE TABLE rack_capacity")
        
        # Get all items sorted by demand (descending)
        items = db.query(ProductInventory).order_by(ProductInventory.DemandPastMonth.desc()).all()
        
        for item in items:
            # Calculate total weight if not already set
            if not item.TotalWeight_kg:
                item.TotalWeight_kg = item.IndividualWeight_kg * item.Quantity
            
            # Set zone based on category
            item.Zone = WarehouseArranger.get_zone(item.Category)
            
            remaining_quantity = item.Quantity
            current_shelf = 1
            current_rack = 1
            
            while remaining_quantity > 0:
                rack_id = f"{item.Zone}{current_shelf}-{current_rack}"
                
                # Check rack capacity
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
                
                # Calculate how much we can place in this rack
                weight_to_place = min(
                    remaining_quantity * item.IndividualWeight_kg,
                    available_capacity
                )
                quantity_to_place = int(weight_to_place / item.IndividualWeight_kg)
                
                # Update rack capacity
                if rack:
                    db.execute(
                        f"UPDATE rack_capacity SET used_weight = used_weight + {weight_to_place} "
                        f"WHERE zone = '{item.Zone}' AND shelf = '{current_shelf}' AND rack = '{current_rack}'"
                    )
                else:
                    db.execute(
                        f"INSERT INTO rack_capacity (zone, shelf, rack, used_weight) "
                        f"VALUES ('{item.Zone}', '{current_shelf}', '{current_rack}', {weight_to_place})"
                    )
                
                # Update item location
                item.shelf = f"{item.Zone}{current_shelf}"
                item.rack = f"{item.Zone}{current_shelf}-{current_rack}"
                item.location = f"{item.Zone}-{current_shelf}-{current_rack}"
                
                remaining_quantity -= quantity_to_place
                current_rack += 1
                if current_rack > 10:
                    current_shelf += 1
                    current_rack = 1
            
            db.commit()