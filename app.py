from flask import Flask, request, jsonify, render_template
import time
import traceback

from config import MODEL_CHOICES, DEFAULT_MODEL
from model import get_ai_response

app = Flask(__name__)


@app.route('/', methods=['GET'])
def index():
    return render_template('index.html')


@app.route('/generate', methods=['POST'])
def generate():
    data = request.get_json(silent=True) or {}
    user_message = data.get('message')
    model = data.get('model') or DEFAULT_MODEL

    if not user_message:
        return jsonify({"error": "Missing message"}), 400

    if model not in MODEL_CHOICES:
        return jsonify({"error": "Invalid model selection"}), 400

    system_prompt = (
        "You are an AI assistant helping with customer inquiries. "
        "Provide a helpful and concise response. "
        "Return JSON that follows the provided schema exactly."
    )

    start_time = time.time()

    try:
        result = get_ai_response(system_prompt, user_message, model=model)

        if not isinstance(result, dict):
            return jsonify({"error": "Model response was not valid JSON"}), 500

        result['duration'] = round(time.time() - start_time, 3)
        return jsonify(result)
    except Exception as e:
        print("ERROR in /generate:", e)
        print(traceback.format_exc())
        return jsonify({"error": str(e)}), 500


if __name__ == '__main__':
    app.run(debug=True)
