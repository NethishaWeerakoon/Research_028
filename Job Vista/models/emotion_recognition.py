import joblib
import mediapipe as mp
import numpy as np
from PIL import Image
import pandas as pd
import os
from video_spliter import extract_frames_from_video

class EmotionPredictor:
    def __init__(self, model_dir):
        """Initialize the emotion predictor with a trained model.
        
        Args:
            model_dir (str): Directory containing the saved model and scaler
        """
        # Load the model and scaler
        self.model = joblib.load(os.path.join(model_dir, 'emotion_model.joblib'))
        self.scaler = joblib.load(os.path.join(model_dir, 'scaler.joblib'))
        
    def extract_landmarks(self, image_path):
        """Extract facial landmarks from an image."""
        mp_face_mesh = mp.solutions.face_mesh
        face_mesh = mp_face_mesh.FaceMesh(
            static_image_mode=True,
            max_num_faces=1,
            min_detection_confidence=0.5
        )
        
        try:
            # Read image using PIL
            image = Image.open(image_path)
            if image is None:
                raise ValueError(f"Failed to load image: {image_path}")
                
            # Convert PIL image to RGB numpy array
            image_rgb = np.array(image.convert('RGB'))
            
            # Process image
            results = face_mesh.process(image_rgb)
            
            if not results.multi_face_landmarks:
                raise ValueError("No face detected in the image")
            
            # Extract landmarks
            landmarks_dict = {}
            for idx, landmark in enumerate(results.multi_face_landmarks[0].landmark):
                landmarks_dict[f'x_{idx}'] = landmark.x
                landmarks_dict[f'y_{idx}'] = landmark.y
                landmarks_dict[f'z_{idx}'] = landmark.z
            
            return pd.DataFrame([landmarks_dict])
            
        finally:
            face_mesh.close()
    
    def predict(self, image_path):
        """Predict emotion from an image.
        
        Args:
            image_path (str): Path to the image file
            
        Returns:
            dict: Predicted emotion and confidence scores
        """
        try:
            # Extract landmarks
            landmarks_df = self.extract_landmarks(image_path)
            
            # Scale features
            features_scaled = self.scaler.transform(landmarks_df)
            
            # Make prediction
            emotion_pred = self.model.predict(features_scaled)[0]
            emotion_probs = self.model.predict_proba(features_scaled)[0]
            
            # Get probability scores for all emotions
            emotion_scores = {
                emotion: prob
                for emotion, prob in zip(self.model.classes_, emotion_probs)
            }
            
            return {
                'predicted_emotion': emotion_pred,
                'confidence_scores': emotion_scores
            }
            
        except Exception as e:
            print(f"Error during prediction: {str(e)}")
            return None
    
    def predict_batch(self, image_paths):
        """Predict emotions for multiple images.
        
        Args:
            image_paths (list): List of paths to image files
            
        Returns:
            list: List of prediction results
        """
        results = []
        for image_path in image_paths:
            print(f"Processing: {image_path}")
            result = self.predict(image_path)
            results.append({
                'image_path': image_path,
                'prediction': result
            })
        return results

