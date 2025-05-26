from openai import OpenAI 
from dotenv import load_dotenv
import os
from pydantic import BaseModel , Field
from typing import List 
from prompt_template import GENERATE_QUESTION


try:
    load_dotenv()
except FileNotFoundError:
    print("No .Env File found.Please add .env file")


api_key = os.environ.get("OPENAI_KEY")
client = OpenAI(api_key=api_key)

class AnswerChoices(BaseModel):
    answer_choice:str = Field(description="One of the multiple choieces")

class Question(BaseModel):
    question:str=Field(description="the question generated from the give context")
    answers : List[AnswerChoices]
    answer:str=Field(description="The answer key")
    explanation:str=Field(description="the explanation of why the proposed answer is correct")


class Multichoice(BaseModel):
    questions : List[Question]




def question_generation(context , difficulty_level):
    
    completion = client.beta.chat.completions.parse(
            model="gpt-4o-mini", 
            messages=[
                {"role": "system", "content": GENERATE_QUESTION ,
                "role": "user", "content":  f"{context}, Difficulty Level : {difficulty_level}"}
            ],
            response_format=Multichoice,
        )
    result = completion.choices[0].message.parsed
    return result.questions


# print(question_generation(context="SQL programming language" , difficulty_level="hard"))

