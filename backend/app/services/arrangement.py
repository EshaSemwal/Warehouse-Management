from app.models.item import ProductInventory
from sqlalchemy.orm import Session
from sqlalchemy import text

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
        db.execute(text("TRUNCATE TABLE rack_capacity"))
        db.commit()
        # Get all products
        items = db.query(ProductInventory).all()
        # Group by zone
        zone_map = WarehouseArranger.ZONE_MAPPING
        # Build zone->products dict
        zone_products = {}
        for item in items:
            zone = zone_map.get(item.Category.lower(), 'Z')
            if zone not in zone_products:
                zone_products[zone] = []
            zone_products[zone].append(item)
        # For each zone
        for zone, products in zone_products.items():
            products.sort(key=lambda p: p.DemandPastMonth, reverse=True)
            max_shelves = 20
            max_racks = 10
            rack_capacity = 100.0
            for product in products:
                if product.Quantity <= 0:
                    continue
                product_weight = product.IndividualWeight_kg
                if product_weight <= 0:
                    continue
                remaining_quantity = product.Quantity
                shelf_numbers = []
                rack_numbers = []
                # Fill all racks of shelf 1, then shelf 2, etc.
                for shelf_num in range(1, max_shelves+1):
                    for rack_num in range(1, max_racks+1):
                        if remaining_quantity <= 0:
                            break
                        used_weight = db.execute(text(
                            "SELECT used_weight FROM rack_capacity WHERE zone = :zone AND shelf = :shelf AND rack = :rack"
                        ), {'zone': zone, 'shelf': shelf_num, 'rack': rack_num}).fetchone()
                        current_weight = used_weight[0] if used_weight else 0.0
                        available_capacity = rack_capacity - current_weight
                        max_units = int(available_capacity // product_weight)
                        if max_units <= 0:
                            continue
                        units_to_place = min(max_units, remaining_quantity)
                        if units_to_place <= 0:
                            continue
                        weight_to_place = units_to_place * product_weight
                        # Update rack_capacity
                        if used_weight:
                            db.execute(text(
                                "UPDATE rack_capacity SET used_weight = used_weight + :used_weight WHERE zone = :zone AND shelf = :shelf AND rack = :rack"
                            ), {'used_weight': weight_to_place, 'zone': zone, 'shelf': shelf_num, 'rack': rack_num})
                        else:
                            db.execute(text(
                                "INSERT INTO rack_capacity (zone, shelf, rack, used_weight) VALUES (:zone, :shelf, :rack, :used_weight)"
                            ), {'zone': zone, 'shelf': shelf_num, 'rack': rack_num, 'used_weight': weight_to_place})
                        # Record shelf and rack
                        shelf_numbers.append(f"{zone}{shelf_num}")
                        rack_numbers.append(str(rack_num))
                        remaining_quantity -= units_to_place
                    if remaining_quantity <= 0:
                        break
                # Set all locations as comma-separated
                product.Zone = zone
                product.ShelfLocation = ','.join(shelf_numbers)
                product.RackLocation = ','.join(rack_numbers)
        db.commit()