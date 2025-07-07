from pydantic import BaseModel
from pymongo import MongoClient
from mongo_service import save_chat_to_mongodb, fetch_chat_from_mongodb
from fastapi import FastAPI, HTTPException, Depends, requests
from fastapi.responses import StreamingResponse, JSONResponse
from fastapi.middleware.cors import CORSMiddleware
from chatbot import chain_with_memory
from fastapi.security import OAuth2PasswordBearer
from werkzeug.security import generate_password_hash, check_password_hash
from jose import JWTError, jwt
from datetime import datetime, timedelta
from typing import List
import os


url = ["http://localhost:8000/ask", "http://localhost:8000/login", "http://localhost:8000/signup", "http://localhost:8000/chats","http://localhost:8000/logout"]
# MongoDB connection
connection_string = os.getenv("MONGO_URI")
client = MongoClient(connection_string)
db = client["Legalhelp"]
users_collection = db["users"]
chats_collection = db["chats"]

# JWT Secret Key and Algorithm
SECRET_KEY = "hdye83*gT$7yh@4G#8!3"
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 180

# FastAPI setup
app = FastAPI()

# OAuth2 Password Bearer (for token-based authentication)
oauth2_scheme = OAuth2PasswordBearer(tokenUrl="token")

class User(BaseModel):
    firstname: str
    lastname: str
    email: str
    about: str
    password: str

class Login(BaseModel):
    email: str
    password: str

class Question(BaseModel):
    question: str

class Chat(BaseModel):
    user_id: str
    role: str
    content: str
    chat_name: str
    timestamp: str

app = FastAPI()

app.add_middleware(
    CORSMiddleware
    , allow_origins = ["*"]
    , allow_methods = ["*"]
    , allow_headers = ["*"]
)

def format_response(response):
    """
    Format the response with Markdown-style bullet points.
    """
    if "\n" in response:
        # Split the response into lines and add bullet points
        lines = response.split("\n")
        formatted_response = "\n".join(f" {line}" for line in lines)
        return formatted_response
    return response

# Decode JWT token and extract user_id
def get_current_user(token: str):
    credentials_exception = HTTPException(
        status_code=401,
        detail="Could not validate credentials",
        headers={"WWW-Authenticate": "Bearer"},
    )
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id = payload.get("sub")
        if user_id is None:
            raise credentials_exception
        return user_id
    except JWTError:
        raise credentials_exception

@app.post("/ask")
def handle_question(input: Question, token: str = Depends(oauth2_scheme)):
    try:
        if input:
            user_id = get_current_user(token)
            
            # 🔥 Generate unique chat_name (timestamp or session-based)
            chat_name = f"Chat-{datetime.utcnow().strftime('%Y-%m-%d %H:%M:%S')}"

            # Save User Question
            save_chat_to_mongodb(user_id, "user", input.question, chat_name)

            def response_stream():
                response_generator = chain_with_memory.stream(
                    {"query": input.question},
                    config={"configurable": {"session_id": user_id}}
                )
                response = ""
                for chunk in response_generator:
                    response += chunk
                    yield format_response(chunk)

                # Save Assistant Response
                save_chat_to_mongodb(user_id, "assistant", response, chat_name)

            return StreamingResponse(response_stream(), media_type="text/plain")
        else:
            return JSONResponse(content={"response": "No question provided."})
    except Exception as e:
        print(f"Error handling question: {str(e)}")
        raise HTTPException(status_code=500, detail=str(e))


# Helper functions
def create_access_token(data: dict, expires_delta: timedelta = None):
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def verify_password(plain_password, hashed_password):
    return check_password_hash(hashed_password, plain_password)

def get_user(email: str):
    return users_collection.find_one({"email": email})

# Sign-up Route
@app.post("/signup")
async def sign_up(user: User):
    hashed_password = generate_password_hash(user.password)
    if get_user(user.email):
        raise HTTPException(status_code=400, detail="User already exists.")
    users_collection.insert_one({"firstname": user.firstname, "lastname": user.lastname, "email": user.email, "about": user.about, "password": hashed_password})
    return {"message": "Sign-up successful. Please sign in."}

# Login Route (Generate token)
@app.post("/login")
async def login_for_access_token(user: Login):
    db_user = get_user(user.email)
    if not db_user:
        raise HTTPException(status_code=404, detail="User not found.")
    if not verify_password(user.password, db_user["password"]):
        raise HTTPException(status_code=401, detail="Invalid credentials.")
    
    access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(data={"sub": user.email}, expires_delta=access_token_expires)
    return {"accessToken": access_token, 
            "token_type": "Bearer", 
            "firstname": db_user["firstname"],
            "lastname": db_user["lastname"],
            "email": db_user["email"],
            "about": db_user["about"],
            "expires_in": access_token_expires.total_seconds()  # Expiry time in seconds
        }

@app.post("/refresh-token")
async def refresh_token(token: str):
    try:
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        email = payload.get("sub")
        if not email:
            raise HTTPException(status_code=401, detail="Invalid token.")

        # Generate new token
        access_token_expires = timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
        new_token = create_access_token(data={"sub": email}, expires_delta=access_token_expires)
        return {"accessToken": new_token, "expires_in": access_token_expires.total_seconds()}
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token has expired.")
    except jwt.InvalidTokenError:
        raise HTTPException(status_code=401, detail="Invalid token.")



@app.get("/chats", response_model=List[Chat])
async def get_chat_history(token: str = Depends(oauth2_scheme)):
    try:
        # Decode token to get user ID
        user_id = get_current_user(token)

        # Properly get chat list using to_list
        chats = await chats_collection.find({"user_id": user_id}).to_list(length=100)

        if not chats:
            raise HTTPException(status_code=404, detail="No chats found for this user")

        # Optionally remove _id if Chat model doesn't support it
        for chat in chats:
            chat.pop("_id", None)

        return chats

    except Exception as e:
        print("Error:", e)
        raise HTTPException(status_code=500, detail="Internal Server Error")

    
@app.post("/logout")
async def logout(token: str = Depends(oauth2_scheme)):
    """
    Client-side should delete the token. Optionally, we can implement token blacklisting here.
    """
    # No real server-side invalidation unless using token blacklisting.
    return {"message": "Logged out successfully. Please delete the token on the client side."}
