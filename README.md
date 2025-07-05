# Chatbot-Project 🚀

## Project Overview

## Project Members
1. Haris Jamal - 21pwbcs0874
2. Ahsen Khalil - 21pwbcs0885

## Project Tech-Stack & Deployment
### 1. Tech Stack
- The Project is developed using 
1. **React.js** & **TailwindCSS**
2. **React SpeechRecognition Library for Voice Input**
2. **MongoDB Atlas for Database**
3. **Python**
4. **OpenAI Model**
5. **langchain chain for LLM chaining and chatHistory for memory context**, and **chromaDB for embeddings**.
- The Model is being fine-tuned on the provided JSON data and generates response based on the similarity search between stored emeddings and the user input.
### 2. Deployment
- The frontend is being deployed on [Vercel](https://vercel.com) using default build production.
- The backend is beinf deployed on [Railway](https://railway.com) using Docker containerization tool.

## Project Setup
### Backend
- goto backend folder using command: "**cd backend**"
- create the environment by the following command:
"**python -m venv env**"
- activate the environment using command: "**env\scripts\activate**" if using cmd in windows.
- if using powershell, then try using command: "**env\scripts\activate.ps1**" for activation of environment.
- install the mentioned dependencies mentioned in requirements.txt file by using the command: "**pip install -r requirements.txt**"
- create a file named "**.env**" and add your **OPENAI_API_KEY** & **MONGO_URI** in it.
- run the backend server by using command: "**uvicorn chatbot_api:app**"

### Frontend
- goto frontend folder using command: "**cd frontend**"
- install all the node modules by: "**npm i**"
- run the frontend server using command: "**npm run dev**"

### Database - MongoDB
- install mongoDB, if not installed
- connect mongoDB with the chatbot
- create variable **MONGO_URI** in .env with the mongoDB localhost URI.

#### Note: This Project is under MIT Licence. So, if anyone wants to add features or want to contribute, create a PR for your input and will be then merged if found useful. 
#### If found some issues in current release, please raise in issue and create a PR for it.

### Thank You Everyone! - enjoy 😁
