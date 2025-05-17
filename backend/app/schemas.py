from pydantic import BaseModel
from typing import List

class InventoryItemBase(BaseModel):
    ProductID: str
    ProductName: str
    Category: str
    Quantity: int
    DemandPastMonth: int
    ShelfLocation: str
    Price: float

    class Config:
        from_attributes = True  # This replaces the deprecated `orm_mode = True`