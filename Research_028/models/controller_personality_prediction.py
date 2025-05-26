import json 
from pydantic import BaseModel
from fastapi import APIRouter
from personality_prediction import predict_personality


class PersonalityPrediction(BaseModel):
    sentence:str


router = APIRouter()

@router.post("/predict-personality")
async def predict_personality_endpoint(personality:PersonalityPrediction):
    predictions = predict_personality(text=personality.sentence)
    
    predictions_list = {}
    if "error" not in predictions:
        for personality_type, probability in predictions.items():
            predictions_list[personality_type] = f"{round(probability , 2)}%"
        print("returned predictions" , predictions_list)
        return predictions_list
    else:
        print(predictions["error"]) 

