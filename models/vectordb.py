import chromadb
from chromadb.config import Settings
from openai import OpenAI
import os
from typing import List, Dict, Optional
import json

class VectorDBManager:
    def __init__(self, openai_api_key: str, persist_directory: str = "./vector_db"):
        """
        Initialize the Vector Database Manager.
        
        Args:
            openai_api_key (str): OpenAI API key for generating embeddings
            persist_directory (str): Directory to persist ChromaDB data
        """
        self.client = OpenAI(api_key=openai_api_key)
        
        # Initialize ChromaDB with persistence
        self.chroma_client = chromadb.PersistentClient(path=persist_directory)
        
        # Create collections for jobs and resumes
        self.jobs_collection = self.chroma_client.get_or_create_collection(name="jobs")
        self.resumes_collection = self.chroma_client.get_or_create_collection(name="resumes")

    def _generate_embedding(self, text: str) -> List[float]:
        """
        Generate embeddings using OpenAI's API.
        
        Args:
            text (str): Text to generate embedding for
            
        Returns:
            List[float]: Vector embedding
        """
        response = self.client.embeddings.create(
            input=text,
            model="text-embedding-3-small"
        )
        return response.data[0].embedding

    def add_job(self, job_id: str, job_text: str) -> None:
        """
        Add a job posting to the database.
        
        Args:
            job_id (str): Unique identifier for the job
            job_text (str): Job posting text
        """
        embedding = self._generate_embedding(job_text)
        self.jobs_collection.add(
            embeddings=[embedding],
            documents=[job_text],
            ids=[job_id]
        )

    def add_resume(self, resume_id: str, resume_text: str) -> None:
        """
        Add a resume to the database.
        
        Args:
            resume_id (str): Unique identifier for the resume
            resume_text (str): Resume text
        """
        embedding = self._generate_embedding(resume_text)
        self.resumes_collection.add(
            embeddings=[embedding],
            documents=[resume_text],
            ids=[resume_id]
        )

    def delete_job(self, job_id: str) -> None:
        """
        Delete a job posting from the database.
        
        Args:
            job_id (str): ID of the job to delete
        """
        self.jobs_collection.delete(ids=[job_id])

    def delete_resume(self, resume_id: str) -> None:
        """
        Delete a resume from the database.
        
        Args:
            resume_id (str): ID of the resume to delete
        """
        self.resumes_collection.delete(ids=[resume_id])

    def list_jobs(self) -> List[Dict]:
        """
        List all jobs in the database.
        
        Returns:
            List[Dict]: List of jobs with their IDs and documents
        """
        results = self.jobs_collection.get()
        return [
            {'id': id, 'text': doc}
            for id, doc in zip(results['ids'], results['documents'])
        ]

    def list_resumes(self) -> List[Dict]:
        """
        List all resumes in the database.
        
        Returns:
            List[Dict]: List of resumes with their IDs and documents
        """
        results = self.resumes_collection.get()
        return [
            {'id': id, 'text': doc}
            for id, doc in zip(results['ids'], results['documents'])
        ]

    def search_similar_jobs(self, query_text: str, n_results: int = 5) -> List[Dict]:
        """
        Search for similar jobs using a text query.
        
        Args:
            query_text (str): Text to search with
            n_results (int): Number of results to return
            
        Returns:
            List[Dict]: Similar jobs with their IDs, texts, and distances
        """
        query_embedding = self._generate_embedding(query_text)
        results = self.jobs_collection.query(
            query_embeddings=[query_embedding],
            n_results=n_results
        )
        return [
            {'id': id, 'text': doc, 'distance': dist}
            for id, doc, dist in zip(
                results['ids'][0], 
                results['documents'][0],
                results['distances'][0]
            )
        ]

    def search_similar_resumes(self, query_text: str, n_results: int = 5) -> List[Dict]:
        """
        Search for similar resumes using a text query.
        
        Args:
            query_text (str): Text to search with
            n_results (int): Number of results to return
            
        Returns:
            List[Dict]: Similar resumes with their IDs, texts, and distances
        """
        query_embedding = self._generate_embedding(query_text)
        results = self.resumes_collection.query(
            query_embeddings=[query_embedding],
            n_results=n_results
        )
        return [
            {'id': id, 'text': doc, 'distance': dist}
            for id, doc, dist in zip(
                results['ids'][0], 
                results['documents'][0],
                results['distances'][0]
            )
        ]
    

