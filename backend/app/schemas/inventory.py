from pydantic import BaseModel, Field, validator
from typing import Optional

class InventoryItemBase(BaseModel):
    ProductID: str = Field(..., example="P0001")
    ProductName: str = Field(..., min_length=1, max_length=100)
    Category: str
    Quantity: int = Field(..., ge=0)
    DemandPastMonth: int = Field(..., ge=0)
    Price: float = Field(..., gt=0)
    Zone: str = Field(..., max_length=1)
    ShelfLocation: str
    RackLocation: Optional[str] = None
    IndividualWeight_kg: float = Field(..., ge=0)
    TotalWeight_kg: float = Field(..., ge=0)

    class Config:
        orm_mode = True

    @validator('TotalWeight_kg')
    def validate_total_weight(cls, v, values):
        if 'IndividualWeight_kg' in values and 'Quantity' in values:
            expected = values['IndividualWeight_kg'] * values['Quantity']
            if abs(v - expected) > 0.01:  # Allow small floating point differences
                raise ValueError("Total weight must equal individual weight × quantity")
        return v

class InventoryItemCreate(InventoryItemBase):
    pass

class InventoryItemUpdate(BaseModel):
    Quantity: Optional[int] = Field(None, ge=0)
    ShelfLocation: Optional[str] = None
    RackLocation: Optional[str] = None
    Price: Optional[float] = Field(None, gt=0)