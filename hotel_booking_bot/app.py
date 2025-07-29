from flask import Flask, request, jsonify, render_template
import boto3
import uuid
from dotenv import load_dotenv
import os

# Load variables from .env file
load_dotenv()

app = Flask(__name__)

# AWS credentials are automatically loaded from environment
lex = boto3.client('lexv2-runtime',
                   region_name=os.getenv("AWS_REGION"))

BOT_ID = os.getenv("LEX_BOT_ID")
BOT_ALIAS_ID = os.getenv('LEX_BOT_ALIAS_ID')
LOCALE_ID = 'en_US'
SESSION_ID = str(uuid.uuid4())  # Or any unique identifier

@app.route('/')
def index():
    return render_template('index.html')

@app.route('/chat', methods=['POST'])
def chat():
    user_input = request.json.get('message')

    response = lex.recognize_text(
        botId=BOT_ID,
        botAliasId=BOT_ALIAS_ID,
        localeId=LOCALE_ID,
        sessionId=SESSION_ID,
        text=user_input
    )

    bot_message = response['messages'][0]['content'] if 'messages' in response else "Sorry, I didn’t get that."
    return jsonify({'message': bot_message})

if __name__ == '__main__':
    app.run(debug=True)
