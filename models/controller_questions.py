import requests
from openai_functioncall import question_generation
from controller_pdfreader import get_document_by_name
import json 
from pydantic import BaseModel
from fastapi import APIRouter

def get_document_info(document_name):
    document = get_document_by_name(document_name=document_name)
    return document.content

class Topic(BaseModel):
    topic:str
    difficulty_level:str


router = APIRouter()

@router.post("/get-questions")
async def get_questions(topic:Topic):
    content = get_document_info(topic.topic)
    questions = question_generation(context=content , difficulty_level=topic.difficulty_level)
    questions_list = []

    for question in questions:
        question_dict = {
            "question": question.question,
            "answer_choices": [choice.answer_choice for choice in question.answers],
            "correct_answer": question.answer,
            "explanation": question.explanation
        }
        questions_list.append(question_dict)
    
    return questions_list


