import pandas as pd
import re
import string
import pickle
import os

from sklearn.model_selection import train_test_split
from sklearn.feature_extraction.text import TfidfVectorizer
from sklearn.linear_model import LogisticRegression
from sklearn.metrics import accuracy_score


# ======================
# Load Dataset
# ======================
df = pd.read_csv("data/IMDB_Dataset.csv")


# ======================
# Clean Text
# ======================
def clean_text(text):
    text = str(text).lower()
    text = re.sub(r'http\S+', '', text)
    text = re.sub(r'\d+', '', text)
    text = text.translate(str.maketrans('', '', string.punctuation))
    return text


df['clean_text'] = df['text'].apply(clean_text)


# ======================
# Features and Labels
# ======================
X = df['clean_text']
y = df['sentiment']


# ======================
# Split Data
# ======================
X_train, X_test, y_train, y_test = train_test_split(
    X, y,
    test_size=0.3,
    random_state=42
)


# ======================
# TF-IDF Vectorization
# ======================
vectorizer = TfidfVectorizer(max_features=10000)

X_train_vec = vectorizer.fit_transform(X_train)
X_test_vec = vectorizer.transform(X_test)


# ======================
# Train Model
# ======================
model = LogisticRegression()

model.fit(X_train_vec, y_train)


# ======================
# Evaluation
# ======================
y_pred = model.predict(X_test_vec)

accuracy = accuracy_score(y_test, y_pred)

print(f"Accuracy: {accuracy}")


# ======================
# Save Model
# ======================
os.makedirs("models", exist_ok=True)

pickle.dump(model, open("models/model.pkl", "wb"))
pickle.dump(vectorizer, open("models/vectorizer.pkl", "wb"))

print("Model and vectorizer saved successfully!")