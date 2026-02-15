import json
from openai import OpenAI

from config import MODEL_CHOICES, DEFAULT_MODEL

client = OpenAI()

AI_RESPONSE_SCHEMA = {
    "type": "object",
    "additionalProperties": False,
    "properties": {
        "summary": {"type": "string", "description": "Summary of the user's message"},
        "sentiment": {
            "type": "integer",
            "minimum": 0,
            "maximum": 100,
            "description": "Sentiment score from 0 (negative) to 100 (positive)",
        },
        "response": {"type": "string", "description": "Suggested response to the user"},
    },
    "required": ["summary", "sentiment", "response"],
}


def get_ai_response(system_prompt: str, user_prompt: str, model: str | None = None):
    model_id = MODEL_CHOICES.get(model or DEFAULT_MODEL, DEFAULT_MODEL)

    completion = client.chat.completions.create(
        model=model_id,
        messages=[
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": user_prompt},
        ],
        response_format={
            "type": "json_schema",
            "json_schema": {
                "name": "ai_response",
                "schema": AI_RESPONSE_SCHEMA,
                "strict": True,
            },
        },
        temperature=0.2,
    )

    content = completion.choices[0].message.content
    return json.loads(content)
