from sqlalchemy import Column, Integer, String, Float, Text
from app.database import Base

class ProductInventory(Base):
    __tablename__ = "product_inventory"
    
    # Note: Your schema shows all fields as text, but we should use proper types
    id = Column(Integer, primary_key=True, index=True)
    ProductID = Column(String(50), unique=True, index=True)
    ProductName = Column(String(255))
    Category = Column(String(100))
    Quantity = Column(Integer)
    DemandPastMonth = Column(Integer)
    ShelfLocation = Column(String(50))
    Price = Column(Float)
    
    # For future relationships (if you add more tables)
    # items = relationship("Item", back_populates="owner")