#/*----------------- Code Done Advance -----------------------*/

from pymongo import MongoClient, ASCENDING
from datetime import datetime, timedelta
from bson import ObjectId
import os

# MongoDB connection string
connection_string = os.getenv("MONGO_URI")

# ✅ Global DB and collection reference
client = MongoClient(connection_string)
db = client["Legalhelp"]
chats_collection = db["chats"]

chat_name =  f"Chat-{datetime.now().isoformat()}"

def save_chat_to_mongodb(user_id, sender, content, chat_name):
    existing_chat = chats_collection.find_one({"user_id": user_id, "chat_name": chat_name})
    timestamp = datetime.utcnow()

    message = {
        "id": int(timestamp.timestamp() * 1000),  # Use timestamp as unique message ID
        "sender": sender,
        "text": content,
    }

    if existing_chat:
        chats_collection.update_one(
            {"_id": existing_chat["_id"]},
            {"$push": {"messages": message}}
        )
    else:
        new_chat = {
            "id": str(ObjectId()),
            "user_id": user_id,
            "chat_name": chat_name,
            "timestamp": timestamp,
            "messages": [message],
        }
        chats_collection.insert_one(new_chat)


def fetch_chat_from_mongodb(user_id: str, chat_name: str = None):
    with MongoClient(connection_string) as client:
        query = {"user_id": user_id}
        if chat_name:
            query["chat_name"] = chat_name  # Only filter by chat_name if provided

        return list(
            client["Legalhelp"]["chats"]
            .find(query)
            .sort("timestamp", ASCENDING)
        )

def clean_chat_history(user_id: str):
    """
    Clean up chat history by deleting chats older than 30 days.
    """
    with MongoClient(connection_string) as client:
        if user_id:
            client["Legalhelp"]["chats"].delete_many({"user_id": user_id})
            print(f"Cleared chat history for user: {user_id}")
        else:
            client["Legalhelp"]["chats"].delete_many(
                {"timestamp": {"$lt": datetime.now() - timedelta(days=30)}}
            )