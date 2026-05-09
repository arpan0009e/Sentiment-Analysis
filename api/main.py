from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel

from src.predict import predict_sentiment


# ==========================================
# Create FastAPI Application
# ==========================================
app = FastAPI(
    title="Sentiment Analysis API",
    description="API for predicting sentiment from text",
    version="1.0"
)


# ==========================================
# Enable CORS
# ==========================================
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)


# ==========================================
# Request Schema
# ==========================================
class TextInput(BaseModel):
    text: str


# ==========================================
# Home Route
# ==========================================
@app.get("/")
def home():
    return {
        "message": "Sentiment Analysis API is running successfully!"
    }


# ==========================================
# Prediction Route
# ==========================================
@app.post("/predict")
def predict(data: TextInput):

    result = predict_sentiment(data.text)

    return result


# ==========================================
# Health Check Route
# ==========================================
@app.get("/health")
def health_check():

    return {
        "status": "healthy"
    }