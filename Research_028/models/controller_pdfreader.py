
from pdf_reader import pdf_text_extractor
import os
import tempfile
import shutil
import sqlite3
from fastapi import APIRouter, File, UploadFile, HTTPException
from pathlib import Path
from pydantic import BaseModel
from typing import List 


router = APIRouter()

class Document(BaseModel):
    document_name: str

class DocumentContent(BaseModel):
    document_name: str
    content: str    


def init_db():
    conn = sqlite3.connect('documents.db')
    cursor = conn.cursor()
    cursor.execute('''
        CREATE TABLE IF NOT EXISTS documents (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            document_name TEXT NOT NULL,
            content TEXT NOT NULL
        )
    ''')
    conn.commit()
    conn.close()

init_db()


@router.post("/ocr_only" , tags=["OCR"])
async def ocr_only_pdf(file:UploadFile=File(...)):
    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
            shutil.copyfileobj(file.file, tmp)
            temp_file_path = tmp.name

        pdf_contents = pdf_text_extractor(pdf_file_path=temp_file_path)
        os.remove(temp_file_path)
        return {"content":pdf_contents}
    except Exception as e:
        return {"error": str(e)}
    

@router.post('/ocr_pypdf', tags=["OCR"])
async def ocr_pdf(file: UploadFile = File(...)):
    try:
        with tempfile.NamedTemporaryFile(delete=False, suffix=".pdf") as tmp:
            shutil.copyfileobj(file.file, tmp)
            temp_file_path = tmp.name

        pdf_contents = pdf_text_extractor(pdf_file_path=temp_file_path)
        os.remove(temp_file_path)

        
        if hasattr(pdf_contents, 'get_text'):
            pdf_text = pdf_contents.get_text()
        elif hasattr(pdf_contents, '__str__'):
            pdf_text = str(pdf_contents)
        else:
            raise ValueError("Unable to convert PDF contents to string")

        # Save to SQLite database
        conn = sqlite3.connect('documents.db')
        cursor = conn.cursor()
        cursor.execute('''
            INSERT INTO documents (document_name, content)
            VALUES (?, ?)
        ''', (file.filename, pdf_text))
        conn.commit()
        conn.close()

        return {"filename": file.filename, "status": "Document saved to database"}
    except Exception as e:
        return {"error": str(e)}

@router.get('/documents', tags=["Documents"], response_model=List[Document])
async def get_documents():
    try:
        conn = sqlite3.connect('documents.db')
        cursor = conn.cursor()
        cursor.execute('SELECT document_name FROM documents')
        documents = cursor.fetchall()
        conn.close()

        return [Document(document_name=doc[0]) for doc in documents]
    except Exception as e:
        return {"error": str(e)}


def get_document_by_name(document_name: str):
    try:
        conn = sqlite3.connect('documents.db')
        cursor = conn.cursor()
        cursor.execute('SELECT document_name, content FROM documents WHERE document_name = ?', (document_name,))
        document = cursor.fetchone()
        conn.close()

        if document is None:
            raise HTTPException(status_code=404, detail="Document not found")

        return DocumentContent(document_name=document[0], content=document[1])
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))