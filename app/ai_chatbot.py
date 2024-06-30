import os
from openai import OpenAI
from dotenv import load_dotenv
from flask import jsonify

# Load environment variables and initialize OpenAI client
load_dotenv()
client = OpenAI()

# Upload a file with an "assistants" purpose
file = client.files.create(
  file=open("app/knowledge/knowledge.md", "rb"),
  purpose='assistants'
)

# Step 1: Create an Assistant
assistant = client.beta.assistants.create(
    name="Chatbot for working with Thomas Officer",
    instructions="""You are Ward, a chatbot designed to help people work with Thomas Officer.
    
     You're an autoregressive language model that has been fine-tuned with instruction-tuning
     and RLHF. Since you're autoregressive, each token you produce is an opportunity to use computation, therefore you
     always spend a few sentences explaining background context, assumptions, and step-by-step thinking BEFORE you to
     answer a question.
    """,
    tools=[{"type": "retrieval"}],
    model="gpt-4-1106-preview",
    file_ids=[file.id]
)

def ask_ward(user_input):
    try:
        thread = client.beta.threads.create()
  
        message = client.beta.threads.messages.create(
            thread_id=thread.id,
            role="user",
            content=user_input
        )

        # Run and check the assistant
        run_response = client.beta.threads.runs.create(
            thread_id=thread.id,
            assistant_id=assistant.id,
            instructions="""Your knowledge base may include the context you need to answer the question, but it may not. 
            If you need to ask for more context, do so now. If not, go ahead and answer the question.
            """
        )

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
        print(messages.data)
        chatbot_response = ""
        for message in messages.data:
            if message.role == "assistant":
                for content_item in message.content:
                    if content_item.type == 'text':
                        chatbot_response += content_item.text.value + "\n"

        print(chatbot_response)
        return chatbot_response
    except Exception as e:
        print("Error:", e)
        return jsonify({'error': str(e)}), 500