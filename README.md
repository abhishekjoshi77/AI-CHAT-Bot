# AI Assistant Chatbot (Flask + OpenAI)

A clean, single-page AI chatbot web app built with **Flask** and the **OpenAI Python SDK**.

## Repository

`https://github.com/abhishekjoshi77/AI-CHAT-Bot`

## Live Demo

`Add your deployed URL here (example: https://ai-chat-bot.onrender.com)`

The app lets a user:
- Select a model (`gpt-4o-mini` or `gpt-4.1-mini`)
- Send messages from a modern chat UI
- Receive structured AI output with:
  - `response` (assistant reply)
  - `summary` (message summary)
  - `sentiment` (0-100 score)
  - `duration` (server processing time in seconds)

## Demo Features

- Flask backend with two routes (`/` and `/generate`)
- Structured JSON responses enforced using OpenAI `json_schema`
- Frontend chat experience using vanilla HTML/CSS/JS
- Loading states, enter-to-send, clear chat, and response metadata display
- Model selection dropdown in UI

## Tech Stack

- **Backend**: Python, Flask
- **AI Integration**: OpenAI Python SDK (`openai`)
- **Frontend**: HTML, CSS, JavaScript (no framework)
- **Styling**: Custom CSS with responsive layout + animations

## Project Structure

```text
CHATBOT/
├── app.py                 # Flask app + HTTP routes
├── model.py               # OpenAI call + JSON schema handling
├── config.py              # Model choices and default model
├── requirements.txt       # Python dependencies
├── render.yaml            # Render deployment blueprint
├── templates/
│   └── index.html         # Main UI page
└── static/
    ├── styles.css         # UI styling and responsiveness
    └── script.js          # Frontend chat behavior
```

## How It Works

1. User enters a message in the frontend.
2. Browser sends `POST /generate` with `{ message, model }`.
3. Flask validates input and model choice.
4. `model.py` sends request to OpenAI with a strict JSON schema.
5. AI returns structured JSON.
6. Backend adds response duration and returns JSON to frontend.
7. UI renders assistant text and metadata (`sentiment`, `summary`, `time`).

## Prerequisites

- Python 3.10+
- OpenAI API key

## Installation & Run

1. Clone the repository:

```bash
git clone https://github.com/abhishekjoshi77/AI-CHAT-Bot.git
cd AI-CHAT-Bot
```

2. Create and activate a virtual environment:

```bash
python3 -m venv .venv
source .venv/bin/activate   # macOS/Linux
# .venv\Scripts\activate    # Windows (PowerShell)
```

3. Install dependencies:

```bash
pip install -r requirements.txt
```

4. Set environment variable:

```bash
export OPENAI_API_KEY="your_api_key_here"      # macOS/Linux
# setx OPENAI_API_KEY "your_api_key_here"      # Windows (cmd)
# $env:OPENAI_API_KEY="your_api_key_here"      # Windows (PowerShell)
```

5. Start the app:

```bash
python app.py
```

6. Open in browser:

```text
http://127.0.0.1:5000
```

## API Reference

### `POST /generate`

Request body:

```json
{
  "message": "I need help with my order",
  "model": "gpt-4o-mini"
}
```

Success response:

```json
{
  "summary": "User asks for order assistance",
  "sentiment": 62,
  "response": "Sure, I can help with your order. Can you share your order ID?",
  "duration": 0.842
}
```

Error responses:

- `400` if message is missing
- `400` if model is invalid
- `500` if AI output is not valid JSON or request fails

## Model Configuration

Model options are defined in `config.py`:

- `gpt-4o-mini` (default)
- `gpt-4.1-mini`

To add/remove models, update:
- `MODEL_CHOICES`
- `DEFAULT_MODEL`

## Dependencies

From `requirements.txt`:

- `Flask`
- `openai`
- `gunicorn`

## Deploy on Render

1. Push this code to your GitHub repo:

```bash
git add .
git commit -m "Prepare app for deployment"
git push origin main
```

2. Open Render dashboard and choose `New +` -> `Blueprint`.
3. Connect your GitHub account and select `abhishekjoshi77/AI-CHAT-Bot`.
4. Render will detect `render.yaml` automatically.
5. Add environment variable in Render:
   - Key: `OPENAI_API_KEY`
   - Value: your OpenAI API key
6. Click `Apply`.
7. After deploy completes, copy the generated URL and paste it in the **Live Demo** section above.

## Notes for GitHub

Recommended repo additions:
- Add a screenshot or short GIF under `assets/` and link it here
- Add a license file (`MIT` is common for personal projects)
- Add CI checks (lint/test) if you expand the project

## Troubleshooting

- **`OPENAI_API_KEY` not set**: export/set the environment variable before running.
- **`Invalid model selection`**: ensure selected value exists in `config.py`.
- **Frontend not updating**: confirm Flask server is running on `127.0.0.1:5000`.
- **OpenAI request error**: verify API key validity and account quota.

## Security Considerations

- Do not hardcode API keys in source code.
- Do not commit `.env` files containing secrets.
- Consider adding request limiting/auth before public deployment.

## Future Improvements

- Persist chat history (database or local storage)
- Add unit and integration tests
- Stream responses token-by-token
- Add user authentication and multi-session support
- Add Docker support for one-command deployment

---

If you use this project on GitHub, add your own screenshots and project badges for a more professional presentation.
