import os
from app import app
from app.ai_chatbot import ask_ward
from app.spreadsheet_handler import get_monthly_income_from_openai, add_property_to_dataframe, initialize_dataframe
from dotenv import load_dotenv
from flask import render_template, request, jsonify

if os.environ.get('FLASK_ENV') == 'development':
    load_dotenv()

@app.route('/')
def home():
    return render_template('index.html')

@app.route('/about')
def about():
    return render_template('about.html')

@app.route('/blog')
def blog():
    return render_template('blog.html')

@app.route('/contact')
def contact():
    return render_template('contact.html')

@app.route('/portfolio')
def portfolio():
    return render_template('portfolio.html')

@app.route('/portfolio/netdocuments')
def netdocuments():
    return render_template('portfolio/netdocuments.html')

@app.route('/portfolio/afterpattern')
def afterpattern():
    return render_template('portfolio/afterpattern.html')

@app.route('/portfolio/blueridgelabs')
def blueridgelabs():
    return render_template('portfolio/blueridgelabs.html')

@app.route('/blog/aicontext')
def aicotext():
    return render_template('blog/aicontext.html')

@app.route('/blog/ai-chatbot')
def aichatbot():
    return render_template('blog/ai-chatbot.html')

@app.route('/blog/legal-apps')
def legalapps():
    return render_template('blog/legal-apps.html')

@app.route('/blog/problems-and-ideas')
def problemsandideas():
    return render_template('blog/problems-and-ideas.html')

@app.route('/blog/start-of-an-idea')
def startofanidea():
    return render_template('blog/start-of-an-idea.html')

@app.route('/blog/system-message')
def systemmessage():
    return render_template('blog/system-message.html')

@app.route('/ask_chatbot', methods=['POST'])
def ask_chatbot():
    user_input = request.json['message']
    response = ask_ward(user_input)
    return jsonify({'reply': response})

@app.route('/verify_password', methods=['POST'])
def verify_password():
    password = request.json.get('password')
    correct_password = os.getenv('PORTFOLIO_PASSWORD')
    if password == correct_password:
        return jsonify({"status": "success"})
    else:
        return jsonify({"status": "failure"}), 401
    
@app.route('/calculator')
def coleverage():
    return render_template('real-estate-calculator.html')
