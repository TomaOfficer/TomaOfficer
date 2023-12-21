import os
from openai import OpenAI
from dotenv import load_dotenv
from flask import jsonify

load_dotenv()
client = OpenAI()

system_message = {
    "role": "system",
    "content": ("You are a real estate investment assistant. "
                "Your primary objective is to give the user accurate financial estimates in plain text or simple HTML format. "
                "If the user doesn't provide all the necessary details, you are capable of making educated estimates. "
                "Keep your language and formatting simple and clear for direct display on a web page, avoiding technical or academic presentation. "
                "Your users are already aware of your capabilities and limitations.")
}

def get_crowdfunding_breakdown(user_input):
  try: 
    response = client.chat.completions.create(
      model="gpt-4-1106-preview",
      messages=[system_message, {"role": "user", "content": user_input}]
    )
    chat_response_text = response.choices[0].message.content
    chat_response_text = chat_response_text.replace("[ \text{", "").replace("} ]", "").replace("\\", "")

    return chat_response_text
  
  except Exception as e:
    print("Error:", e)
    return str(e)
