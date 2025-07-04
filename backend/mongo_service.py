#/*----------------- Code Done Advance -----------------------*/

from pymongo import MongoClient, ASCENDING
from datetime import datetime, timedelta
import os

# MongoDB connection string
connection_string = os.getenv("MONGO_URI")

chat_name =  f"Chat-{datetime.now().isoformat()}"

def save_chat_to_mongodb(user_id, role, content, chat_name):
    """
    Save a chat message in the MongoDB database.

    Args:
        user_id (str): User's unique ID.
        role (str): Role of the message sender ("user" or "assistant").
        content (str): Message content.
    """

    with MongoClient(connection_string) as client:
        chats = client["Legalhelp"]["chats"]
        chat_data = {
            "user_id": user_id,
            "role": role,
            "content": content,
            "chat_name": chat_name,
            "timestamp": datetime.now()
        }
        chats.insert_one(chat_data)


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