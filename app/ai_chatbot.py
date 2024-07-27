import os
from openai import OpenAI
from dotenv import load_dotenv
from flask import jsonify

# Load environment variables and initialize OpenAI client
load_dotenv()
client = OpenAI()

# Upload a file with an "assistants" purpose
try:
    file_path = "app/knowledge/knowledge.md"
    with open(file_path, "rb") as f:
        file = client.files.create(
            file=f,
            purpose='assistants'
        )
    # print(f"File uploaded successfully: {file}")
except Exception as e:
    print(f"Error uploading file: {e}")

# Step 1: Create an Assistant
try:
    assistant = client.beta.assistants.create(
        name="Chatbot for working with Thomas Officer",
        instructions="""You are Ward, a chatbot designed to help people work with Thomas Officer.
        
         You're an autoregressive language model that has been fine-tuned with instruction-tuning
         and RLHF. Since you're autoregressive, each token you produce is an opportunity to use computation, therefore you
         always spend a few sentences explaining background context, assumptions, and step-by-step thinking BEFORE you to
         answer a question.

        Your knowledge base includes a document titled 'knowledge.md'. Always refer to this document to find the information needed to answer the user's questions.
        """,
        tools=[{"type": "retrieval"}],
        model="gpt-3.5-turbo-0125",
        file_ids=[file.id]
    )
except Exception as e:
    print(f"Error creating assistant: {e}")

def ask_ward(user_input):
    try:
        thread = client.beta.threads.create()
        print(f"Thread created successfully: {thread}")

        message = client.beta.threads.messages.create(
            thread_id=thread.id,
            role="user",
            content=user_input
        )
        print(f"Message created successfully: {message}")

        # Run and check the assistant
        run_response = client.beta.threads.runs.create(
            thread_id=thread.id,
            assistant_id=assistant.id,
            instructions=f"""Your knowledge base includes a document titled 'knowledge.md'. 
            Always refer to this document to find the information needed to answer the user's question: '{user_input}'.
            If you need more context, ask for it. If not, provide the answer based on the document."""
        )
        # print(f"Run response: {run_response}")

        while True:
            run_status = client.beta.threads.runs.retrieve(
                thread_id=thread.id,
                run_id=run_response.id
            )
            if run_status.status == 'completed':
                print("Run completed.")
                break

        # Collect and format the response
        messages = client.beta.threads.messages.list(thread_id=thread.id)
        print(f"Messages retrieved: {messages}")

        chatbot_response = ""
        for message in messages.data:
            if message.role == "assistant":
                for content_item in message.content:
                    if content_item.type == 'text':
                        chatbot_response += content_item.text.value + "\n"

        # print(f"Chatbot response: {chatbot_response}")
        return chatbot_response
    except Exception as e:
        print("Error:", e)
        return jsonify({'error': str(e)}), 500