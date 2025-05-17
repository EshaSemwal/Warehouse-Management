from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.api.inventory import router as inventory_router
from app.database import engine, Base

app = FastAPI()

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(inventory_router)

# Create tables (only needed if using SQLAlchemy to create tables)
Base.metadata.create_all(bind=engine)

@app.get("/")
def read_root():
    return {"message": "Warehouse Management System API"}