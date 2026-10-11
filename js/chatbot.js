document.addEventListener('DOMContentLoaded', function() {
    // --- 0. LÓGICA DE SESIÓN (NUEVO) ---
    // Genera un ID único para que MongoDB agrupe los mensajes de esta charla
    if (!localStorage.getItem('tralecto_chat_session')) {
        localStorage.setItem('tralecto_chat_session', 'sess_' + Math.random().toString(36).substr(2, 9));
    }
    const sessionId = localStorage.getItem('tralecto_chat_session');

    // 1. Obtención de Elementos del DOM
    const openBtn = document.getElementById('open-chatbot-btn');
    const closeBtn = document.getElementById('close-chatbot-btn');
    const chatbotContainer = document.getElementById('chatbot-container');
    const messagesContainer = document.getElementById('chatbot-messages');
    const inputField = document.getElementById('chatbot-input-field');
    const sendBtn = document.getElementById('chatbot-send-btn');
    
    // URL del Backend (Asegúrate de que sea la de producción o la relativa)
    const apiURL = '/api/chat';

    if (!openBtn || !chatbotContainer) return; 

    // --- MANEJO DE LA INTERFAZ ---
    
    openBtn.addEventListener('click', () => {
        chatbotContainer.classList.remove('chatbot-hidden');
        inputField.focus(); 
        sendWelcomeMessage(); 
    });

    closeBtn.addEventListener('click', () => {
        chatbotContainer.classList.add('chatbot-hidden');
    });

    // --- LÓGICA DEL CHAT ---

    function addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', sender);
        
        // El bot usa Markdown/Negritas, innerHTML ayuda a visualizarlas
        messageDiv.innerHTML = text; 
        
        messagesContainer.appendChild(messageDiv);
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        
        return messageDiv; 
    }

    function sendWelcomeMessage() {
        if (messagesContainer.children.length > 0) return; 
        addMessage("¡Hola! Soy **Tralecto Bot**. El rincón donde el café se vuelve código mágico. 🚀 ¿Tienes una idea para una Web, App o Videojuego? Cuéntame y te ayudaré.", 'bot');
    }

    function getBotResponse(userMessage) {
        inputField.disabled = true;
        const typingIndicator = addMessage('<span class="typing-dots"><span></span><span></span><span></span></span>', 'bot'); 
        
        messagesContainer.scrollTop = messagesContainer.scrollHeight;

        fetch(apiURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            // ENVIAMOS EL MESSAGE Y EL SESSIONID (IMPORTANTE PARA EL BACKEND NUEVO)
            body: JSON.stringify({ 
                message: userMessage, 
                sessionId: sessionId 
            })
        })
        .then(response => {
            if (typingIndicator.parentNode) {
                messagesContainer.removeChild(typingIndicator);
            }
            
            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            addMessage(data.response, 'bot');
        })
        .catch(error => {
            console.error('Error de Conexión:', error);
            if (typingIndicator.parentNode) {
                typingIndicator.parentNode.removeChild(typingIndicator);
            }
            addMessage(`¡Ups! Mi cerebro tuvo un hipo de conexión. Inténtalo de nuevo.`, 'bot');
        })
        .finally(() => {
            inputField.disabled = false;
            inputField.focus();
            messagesContainer.scrollTop = messagesContainer.scrollHeight;
        });
    }

    function sendMessage() {
        const userMessage = inputField.value.trim();
        if (userMessage === '') return;

        addMessage(userMessage, 'user');
        inputField.value = ''; 
        getBotResponse(userMessage);
    }

    sendBtn.addEventListener('click', sendMessage);
    inputField.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });
});
