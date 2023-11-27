# app/routes.py
from app import app
from flask import render_template

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
