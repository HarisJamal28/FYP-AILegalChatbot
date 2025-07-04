import os
import json
from langchain_chroma import Chroma
from langchain_openai import OpenAIEmbeddings, ChatOpenAI
from dotenv import load_dotenv
from tqdm import tqdm
from langchain.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnablePassthrough
from langchain_core.chat_history import BaseChatMessageHistory
from langchain_core.runnables.history import RunnableWithMessageHistory
from langchain.memory import ChatMessageHistory

load_dotenv()

def load_chunks(file_path):
    """
    Loads data from a JSONL file, processes it into chunks, and stores it in a Chroma vector database.
    
    Args:
        file_path (str): Path to the JSONL file containing the data.
    """
    embeddings = OpenAIEmbeddings(
        model='text-embedding-ada-002'  # embedding model
    )
    vectorstore = Chroma(
        persist_directory="./mentalhealthdb",  # directory to store the vector database
        embedding_function=embeddings,
        collection_name="health"  # lowercase, no special characters
    )
    
    with open(file_path, 'r', encoding='utf-8') as f:
        for line in tqdm(f, desc="Loading JSONL Data", unit="line"):
            data = json.loads(line)
            text_data = json.dumps(data)
            vectorstore.add_texts([text_data])

# Load data only if the database does not exist
if not os.path.exists("./mentalhealthdb"):
    print("Loading data into the vector store...")
    load_chunks("finetunedataset.jsonl")
else:
    print("Vector store already exists. Skipping data loading.")

def retrieve_response():
    """
    Retrieves the most relevant stored messages based on the query.

    Args:
        query (str): The user's query.
        top_k (int): Number of most similar messages to retrieve.

    Returns:
        List of top-k retrieved messages.
    """
    # Initialize the embeddings
    embeddings = OpenAIEmbeddings(
        model='text-embedding-ada-002'
    )
    
    # Connect to the existing vector store
    vectorstore = Chroma(
        persist_directory="./mentalhealthdb",  # Same directory used in `load_chunks`
        embedding_function=embeddings,
        collection_name="health"  # Same collection name
    )
    
    # Perform similarity search
    return vectorstore.as_retriever()

def format_docs(docs):
    """
    Formats the retrieved documents into a single string.

    Args:
        docs (list): List of retrieved Document objects.

    Returns:
        str: Formatted string containing the content of the documents.
    """
    return "\n\n" .join(doc.page_content for doc in docs)

LLM = ChatOpenAI(model='gpt-4o-mini', temperature=0.7)
retriever = retrieve_response()
prompt = ChatPromptTemplate.from_messages([
    ("system", "The following is a conversation with a Mental Health Assistant. The assistant is empathetic, compassionate, and provides supportive responses. It is designed to help users manage stress, emotions, and mental health-related concerns. Keep the conversation good, you can talk in Roman Urdu language if user is talking in that otherwise continue with english and the conversation can be a bit casual if some user interacts with you casually but not so over that you asnwer unrelated questions OK and be human friendly, can have some hello, hi and goodbyes, etc, so that user can have a good experience. If any irrelevant question is asked, say 'I am here to assist with mental health concerns only.'"),
    MessagesPlaceholder(variable_name="history"),  # Add history to the prompt
    ("human", "{query}")
])
chain = (prompt 
        | LLM 
        | StrOutputParser())
# Store chat history for each session
store = {}

def get_session_history(session_id: str) -> BaseChatMessageHistory:
    if session_id not in store:
        store[session_id] = ChatMessageHistory()
    return store[session_id]

# Add memory to the chain
chain_with_memory = RunnableWithMessageHistory(
    chain,
    get_session_history,
    input_messages_key="query",
    history_messages_key="history",
)