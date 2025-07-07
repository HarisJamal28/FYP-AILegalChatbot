
from flask_jwt_extended import create_access_token
from pymongo import MongoClient
from werkzeug.security import generate_password_hash, check_password_hash

connection_string = "mongodb+srv://user1:123@cluster0.lxv3d.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0"

def sign_up(email: str, password: str) -> str:
    hashed_password = generate_password_hash(password)
    with MongoClient(connection_string) as client:
        users = client["LegalHelp"]["users"]
        if users.find_one({"email": email}):
            return "User already exists. Please sign in."
        users.insert_one({"email": email, "password": hashed_password})
        return "Sign-up successful. Please sign in."

def sign_in(email: str, password: str) -> str:
    with MongoClient(connection_string) as client:
        users = client["LegalHelp"]["users"]
        user = users.find_one({"email": email})
        if not user:
            return "User not found. Please sign up."
        if not check_password_hash(user["password"], password):
            return "Invalid credentials. Please try again."
        # return str(user["_id"])  # Return user ID
        # Generate JWT token
        access_token = create_access_token(identity=str(user["_id"]))
        return access_token  # Return JWT token
