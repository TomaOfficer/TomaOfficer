import os
import markdown
import bleach
from app import app
from dotenv import load_dotenv
from flask import render_template, request, jsonify
from app.real_estate_chat import get_crowdfunding_breakdown

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

@app.route('/blog/2023-review')
def review():
    return render_template('blog/2023-review.html')

@app.route('/get_crowdfunding_breakdown', methods=['POST'])
def get_crowdfunding_breakdown_route():
    user_input = request.json['message']
    response = get_crowdfunding_breakdown(user_input)

    html_response = markdown.markdown(response)

    allowed_tags = ['a', 'abbr', 'acronym', 'b', 'blockquote', 'code', 'em', 'i', 'li', 'ol', 'strong', 'ul', 'h1', 'h2', 'h3', 'h4', 'h5', 'h6', 'p']
    sanitized_html = bleach.clean(html_response, tags=allowed_tags, strip=True)

    return jsonify({'reply':  sanitized_html})

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
