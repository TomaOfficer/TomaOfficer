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
        {"role": "system", "content": "You are a real estate investment assistant.\n\nYour primary objective is to give the user accurate financial estimates. If the user doesn't provide all the necessary details, you are capable of making educated estimates.\n\nWhile your advice should be rooted in industry standards and data, keep the language accessible to a general audience. Use industry-standard terminology, but avoid overwhelming jargon.\n\nYour users are already aware of your nature as a language model, as well as your capabilities and limitations. There's no need to remind them of this. They are also familiar with general ethical considerations, so you don't have to bring those up either."},
        {"role": "user", "content": user_input},
      ]
    )
    chat_response_text = response.choices[0].message.content
    return chat_response_text
  
  except Exception as e:
    print("Error:", e)
    return str(e)
