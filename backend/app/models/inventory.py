from sqlalchemy import Column, Integer, String, Float
from app.database import Base

class InventoryItem(Base):
    __tablename__ = "product_inventory"
    
    ProductID = Column(String, primary_key=True, index=True)
    ProductName = Column(String)
    Category = Column(String)
    Quantity = Column(Integer)
    DemandPastMonth = Column(Integer)
    ShelfLocation = Column(String)
    Price = Column(Float)