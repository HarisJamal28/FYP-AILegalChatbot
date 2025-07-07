import os
import glob
import re
import pandas as pd
from dotenv import load_dotenv
from tqdm import tqdm
from langchain.document_loaders import UnstructuredPDFLoader
from langchain.text_splitter import CharacterTextSplitter
from langchain_chroma import Chroma
from langchain_openai import OpenAIEmbeddings, ChatOpenAI
from langchain.prompts import ChatPromptTemplate, MessagesPlaceholder
from langchain_core.output_parsers import StrOutputParser
from langchain_core.runnables import RunnablePassthrough, RunnableLambda, RunnableMap
from langchain_core.chat_history import BaseChatMessageHistory
from langchain_core.runnables.history import RunnableWithMessageHistory
from langchain.memory import ChatMessageHistory
from langchain.schema import Document

# === Load environment variables ===
load_dotenv()

# === Step 1: Load and chunk law PDFs ===
def load_pdf_chunks():
    embeddings = OpenAIEmbeddings(model='text-embedding-ada-002')
    vectorstore = Chroma(
        persist_directory="./pakistanlawdb",
        embedding_function=embeddings,
        collection_name="law"
    )

    pdf_files = glob.glob("data/*.pdf")
    documents = []
    for pdf in tqdm(pdf_files, desc="Loading PDF Files", unit="file"):
        loader = UnstructuredPDFLoader(pdf)
        documents.extend(loader.load())

    text_splitter = CharacterTextSplitter(chunk_size=1000, chunk_overlap=0)
    texts = text_splitter.split_documents(documents)
    vectorstore.add_documents(texts)

if not os.path.exists("./pakistanlawdb"):
    print("📄 Initializing: loading law PDFs into vector store...")
    load_pdf_chunks()
else:
    print("✅ Law vector store already exists.")

# === Step 2: Retrieve from law vectorstore ===
def retrieve_response():
    embeddings = OpenAIEmbeddings(model='text-embedding-ada-002')
    vectorstore = Chroma(
        persist_directory="./pakistanlawdb",
        embedding_function=embeddings,
        collection_name="law"
    )
    return vectorstore.as_retriever()

law_retriever = retrieve_response()

# === Step 3: Load CSV for filing guide and embed ===
def load_legal_filing_guide():
    df = pd.read_csv("legal_filing_guide_100.csv")
    docs = []

    for _, row in df.iterrows():
        content = f"""
📂 Case Type: {row['case_type']}
📝 Description: {row['description']}
🧾 Steps to File: {row['filing_steps']}
🏛️ Court Type: {row['court_type']}
📑 Required Documents: {row['required_documents']}
"""
        docs.append(Document(page_content=content))

    embeddings = OpenAIEmbeddings(model='text-embedding-ada-002')
    vectorstore = Chroma.from_documents(
        docs,
        embedding=embeddings,
        collection_name="filing_guide",
        persist_directory="./filingguide_db"
    )
    return vectorstore.as_retriever()

filing_retriever = load_legal_filing_guide()

# === Step 4: Combine retrievals ===
def combined_retrieval(query):
    results = law_retriever.get_relevant_documents(query)
    if any(kw in query.lower() for kw in ["file", "court", "case", "documents", "lawyer"]):
        results += filing_retriever.get_relevant_documents(query)
    return results

combined_retriever = RunnableLambda(lambda x: {"docs": combined_retrieval(x["query"])})

# === Step 5: Format documents for context ===
def format_docs(docs):
    return "\n\n".join(doc.page_content for doc in docs)

format_combined = RunnableLambda(lambda x: format_docs(x["docs"]))

# === Step 6: Optional law reference extractor ===
def extract_law_reference(query: str):
    match = re.search(r"(Article|Section)\s+\d+[-]?[A-Z]?", query, re.IGNORECASE)
    return match.group(0) if match else None

def explain_law_reference(query: str, retriever):
    reference = extract_law_reference(query)
    if reference:
        results = retriever.get_relevant_documents(reference)
        if results:
            return f"🔍 Here's what I found about {reference}:\n\n{results[0].page_content}"
    return None

# === Step 7: Define the legal prompt ===
prompt = ChatPromptTemplate.from_messages([
    ("system", """
You are an experienced, qualified lawyer in Pakistan. Your role is to provide professional legal guidance by deeply understanding user queries, referencing the actual laws, case files, and filing guides you have been provided.

🎯 Your Responsibilities:
- Analyze the user's query in **any of the following languages**: English, Urdu script (اردو), Roman Urdu, or Pashto (پښتو).
- Reply in the **same language** the user used.
- Always communicate in a professional, respectful, and simple tone—like a real Pakistani lawyer advising a citizen.

📚 Use Your Knowledge Base:
- Cite **relevant Articles, Sections, or Clauses** from Pakistan’s Constitution, Penal Code, Civil or Family Law, etc.
- Reference the **case files** and **filing procedures** you have been trained on via uploaded documents and CSV (such as legal_filing_guide_100.csv).
- If applicable, use context retrieved from the user-provided documents to **explain the law based on real-world data**.

📋 Response Format (Always follow this structure):

**Introduction**: Identify and briefly explain the user's legal issue.  
**Legal Provisions**: Clearly mention any applicable Articles, Sections, or legal provisions from Pakistani law.  
**Explanation**: Break down how these laws apply in the user's situation — in simple, everyday language.  
**Case Law** *(optional)*: Share any example judgments or common legal interpretations, if available in your data.  
**Filing Procedure** *(if applicable)*: Step-by-step on where to go (court, FIA, Ombudsman, etc.), what to do, and what documents are needed.  
**Conclusion**: Give your professional opinion or next steps.  
**References**: Clearly list any legal sources, articles, sections, or case files used in your advice.

🛑 If the user's query is unrelated to Pakistani law (e.g. jokes, cooking, general talk), respond politely with:
"I am here to assist with Pakistan law-related concerns only."

🟡 If the query is **too vague, incomplete, or emotionally sensitive** (e.g. *“I did something wrong”*, *“I need help”*, or *“I killed a dog”*), then respond with:

> "Could you please share more details about the situation so I can understand the legal context and provide appropriate help according to Pakistani law?"

🌐 Language Handling:
- Respond in **English** if the query is in English.
- Respond in **Urdu (اردو)** if written in Urdu script.
- Respond in **Roman Urdu** if written that way.
- Respond in **Pashto (پښتو)** if the input is in Pashto.

💼 Always act like a licensed legal expert in Pakistan — ethical, helpful, and never misleading. Never make up laws or references.
"""),
    MessagesPlaceholder(variable_name="history"),
    ("human", "{query}")
])


# === Step 8: Initialize LLM ===
LLM = ChatOpenAI(model='gpt-4o-mini', temperature=0.7)

# === Step 9: Create full RAG chain ===
rag_chain = (
    RunnableMap({
        "query": RunnablePassthrough(),
        "history": lambda x: x["history"],
    })
    | prompt
    | LLM
    | StrOutputParser()
)

# === Step 10: Session-based memory ===
store = {}

def get_session_history(session_id: str) -> BaseChatMessageHistory:
    if session_id not in store:
        store[session_id] = ChatMessageHistory()
    return store[session_id]

# === Step 11: Chain with memory ===
chain_with_memory = RunnableWithMessageHistory(
    rag_chain,
    get_session_history,
    input_messages_key="query",
    history_messages_key="history",
)

# === Step 12: Optional CLI for testing ===
if __name__ == "__main__":
    session = "test-session"
    print("🔵 Pakistan Legal Chatbot (type 'exit' to quit)")
    while True:
        q = input("\n🧑 You: ")
        if q.strip().lower() in ["exit", "quit"]:
            break
        res = chain_with_memory.invoke({"query": q}, config={"configurable": {"session_id": session}})
        print(f"👨‍⚖️ LegalBot: {res}")
