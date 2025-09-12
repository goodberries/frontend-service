document.addEventListener('DOMContentLoaded', () => {
    const sendBtn = document.getElementById('send-btn');
    const userInput = document.getElementById('user-input');
    const chatWindow = document.getElementById('chat-window');

    // This will be the external URL of your API Gateway.
    // We assume the frontend and backend are served from the same domain,
    // so we can use a relative path. If they are on different domains,
    // you would need to configure CORS on the API Gateway and use the full URL.
    const API_GATEWAY_URL = 'http://<YOUR_NODE_IP>:30007/chat';

    const sendMessage = async () => {
        const query = userInput.value.trim();
        if (query === '') return;

        // Display user message
        appendMessage(query, 'user');
        userInput.value = '';

        try {
            // Display a temporary "thinking" message for the bot
            const thinkingMessageElement = appendMessage('...', 'bot');

            const response = await fetch(`${API_GATEWAY_URL}?query=${encodeURIComponent(query)}`, {
                method: 'POST'
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            
            // Update the "thinking" message with the actual response
            thinkingMessageElement.textContent = data.response;

        } catch (error) {
            console.error('Error fetching bot response:', error);
            appendMessage('Sorry, I encountered an error. Please try again.', 'bot');
        }
    };

    const appendMessage = (text, sender) => {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', `${sender}-message`);
        messageElement.textContent = text;
        chatWindow.appendChild(messageElement);
        chatWindow.scrollTop = chatWindow.scrollHeight; // Auto-scroll to the latest message
        return messageElement;
    };

    sendBtn.addEventListener('click', sendMessage);
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    // Initial bot message
    appendMessage('Hello! How can I assist you today?', 'bot');
});
