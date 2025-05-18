from pydantic import BaseModel, Field, validator
from typing import List, Optional
import re

class InventoryBase(BaseModel):
    ProductID: str = Field(
        ...,
        min_length=5,
        max_length=10,
        pattern=r'^P\d{4,}$',
        example="P0101",
        description="Must start with P followed by 4+ digits"
    )
    ProductName: str = Field(...)
    Category: str = Field(...)
    Quantity: int = Field(..., ge=0, le=10000)
    DemandPastMonth: int = Field(..., ge=0)
    Price: float = Field(..., gt=0, le=1000000)
    Zone: str = Field(..., max_length=1, pattern=r'^[A-Z]$')
    ShelfLocation: str = Field(..., max_length=10)
    RackLocation: Optional[str] = Field(None)
    IndividualWeight_kg: float = Field(..., ge=0)
    TotalWeight_kg: float = Field(..., ge=0)

    @validator('TotalWeight_kg')
    def validate_total_weight(cls, v, values):
        expected = values.get('IndividualWeight_kg', 0) * values.get('Quantity', 0)
        if abs(v - expected) > 0.001:  # Allow for floating point precision
            raise ValueError(f"Total weight should be {expected} (IndividualWeight × Quantity)")
        return v

    class Config:
        from_attributes = True
        json_schema_extra = {
            "example": {
                "ProductID": "P0101",
                "ProductName": "Premium Widget",
                "Category": "Electronics",
                "Quantity": 100,
                "DemandPastMonth": 80,
                "Price": 29.99,
                "Zone": "A",
                "ShelfLocation": "A1",
                "RackLocation": "R1",
                "IndividualWeight_kg": 0.5,
                "TotalWeight_kg": 50.0
            }
        }

class InventoryCreate(InventoryBase):
    pass

class InventoryUpdate(BaseModel):
    ProductName: Optional[str] = Field(None)
    Quantity: Optional[int] = Field(None)
    Price: Optional[float] = Field(None, gt=0, le=1000000)
    ShelfLocation: Optional[str] = Field(None)
    RackLocation: Optional[str] = Field(None)

    class Config:
        json_schema_extra = {
            "example": {
                "Quantity": 150,
                "ShelfLocation": "B2"
            }
        }