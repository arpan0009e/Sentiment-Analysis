import pickle
import re
import string
import numpy as np


# ======================
# Load Saved Model
# ======================
model = pickle.load(open("models/model.pkl", "rb"))

vectorizer = pickle.load(open("models/vectorizer.pkl", "rb"))


# ======================
# Clean Text Function
# ======================
def clean_text(text):
    text = str(text).lower()
    text = re.sub(r'http\S+', '', text)
    text = re.sub(r'\d+', '', text)
    text = text.translate(str.maketrans('', '', string.punctuation))
    return text


# ======================
# Prediction Function
# ======================
def predict_sentiment(text):

    # Clean text
    cleaned_text = clean_text(text)

    # Convert text to vector
    text_vector = vectorizer.transform([cleaned_text])

    # Predict sentiment
    prediction = model.predict(text_vector)[0]

    # Confidence score
    probabilities = model.predict_proba(text_vector)[0]

    confidence = float(np.max(probabilities))

    return {
        "text": text,
        "sentiment": prediction,
        "confidence": round(confidence, 4)
    }


# ======================
# Testing
# ======================
if __name__ == "__main__":

    sample = "This product is not vamazing"

    result = predict_sentiment(sample)

    print(result)