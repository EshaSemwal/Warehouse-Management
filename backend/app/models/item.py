from sqlalchemy import Column, Integer, String, Float, Text
from app.database import Base

# In backend/app/models/item.py - Update to match MySQL exactly:
class ProductInventory(Base):
    __tablename__ = "product_inventory"
    
    ProductID = Column(Text, primary_key=True, index=True)
    ProductName = Column(Text)
    Category = Column(Text)
    Quantity = Column(Integer)
    DemandPastMonth = Column(Integer)
    Price = Column(Float)  # Added missing column
    Zone = Column(Text)
    ShelfLocation = Column(Text)  # Changed from 'shelf'
    RackLocation = Column(Text)   # Changed from 'rack'
    IndividualWeight_kg = Column(Float)
    TotalWeight_kg = Column(Float)
    # Removed 'location' as it doesn't exist in MySQL