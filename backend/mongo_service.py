#/*----------------- Code Done Advance -----------------------*/

from pymongo import MongoClient, ASCENDING
from datetime import datetime, timedelta
import os

# MongoDB connection string
connection_string = os.getenv("MONGO_URI")

chat_name =  f"Chat-{datetime.now().isoformat()}"

def save_chat_to_mongodb(user_id, role, content):
    """
    Save a chat message in the MongoDB database.

    Args:
        user_id (str): User's unique ID.
        role (str): Role of the message sender ("user" or "assistant").
        content (str): Message content.
    """

    with MongoClient(connection_string) as client:
        chats = client["mentalhealth"]["chats"]
        chat_data = {
            "user_id": user_id,
            "role": role,
            "content": content,
            "chat_name": chat_name,  # Store the chat name
            "timestamp": datetime.now()  # Store the timestamp
        }
        chats.insert_one(chat_data)


# Function to fetch chat history for a specific user
def fetch_chat_from_mongodb(user_id: str):
    """
    Fetch chat history for a specific user from MongoDB.

    Args:
        user_id (str): The user's unique identifier.

    Returns:
        list: List of chat messages sorted by timestamp.
    """
    with MongoClient(connection_string) as client:
        return list(
            client["mentalhealth"]["chat"]
            .find({"user_id": user_id, "chat_name": chat_name})
            .sort("timestamp", ASCENDING)
        )

def clean_chat_history(user_id: str):
    """
    Clean up chat history by deleting chats older than 30 days.
    """
    with MongoClient(connection_string) as client:
        if user_id:
            client["mentalhealth"]["chats"].delete_many({"user_id": user_id})
            print(f"Cleared chat history for user: {user_id}")
        else:
            client["mentalhealth"]["chats"].delete_many(
                {"timestamp": {"$lt": datetime.now() - timedelta(days=30)}}
            )