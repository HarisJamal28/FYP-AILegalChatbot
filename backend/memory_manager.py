from langchain.memory import ConversationBufferMemory
from langchain.chains import ConversationChain

# Holds memory per chat session
memory_store = {}

def get_memory_for_chat(chat_id):
    if chat_id not in memory_store:
        memory_store[chat_id] = ConversationBufferMemory(return_messages=True)
    return memory_store[chat_id]
