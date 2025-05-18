from sqlalchemy import create_engine, inspect
from sqlalchemy.orm import sessionmaker
from app.models.item import ProductInventory
import urllib.parse

# Use the same password encoding as in database.py
password = "Dodo@123"
encoded_password = urllib.parse.quote_plus(password)

SQLALCHEMY_DATABASE_URL = f"mysql+pymysql://root:{encoded_password}@localhost:3306/warehouse"

engine = create_engine(
    SQLALCHEMY_DATABASE_URL,
    pool_pre_ping=True,
    pool_recycle=3600
)
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
db = SessionLocal()

# List all tables (SQLAlchemy 2.x way)
inspector = inspect(engine)
print(inspector.get_table_names())

try:
    results = db.query(ProductInventory).all()
    print(results)
except Exception as e:
    print("Error querying ProductInventory:", e)
finally:
    db.close()