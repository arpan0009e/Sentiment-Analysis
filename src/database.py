from pymongo import MongoClient


# MongoDB Connection
client = MongoClient("mongodb://localhost:27017/")


# Database Name
db = client["sentiment_db"]


# Collection Name
reviews_collection = db["reviews"]