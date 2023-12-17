import os
from openai import OpenAI
from dotenv import load_dotenv
from flask import jsonify

load_dotenv()
client = OpenAI()

def get_crowdfunding_breakdown(user_input):
  try: 
    response = client.chat.completions.create(
    model="gpt-3.5-turbo",
    messages=[
      {"role": "system", "content": "You are a helpful assistant."},
      {"role": "user", "content": user_input},
    ]
  )
    chat_response_text = response.choices[0].message.content
    return chat_response_text
  
  except Exception as e:
      print("Error:", e)
      return str(e) 