from s3_download import download_s3_file
from emotion_recognition import EmotionPredictor , extract_frames_from_video
import uuid
from pydantic import BaseModel
from fastapi import APIRouter
import os 
from pathlib import Path


def predict_emotions(url):
    
    model_dir = os.path.join(Path(__file__).parent , "saved_model")
    video_path = os.path.join(Path(__file__).parent , "download" , f"{uuid.uuid4()}_sample.mp4" )
    
    if download_s3_file(url=url , output_path=video_path):
      
        predictor = EmotionPredictor(model_dir)
        frame_paths = extract_frames_from_video(video_path, fps=10)
        results = predictor.predict_batch(frame_paths)
        final_output = {}
        
        for result in results:
            frame_path = result['image_path']
            prediction = result['prediction']
            if prediction:
                print(f"\nFrame: {frame_path}")
                print(f"Emotion: {prediction['predicted_emotion']}")
                if prediction['predicted_emotion'] not in final_output.keys():
                    final_output[prediction['predicted_emotion']] = 1 
                else:
                    final_output[prediction['predicted_emotion']] += 1 
        return final_output
    else:
        return "S3 download failed"
    
    


class EmotionPrediction(BaseModel):
    s3_link:str


router = APIRouter()

@router.post("/predict-emotion")
async def predict_personality_endpoint(emotion:EmotionPrediction):
    predictions = predict_emotions(url=emotion.s3_link)
    return predictions
    
