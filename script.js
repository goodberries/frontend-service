document.addEventListener('DOMContentLoaded', () => {
    const sendBtn = document.getElementById('send-btn');
    const userInput = document.getElementById('user-input');
    const chatWindow = document.getElementById('chat-window');
    const feedbackButtons = document.getElementById('feedback-buttons');
    const likeBtn = document.getElementById('like-btn');
    const dislikeBtn = document.getElementById('dislike-btn');

    const API_BASE_URL = 'http://54.159.44.12:30007';
    let currentInteractionId = null;

    const sendMessage = async () => {
        const query = userInput.value.trim();
        if (query === '') return;

        appendMessage(query, 'user');
        userInput.value = '';
        feedbackButtons.style.display = 'none'; // Hide feedback buttons on new message
        currentInteractionId = null;

        try {
            const thinkingMessageElement = appendMessage('...', 'bot');

            const response = await fetch(`${API_BASE_URL}/chat?query=${encodeURIComponent(query)}`, {
                method: 'POST'
            });

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const data = await response.json();
            
            thinkingMessageElement.textContent = data.response;
            currentInteractionId = data.interaction_id;

            // Show feedback buttons after getting a response
            if (currentInteractionId) {
                feedbackButtons.style.display = 'flex';
                likeBtn.classList.remove('selected');
                dislikeBtn.classList.remove('selected');
            }

        } catch (error) {
            console.error('Error fetching bot response:', error);
            appendMessage('Sorry, I encountered an error. Please try again.', 'bot');
        }
    };

    const sendFeedback = async (feedback) => {
        if (!currentInteractionId) return;

        try {
            await fetch(`${API_BASE_URL}/feedback`, {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    interaction_id: currentInteractionId,
                    feedback: feedback
                }),
            });
            
            feedbackButtons.style.display = 'none';
            appendMessage('Thank you for your feedback!', 'bot');
            currentInteractionId = null; // Prevent sending feedback again for the same interaction

        } catch (error) {
            console.error('Error sending feedback:', error);
        }
    };

    const appendMessage = (text, sender) => {
        const messageElement = document.createElement('div');
        messageElement.classList.add('message', `${sender}-message`);
        messageElement.textContent = text;
        chatWindow.appendChild(messageElement);
        chatWindow.scrollTop = chatWindow.scrollHeight;
        return messageElement;
    };

    sendBtn.addEventListener('click', sendMessage);
    userInput.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });

    likeBtn.addEventListener('click', () => {
        likeBtn.classList.add('selected');
        dislikeBtn.classList.remove('selected');
        sendFeedback('like');
    });

    dislikeBtn.addEventListener('click', () => {
        dislikeBtn.classList.add('selected');
        likeBtn.classList.remove('selected');
        sendFeedback('dislike');
    });

    appendMessage('Hello! How can I assist you today?', 'bot');
});
