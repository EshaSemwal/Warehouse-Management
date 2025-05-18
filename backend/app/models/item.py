from sqlalchemy import Column, Integer, String, Float, Text
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
    ShelfLocation = Column(String(10))
    RackLocation = Column(String(10), nullable=True)
    IndividualWeight_kg = Column(Float)
    TotalWeight_kg = Column(Float)