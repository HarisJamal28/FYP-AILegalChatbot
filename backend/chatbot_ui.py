import gradio as gr
from chatbot import chain
from mongo_service import save_chat_to_mongodb, fetch_chat_from_mongodb
from auth_service import sign_up, sign_in
from bson.objectid import ObjectId

is_logged_in = False
current_user_id = None


def chat(query, chat_history):
    global current_user_id
    if not current_user_id:
        return "Please sign in to start chatting.", chat_history
    
    if chat_history is None:
        chat_history = []  # Initialize as an empty list if None

    # Add user query to chat history
    chat_history.append({"role": "user", "content": query})
    save_chat_to_mongodb(current_user_id, "user", query)

    if query == "":
        response = "Please ask a question."
        chat_history.append({"role": "assistant", "content": response})
        save_chat_to_mongodb(current_user_id, "assistant", response)
    else:
        response = chain.stream(query)
        chat_history.append({"role": "assistant", "content": ""})

    for res in response:
        chat_history[-1]["content"] += res
        yield "", chat_history

    save_chat_to_mongodb(current_user_id, "assistant", chat_history[-1]["content"])


def handle_sign_up(email, password):
    result = sign_up(email, password)
    return result

def handle_sign_in(email, password):
    global current_user_id, is_logged_in
    user_id = sign_in(email, password)
    if ObjectId.is_valid(user_id):
        current_user_id = user_id
        is_logged_in = True
        return "Sign-in successful!", gr.update(visible=True), gr.update(visible=False)
    else:
        return user_id, gr.update(visible=False), gr.update(visible=True)

def handle_logout():
    global current_user_id, is_logged_in
    current_user_id = None
    is_logged_in = False
    return None, gr.update(visible=False), gr.update(visible=True)

# def handle_logout():
#     global current_user_id
#     current_user_id = None
#     # Optional: Call backend logout API here
#     return  None, gr.update(visible=True), gr.update(visible=False)  # Hide the chat section


with gr.Blocks(css="styles.css", title="Enhanced ChatBot") as demo:
    gr.Markdown("<h1>🌟 Welcome to Your Legal AI ChatBot 🌟</h1>")

    # Chat section is initialized first
    with gr.Tab(visible=False) as chat_section:
        gr.Markdown("### Let's Chat!")
        chatbox = gr.Chatbot(type="messages", label="Chatbot Messages", elem_classes="chatbox")
        textbox = gr.Textbox(label="Your Message", placeholder="Type your query here...")
        submit_button = gr.Button(value="Send")
        textbox.submit(chat, inputs=[textbox, chatbox], outputs=[textbox, chatbox])
        submit_button.click(chat, inputs=[textbox, chatbox], outputs=[textbox, chatbox])
        # logout_button = gr.Button("Logout", variant="secondary")
        # logout_button.click(handle_logout, outputs=[chat_section, gr.Row(visible=True)])

    # Sign-in and Sign-up sections
    with gr.Row(visible=True) as sign_in_section:
        with gr.Tab("Sign Up"):
            gr.Markdown("### Create an Account")
            email = gr.Textbox(label="Email", placeholder="Enter your email...")
            password = gr.Textbox(label="Password", type="password", placeholder="Create a password...")
            sign_up_button = gr.Button("Sign Up")
            sign_up_output = gr.Textbox(label="Message", interactive=False)
            sign_up_button.click(handle_sign_up, inputs=[email, password], outputs=[sign_up_output])

        with gr.Tab("Sign In"):
            gr.Markdown("### Access Your Account")
            email = gr.Textbox(label="Email", placeholder="Enter your email...")
            password = gr.Textbox(label="Password", type="password", placeholder="Enter your password...")
            sign_in_button = gr.Button("Sign In")
            sign_in_output = gr.Textbox(label="Message", interactive=False)
            sign_in_button.click(
                handle_sign_in,
                inputs=[email, password],
                outputs=[sign_in_output, chat_section, sign_in_section]
            )

            with gr.Tab(visible=False) as chat_section:
                gr.Markdown("### Let's Chat!")
                chatbox = gr.Chatbot(type="messages", label="Chatbot Messages", elem_classes="chatbox")
                textbox = gr.Textbox(label="Your Message", placeholder="Type your query here...")
                submit_button = gr.Button(value="Send")
                logout_button = gr.Button("🚪 Logout", variant="stop")
            
                textbox.submit(chat, inputs=[textbox, chatbox], outputs=[textbox, chatbox])
                submit_button.click(chat, inputs=[textbox, chatbox], outputs=[textbox, chatbox])
                logout_button.click(handle_logout, outputs=[chatbox, chat_section, sign_in_section])


demo.launch(
    # server_name="0.0.0.0",
    server_port=7860,
)