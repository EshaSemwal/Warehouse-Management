from pydantic import BaseModel
from typing import Optional

class ProductBase(BaseModel):
    ProductID: str
    ProductName: str
    Category: str
    Quantity: int
    DemandPastMonth: int
    ShelfLocation: str
    Price: float

class ProductCreate(ProductBase):
    pass

class Product(ProductBase):
    class Config:
        orm_mode = True  # Allows ORM objects to be converted to Pydantic models