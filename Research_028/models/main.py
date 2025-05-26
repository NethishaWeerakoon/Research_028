from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from controller_pdfreader import router as pdf_router
from controller_questions import router as question_router 
from controller_vectordb import router as vector_router
from controller_personality_prediction import router as personality_router
from controller_emotion_detection import router as emotion_router
import os 
from pathlib import Path
import shutil



dowloads_path= os.path.join(Path(__file__).parent , "download") 
temp_images = os.path.join(Path(__file__).parent , "temp_images") 


def delete_and_create_folder(path):
   
    if os.path.exists(path):
        shutil.rmtree(path)
    os.makedirs(path)



app = FastAPI()
app.add_middleware(
    CORSMiddleware, 
    allow_origins=["*"] ,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"] 

)

app.include_router(pdf_router , prefix="/recruitment-project/pdfreader")
app.include_router(question_router , prefix="/recruitment-project/questions")
app.include_router(vector_router , prefix="/recruitment-project/vectorsearch")
app.include_router(personality_router, prefix="/recruitment-project/personality")
app.include_router(emotion_router, prefix="/recruitment-project/emotion")

@app.on_event("startup")
async def startup():
    delete_and_create_folder(path=dowloads_path)
    delete_and_create_folder(path=temp_images)