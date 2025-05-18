from sqlalchemy import Column, Integer, String, Float, Text
from app.database import Base

class ProductInventory(Base):
    __tablename__ = "product_inventory"
    
    ProductID = Column(Text, primary_key=True, index=True)
    ProductName = Column(Text)
    Category = Column(Text)
    Quantity = Column(Integer)
    DemandPastMonth = Column(Integer)
    Zone = Column(Text)
    shelf = Column(String(10))
    rack = Column(String(10))
    IndividualWeight_kg = Column(Float)
    TotalWeight_kg = Column(Float)
    location = Column(String(20))