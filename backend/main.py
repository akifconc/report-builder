from fastapi import FastAPI, HTTPException, Depends
from fastapi.middleware.cors import CORSMiddleware
from sqlalchemy import create_engine, Column, Integer, String, Text, DateTime
from sqlalchemy.orm import declarative_base
from sqlalchemy.orm import sessionmaker, Session
from pydantic import BaseModel
from typing import List, Optional
import json
from datetime import datetime
import os

# Database setup
DATABASE_URL = "sqlite:///./reports.db"
engine = create_engine(DATABASE_URL, connect_args={"check_same_thread": False})
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
Base = declarative_base()

# Database models
class ReportModel(Base):
    __tablename__ = "reports"
    
    id = Column(Integer, primary_key=True, index=True)
    name = Column(String(255), nullable=False)
    description = Column(Text)
    layout = Column(Text)  # JSON string
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)

class SampleDataModel(Base):
    __tablename__ = "sample_data"
    
    id = Column(Integer, primary_key=True, index=True)
    data_type = Column(String(50), nullable=False)  # 'text', 'table', 'chart'
    category = Column(String(100), nullable=False)  # 'sales', 'employees', 'revenue', etc.
    data = Column(Text, nullable=False)  # JSON string
    created_at = Column(DateTime, default=datetime.utcnow)

# Create tables
Base.metadata.create_all(bind=engine)

# Pydantic models
class ReportCreate(BaseModel):
    name: str
    description: Optional[str] = ""
    layout: List[dict] = []

class ReportUpdate(BaseModel):
    name: Optional[str] = None
    description: Optional[str] = None
    layout: Optional[List[dict]] = None

class ReportResponse(BaseModel):
    id: int
    name: str
    description: str
    layout: List[dict]
    created_at: datetime
    updated_at: datetime

    class Config:
        from_attributes = True

class SampleDataResponse(BaseModel):
    id: int
    data_type: str
    category: str
    data: dict
    created_at: datetime

    class Config:
        from_attributes = True

# FastAPI app
app = FastAPI(title="Reports API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:3000"],  # Next.js default port
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Database dependency
def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

# API endpoints
@app.get("/reports", response_model=List[ReportResponse])
def get_reports(db: Session = Depends(get_db)):
    reports = db.query(ReportModel).all()
    result = []
    for report in reports:
        result.append(ReportResponse(
            id=report.id,
            name=report.name,
            description=report.description,
            layout=json.loads(report.layout) if report.layout else [],
            created_at=report.created_at,
            updated_at=report.updated_at
        ))
    return result

@app.post("/reports", response_model=ReportResponse)
def create_report(report: ReportCreate, db: Session = Depends(get_db)):
    db_report = ReportModel(
        name=report.name,
        description=report.description,
        layout=json.dumps(report.layout)
    )
    db.add(db_report)
    db.commit()
    db.refresh(db_report)
    
    return ReportResponse(
        id=db_report.id,
        name=db_report.name,
        description=db_report.description,
        layout=json.loads(db_report.layout) if db_report.layout else [],
        created_at=db_report.created_at,
        updated_at=db_report.updated_at
    )

@app.get("/reports/{report_id}", response_model=ReportResponse)
def get_report(report_id: int, db: Session = Depends(get_db)):
    report = db.query(ReportModel).filter(ReportModel.id == report_id).first()
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    
    return ReportResponse(
        id=report.id,
        name=report.name,
        description=report.description,
        layout=json.loads(report.layout) if report.layout else [],
        created_at=report.created_at,
        updated_at=report.updated_at
    )

@app.put("/reports/{report_id}", response_model=ReportResponse)
def update_report(report_id: int, report_update: ReportUpdate, db: Session = Depends(get_db)):
    report = db.query(ReportModel).filter(ReportModel.id == report_id).first()
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    
    if report_update.name is not None:
        report.name = report_update.name
    if report_update.description is not None:
        report.description = report_update.description
    if report_update.layout is not None:
        report.layout = json.dumps(report_update.layout)
    
    report.updated_at = datetime.utcnow()
    db.commit()
    db.refresh(report)
    
    return ReportResponse(
        id=report.id,
        name=report.name,
        description=report.description,
        layout=json.loads(report.layout) if report.layout else [],
        created_at=report.created_at,
        updated_at=report.updated_at
    )

@app.delete("/reports/{report_id}")
def delete_report(report_id: int, db: Session = Depends(get_db)):
    report = db.query(ReportModel).filter(ReportModel.id == report_id).first()
    if not report:
        raise HTTPException(status_code=404, detail="Report not found")
    
    db.delete(report)
    db.commit()
    return {"message": "Report deleted successfully"}

# Sample data endpoints
@app.get("/sample-data", response_model=List[SampleDataResponse])
def get_sample_data(db: Session = Depends(get_db)):
    sample_data = db.query(SampleDataModel).all()
    result = []
    for data in sample_data:
        result.append(SampleDataResponse(
            id=data.id,
            data_type=data.data_type,
            category=data.category,
            data=json.loads(data.data),
            created_at=data.created_at
        ))
    return result

@app.get("/sample-data/{data_type}")
def get_sample_data_by_type(data_type: str, db: Session = Depends(get_db)):
    sample_data = db.query(SampleDataModel).filter(SampleDataModel.data_type == data_type).all()
    result = []
    for data in sample_data:
        result.append(SampleDataResponse(
            id=data.id,
            data_type=data.data_type,
            category=data.category,
            data=json.loads(data.data),
            created_at=data.created_at
        ))
    return result

@app.post("/initialize-sample-data")
def initialize_sample_data(db: Session = Depends(get_db)):
    # Check if sample data already exists
    existing_data = db.query(SampleDataModel).first()
    if existing_data:
        return {"message": "Sample data already initialized"}
    
    # Sample text data
    text_samples = [
        {"category": "headers", "data": {"text": "Executive Summary Report"}},
        {"category": "headers", "data": {"text": "Quarterly Performance Overview"}},
        {"category": "headers", "data": {"text": "Annual Business Review"}},
        {"category": "content", "data": {"text": "Our company achieved exceptional growth this quarter with a 25% increase in revenue."}},
        {"category": "content", "data": {"text": "Key performance indicators show strong progress across all business segments."}},
        {"category": "content", "data": {"text": "Strategic initiatives have resulted in improved operational efficiency and customer satisfaction."}},
        {"category": "insights", "data": {"text": "• Sales exceeded targets by 15% due to strong market demand\n• Customer retention improved by 8% through enhanced service quality\n• New product launches contributed significantly to revenue growth"}},
    ]
    
    # Sample image data - Report-relevant images
    image_samples = [
        {"category": "charts", "data": {"src": "https://via.placeholder.com/800x400/4F46E5/FFFFFF?text=Q4+Revenue+Chart", "alt": "Quarterly revenue performance chart", "width": 800, "height": 400}},
        {"category": "infographics", "data": {"src": "https://via.placeholder.com/600x800/059669/FFFFFF?text=Growth+Metrics+Infographic", "alt": "Company growth metrics infographic", "width": 600, "height": 800}},
        {"category": "logos", "data": {"src": "https://via.placeholder.com/400x200/DC2626/FFFFFF?text=Company+Logo", "alt": "Company logo and branding", "width": 400, "height": 200}},
        {"category": "diagrams", "data": {"src": "https://via.placeholder.com/700x500/7C3AED/FFFFFF?text=Process+Flow+Diagram", "alt": "Business process flow diagram", "width": 700, "height": 500}},
        {"category": "mockups", "data": {"src": "https://via.placeholder.com/800x600/EA580C/FFFFFF?text=Product+Mockup", "alt": "Product design mockup", "width": 800, "height": 600}},
    ]
    
    # Sample table data
    table_samples = [
        {"category": "sales", "data": {"headers": ["Month", "Revenue", "Growth %", "Target"], "rows": [["January", "$125,000", "15%", "$120,000"], ["February", "$142,000", "22%", "$130,000"], ["March", "$158,000", "18%", "$140,000"], ["April", "$175,000", "28%", "$150,000"]]}},
        {"category": "employees", "data": {"headers": ["Department", "Employees", "New Hires", "Retention %"], "rows": [["Engineering", "45", "8", "94%"], ["Sales", "32", "5", "91%"], ["Marketing", "18", "3", "96%"], ["Support", "25", "4", "89%"]]}},
        {"category": "budget", "data": {"headers": ["Department", "Budget", "Actual", "Variance"], "rows": [["Marketing", "$50,000", "$48,500", "-$1,500"], ["Sales", "$75,000", "$78,200", "+$3,200"], ["Operations", "$60,000", "$62,100", "+$2,100"], ["R&D", "$40,000", "$39,800", "-$200"]]}},
    ]
    
    # Sample chart data
    chart_samples = [
        {"category": "revenue", "data": {"type": "bar", "title": "Monthly Revenue", "data": [{"name": "Jan", "value": 125000}, {"name": "Feb", "value": 142000}, {"name": "Mar", "value": 158000}, {"name": "Apr", "value": 175000}, {"name": "May", "value": 192000}, {"name": "Jun", "value": 208000}]}},
        {"category": "departments", "data": {"type": "pie", "title": "Employee Distribution", "data": [{"name": "Engineering", "value": 45}, {"name": "Sales", "value": 32}, {"name": "Marketing", "value": 18}, {"name": "Support", "value": 25}]}},
        {"category": "growth", "data": {"type": "line", "title": "Quarterly Growth", "data": [{"name": "Q1", "value": 15}, {"name": "Q2", "value": 22}, {"name": "Q3", "value": 18}, {"name": "Q4", "value": 28}]}},
    ]
    
    # Insert sample data
    for sample in text_samples:
        db_sample = SampleDataModel(
            data_type="text",
            category=sample["category"],
            data=json.dumps(sample["data"])
        )
        db.add(db_sample)
    
    for sample in image_samples:
        db_sample = SampleDataModel(
            data_type="image",
            category=sample["category"],
            data=json.dumps(sample["data"])
        )
        db.add(db_sample)
    
    for sample in table_samples:
        db_sample = SampleDataModel(
            data_type="table",
            category=sample["category"],
            data=json.dumps(sample["data"])
        )
        db.add(db_sample)
    
    for sample in chart_samples:
        db_sample = SampleDataModel(
            data_type="chart",
            category=sample["category"],
            data=json.dumps(sample["data"])
        )
        db.add(db_sample)
    
    db.commit()
    return {"message": "Sample data initialized successfully"}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000) 