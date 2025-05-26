import pandas as pd
import numpy as np
import torch
import joblib
from transformers import AutoTokenizer, AutoModel
from torch.utils.data import Dataset, DataLoader
import os
from pathlib import Path

class TextDataset(Dataset):
    def __init__(self, texts, tokenizer, max_length=128):
        self.texts = texts
        self.tokenizer = tokenizer
        self.max_length = max_length

    def __len__(self):
        return len(self.texts)

    def __getitem__(self, idx):
        text = str(self.texts[idx])
        encoding = self.tokenizer(
            text,
            add_special_tokens=True,
            max_length=self.max_length,
            padding='max_length',
            truncation=True,
            return_tensors='pt'
        )
        return {
            'input_ids': encoding['input_ids'].flatten(),
            'attention_mask': encoding['attention_mask'].flatten()
        }

def get_bert_embeddings(texts, model, tokenizer, device='cuda' if torch.cuda.is_available() else 'cpu'):
    dataset = TextDataset(texts, tokenizer)
    dataloader = DataLoader(dataset, batch_size=1)  # batch_size=1 for single inference
    
    embeddings = []
    model.to(device)
    model.eval()

    with torch.no_grad():
        for batch in dataloader:
            input_ids = batch['input_ids'].to(device)
            attention_mask = batch['attention_mask'].to(device)
            outputs = model(input_ids=input_ids, attention_mask=attention_mask)
            embeddings.append(outputs.last_hidden_state[:, 0, :].cpu().numpy())

    return np.vstack(embeddings)

def predict_personality(text, model_dir=os.path.join(Path(__file__).parent , "personality_model")):
    
    try:
        # Load saved components
        classifier = joblib.load(os.path.join(model_dir, 'classifier.joblib'))
        label_encoder = joblib.load(os.path.join(model_dir, 'label_encoder.joblib'))
        
        # Load BERT model and tokenizer
        tokenizer = AutoTokenizer.from_pretrained('bert-base-uncased')
        bert_model = AutoModel.from_pretrained('bert-base-uncased')
        
        # Get embeddings for the input text
        embedding = get_bert_embeddings([text], bert_model, tokenizer)
        
        # Get prediction probabilities
        probs = classifier.predict_proba(embedding)[0]
        
        # Create predictions dictionary
        predictions = {}
        for idx in np.argsort(probs)[::-1]:
            personality_type = label_encoder.inverse_transform([idx])[0]
            probability = float(probs[idx])  # Convert to float for JSON serialization
            predictions[personality_type] = probability
        print("this is prediction" , predictions)
        return predictions
        
    except Exception as e:
        return {"error": f"Prediction failed: {str(e)}"}
    

