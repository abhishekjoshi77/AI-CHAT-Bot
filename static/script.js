const chatForm = document.getElementById('chatForm');
const messageInput = document.getElementById('messageInput');
const modelSelect = document.getElementById('modelSelect');
const messagesContainer = document.getElementById('messagesContainer');
const messagesEnd = document.getElementById('messagesEnd');
const welcomeScreen = document.getElementById('welcomeScreen');
const loadingIndicator = document.getElementById('loadingIndicator');
const sendButton = document.getElementById('sendButton');
const loadingSpinner = document.getElementById('loadingSpinner');
const sendIcon = document.getElementById('sendIcon');
const clearBtn = document.getElementById('clearBtn');

function scrollToBottom() {
    messagesEnd.scrollIntoView({ behavior: 'smooth', block: 'end' });
}

function setLoading(isLoading) {
    loadingIndicator.style.display = isLoading ? 'block' : 'none';
    loadingSpinner.style.display = isLoading ? 'flex' : 'none';
    sendIcon.style.display = isLoading ? 'none' : 'block';
    sendButton.disabled = isLoading;
    messageInput.disabled = isLoading;
    modelSelect.disabled = isLoading;
}

function hideWelcomeIfNeeded() {
    if (welcomeScreen && welcomeScreen.style.display !== 'none') {
        welcomeScreen.style.display = 'none';
        clearBtn.style.display = 'inline-flex';
    }
}

function addMessage(role, text, meta) {
    const wrapper = document.createElement('div');
    wrapper.className = `message ${role}`;

    const bubble = document.createElement('div');
    bubble.className = 'message-bubble';
    bubble.textContent = text;

    wrapper.appendChild(bubble);

    if (meta) {
        const metaEl = document.createElement('div');
        metaEl.className = 'message-meta';
        metaEl.textContent = meta;
        wrapper.appendChild(metaEl);
    }

    messagesContainer.appendChild(wrapper);
    scrollToBottom();
}

function autoResize() {
    messageInput.style.height = 'auto';
    messageInput.style.height = `${messageInput.scrollHeight}px`;
}

messageInput.addEventListener('input', autoResize);
messageInput.addEventListener('keydown', (event) => {
    if (event.key === 'Enter' && !event.shiftKey) {
        event.preventDefault();
        chatForm.requestSubmit();
    }
});

clearBtn.addEventListener('click', () => {
    messagesContainer.innerHTML = '';
    welcomeScreen.style.display = 'flex';
    clearBtn.style.display = 'none';
    messageInput.value = '';
    autoResize();
});

chatForm.addEventListener('submit', async (event) => {
    event.preventDefault();

    const message = messageInput.value.trim();
    if (!message) return;

    hideWelcomeIfNeeded();
    addMessage('user', message);
    messageInput.value = '';
    autoResize();

    setLoading(true);

    try {
        const response = await fetch('/generate', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({
                message,
                model: modelSelect.value,
            }),
        });

        const data = await response.json();

        if (!response.ok) {
            addMessage('assistant', data.error || 'Something went wrong.', 'Error');
            return;
        }

        const reply = data.response || 'No response text returned.';
        const metaParts = [];
        if (typeof data.sentiment === 'number') metaParts.push(`Sentiment: ${data.sentiment}`);
        if (data.summary) metaParts.push(`Summary: ${data.summary}`);
        if (typeof data.duration === 'number') metaParts.push(`Time: ${data.duration}s`);

        addMessage('assistant', reply, metaParts.join(' • '));
    } catch (err) {
        addMessage('assistant', err.message || 'Network error.', 'Error');
    } finally {
        setLoading(false);
        scrollToBottom();
    }
});

window.addEventListener('load', () => {
    autoResize();
});
