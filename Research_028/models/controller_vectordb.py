from fastapi import FastAPI, HTTPException
from pydantic import BaseModel
from typing import List, Optional
from fastapi.responses import JSONResponse 
from fastapi import APIRouter
from dotenv import load_dotenv
import os
# Import the VectorDBManager
from vectordb import VectorDBManager

router = APIRouter()



try:
    load_dotenv(".env")
except FileNotFoundError:
    print("No .Env File found.Please add .env file")

db_manager = VectorDBManager(
    openai_api_key=os.getenv("OPENAI_KEY"),
    persist_directory="./recruitment_project/chromadb"
)

# Pydantic models for request validation
class JobCreate(BaseModel):
    job_id: str
    job_text: str

class ResumeCreate(BaseModel):
    resume_id: str
    resume_text: str

class SearchQuery(BaseModel):
    query_text: str
    n_results: Optional[int] = 5

# Response models
class Job(BaseModel):
    id: str
    text: str

class Resume(BaseModel):
    id: str
    text: str

class SearchResult(BaseModel):
    id: str
    text: str
    distance: float

@router.post("/jobs/", response_model=dict)
async def create_job(job: JobCreate):
    """Create a new job posting"""
    try:
        db_manager.add_job(job_id=job.job_id, job_text=job.job_text)
        return {"message": f"Job {job.job_id} created successfully"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.post("/resumes/", response_model=dict)
async def create_resume(resume: ResumeCreate):
    """Create a new resume"""
    try:
        db_manager.add_resume(resume_id=resume.resume_id, resume_text=resume.resume_text)
        return {"message": f"Resume {resume.resume_id} created successfully"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@router.get("/jobs/", response_model=List[Job])
async def list_jobs():
    """List all jobs"""
    try:
        return db_manager.list_jobs()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.get("/resumes/", response_model=List[Resume])
async def list_resumes():
    """List all resumes"""
    try:
        return db_manager.list_resumes()
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.delete("/jobs/{job_id}")
async def delete_job(job_id: str):
    """Delete a job posting"""
    try:
        db_manager.delete_job(job_id)
        return {"message": f"Job {job_id} deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.delete("/resumes/{resume_id}")
async def delete_resume(resume_id: str):
    """Delete a resume"""
    try:
        db_manager.delete_resume(resume_id)
        return {"message": f"Resume {resume_id} deleted successfully"}
    except Exception as e:
        raise HTTPException(status_code=404, detail=str(e))

@router.post("/jobs/search/", response_model=List[SearchResult])
async def search_jobs(query: SearchQuery):
    """Search for similar jobs"""
    try:
        results = db_manager.search_similar_jobs(
            query_text=query.query_text,
            n_results=query.n_results
        )
        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@router.post("/resumes/search/", response_model=List[SearchResult])
async def search_resumes(query: SearchQuery):
    """Search for similar resumes"""
    try:
        results = db_manager.search_similar_resumes(
            query_text=query.query_text,
            n_results=query.n_results
        )
        return results
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))