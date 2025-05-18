from pydantic import BaseModel, Field, field_validator
from typing import Optional

class InventoryBase(BaseModel):
    ProductID: str = Field(..., pattern=r'^P\d{4}$', example="P0001")
    ProductName: str = Field(...)
    Category: str = Field(...)
    Quantity: int = Field(..., ge=0, le=10000)
    DemandPastMonth: int = Field(..., ge=0)
    Price: float = Field(..., gt=0, le=1000000)
    Zone: str = Field(..., pattern=r'^[A-Z]$')
    ShelfLocation: str = Field(..., pattern=r'^[A-Z]\d+$')
    RackLocation: Optional[str] = Field(None, pattern=r'^[A-Z]?\d*$')
    IndividualWeight_kg: float = Field(..., ge=0)
    TotalWeight_kg: float = Field(..., ge=0)

    @field_validator('TotalWeight_kg')
    def validate_weight(cls, v, values):
        if 'IndividualWeight_kg' in values.data and 'Quantity' in values.data:
            if abs(v - (values.data['IndividualWeight_kg'] * values.data['Quantity'])) > 0.001:
                raise ValueError("Total weight must equal individual weight × quantity")
        return v

    class Config:
        orm_mode = True
        schema_extra = {
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
    ProductName: Optional[str] = None
    Quantity: Optional[int] = None
    Price: Optional[float] = None
    ShelfLocation: Optional[str] = None
    RackLocation: Optional[str] = None