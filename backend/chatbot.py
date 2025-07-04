import os
import glob
import json
from dotenv import load_dotenv
from tqdm import tqdm
from langchain.document_loaders import UnstructuredPDFLoader
from langchain.text_splitter import CharacterTextSplitter
from langchain_chroma import Chroma
from langchain_openai import OpenAIEmbeddings, ChatOpenAI
from langchain.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.output_parsers import StrOutputParser
from langchain_core.chat_history import BaseChatMessageHistory
from langchain_core.runnables.history import RunnableWithMessageHistory
from langchain.memory import ChatMessageHistory

# Load environment variables (e.g. OpenAI API key)
load_dotenv()

# === STEP 1: Load and Chunk PDFs into Vector Store ===
def load_pdf_chunks():
    """
    Loads PDF files from the 'data' folder, processes them into chunks,
    and stores them in a Chroma vector database.
    """
    embeddings = OpenAIEmbeddings(model='text-embedding-ada-002')
    vectorstore = Chroma(
        persist_directory="./pakistanlawdb",
        embedding_function=embeddings,
        collection_name="law"
    )
    
    # Load PDF files from the /data directory
    pdf_files = glob.glob("data/*.pdf")
    documents = []
    for pdf in tqdm(pdf_files, desc="Loading PDF Files", unit="file"):
        loader = UnstructuredPDFLoader(pdf)
        documents.extend(loader.load())
    
    # Split documents into manageable text chunks
    text_splitter = CharacterTextSplitter(chunk_size=1000, chunk_overlap=0)
    texts = text_splitter.split_documents(documents)
    
    # Add documents to Chroma vector store
    vectorstore.add_documents(texts)

# Load PDF data into vector DB if not already done
if not os.path.exists("./pakistanlawdb"):
    print("Loading PDF data into the vector store...")
    load_pdf_chunks()
else:
    print("Vector store already exists. Skipping data loading.")

# === STEP 2: Retrieve Relevant Context ===
def retrieve_response():
    """
    Returns a retriever object that fetches relevant documents from the vector store.
    """
    embeddings = OpenAIEmbeddings(model='text-embedding-ada-002')
    vectorstore = Chroma(
        persist_directory="./pakistanlawdb",
        embedding_function=embeddings,
        collection_name="law"
    )
    return vectorstore.as_retriever()

# === STEP 3: Format Documents (Optional) ===
def format_docs(docs):
    """
    Joins retrieved documents into a formatted string.
    """
    return "\n\n".join(doc.page_content for doc in docs)

# === STEP 4: LLM Setup ===
LLM = ChatOpenAI(model='gpt-4o-mini', temperature=0.7)
retriever = retrieve_response()

# === STEP 5: Prompt Template for Legal Assistant ===
prompt = ChatPromptTemplate.from_messages([
    ("system", """
You are a Legal Assistant specialized in Pakistan law. You must detect the user's language. If the user is asking in English, reply in English. If they use Urdu (either Roman Urdu or Urdu script), reply in the same language (Roman Urdu or Urdu script accordingly). Your goal is to help users understand legal issues clearly.

Respond professionally and with empathy. Structure your answers with the following sections when applicable:

- **Introduction**: Brief summary of the legal issue.
- **Legal Provisions**: Relevant Pakistani laws or sections.
- **Explanation**: How the law applies to this situation.
- **Case Law**: Mention any landmark cases or judgments (optional).
- **Conclusion**: Final opinion or recommendation.
- **References**: Any legal sources cited.

If someone asks an irrelevant question, say: "I am here to assist with Pakistan law-related concerns only."

Use clear formatting like bold headings, bullet points, and line breaks to make your answer easy to read.
"""),
    MessagesPlaceholder(variable_name="history"),
    ("human", "{query}")
])


# === STEP 6: Build Basic Chain ===
chain = (prompt 
         | LLM 
         | StrOutputParser())

# === STEP 7: Chat History (Memory) Setup ===
store = {}

def get_session_history(session_id: str) -> BaseChatMessageHistory:
    if session_id not in store:
        store[session_id] = ChatMessageHistory()
    return store[session_id]

# === STEP 8: Chain With Memory Support ===
chain_with_memory = RunnableWithMessageHistory(
    chain,
    get_session_history,
    input_messages_key="query",
    history_messages_key="history",
)
