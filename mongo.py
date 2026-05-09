from pymongo import MongoClient

uri = "mongodb+srv://arpanmondal708_db_user:Arpan123@sentiment-cluster.ku7ncam.mongodb.net/?appName=sentiment-cluster"

client = MongoClient(uri)

print(client.list_database_names())