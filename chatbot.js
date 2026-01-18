document.addEventListener('DOMContentLoaded', function() {
    // 1. Obtención de Elementos del DOM
    const openBtn = document.getElementById('open-chatbot-btn');
    const closeBtn = document.getElementById('close-chatbot-btn');
    const chatbotContainer = document.getElementById('chatbot-container');
    const messagesContainer = document.getElementById('chatbot-messages');
    const inputField = document.getElementById('chatbot-input-field');
    const sendBtn = document.getElementById('chatbot-send-btn');
    
    // URL del Backend 
    const apiURL = '/api/chat';

    // Comprobación de que los elementos esenciales existen
    if (!openBtn || !chatbotContainer) return; 

    // --- MANEJO DE LA INTERFAZ ---
    
    // Abrir Chatbot
    openBtn.addEventListener('click', () => {
        chatbotContainer.classList.remove('chatbot-hidden');
        inputField.focus(); // Poner el foco en el campo de texto
        sendWelcomeMessage(); // Envía el mensaje de bienvenida solo al abrir
    });

    // Cerrar Chatbot
    closeBtn.addEventListener('click', () => {
        chatbotContainer.classList.add('chatbot-hidden');
    });

    // --- LÓGICA DEL CHAT ---

    // Función para añadir mensajes (Bot o Usuario)
    function addMessage(text, sender) {
        const messageDiv = document.createElement('div');
        messageDiv.classList.add('message', sender);
        
        // Usar innerHTML para interpretar negritas (del bot)
        messageDiv.innerHTML = text; 
        
        messagesContainer.appendChild(messageDiv);
        // Desplazamiento automático al final
        messagesContainer.scrollTop = messagesContainer.scrollHeight;
        
        return messageDiv; // Devuelve el elemento para poder manipularlo (ej. el '...')
    }

    // Función de Bienvenida (Estática por ahora)
    function sendWelcomeMessage() {
        // Verificar si ya hay un mensaje (para evitar spam visual)
        if (messagesContainer.children.length > 0) return; 
        
        // Mensaje de bienvenida inicial
        addMessage("¡Hola! Soy Tralecto Bot y te ayudaré a definir tu proyecto. Por favor, escribe tu idea para comenzar.", 'bot');
    }

    // Función para conectar con el Backend (Lógica de comunicación)
    function getBotResponse(userMessage) {
        
        // 1. Desactivar el input mientras el bot "piensa"
        inputField.disabled = true;
        
        // 2. Añadir el indicador de que el bot está escribiendo
        const typingIndicator = addMessage('...', 'bot'); 
        
        messagesContainer.scrollTop = messagesContainer.scrollHeight; // Scroll inmediato

        fetch(apiURL, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json'
            },
            body: JSON.stringify({ message: userMessage })
        })
        .then(response => {
            // 3. Remover el indicador de que el bot está escribiendo
            messagesContainer.removeChild(typingIndicator); 
            
            if (!response.ok) {
                // Manejo de errores HTTP (ej: 404, 500)
                throw new Error(`HTTP error! status: ${response.status}`);
            }
            return response.json();
        })
        .then(data => {
            // Usar la respuesta que viene del backend
            addMessage(data.response, 'bot');
        })
        .catch(error => {
            // Manejo de errores de red o errores lanzados en el .then()
            console.error('Error de Conexión o Proceso:', error);
            
            // Asegurarse de que se quita el "..." si el error ocurre antes de recibir la respuesta
            if (typingIndicator.parentNode) {
                 typingIndicator.parentNode.removeChild(typingIndicator);
            }
            
            addMessage(`¡Error! Fallo al conectar con el Backend. ${error.message.includes('Failed to fetch') ? 'Verifica que el servidor Node.js (puerto 4000) esté corriendo.' : ''}`, 'bot');
        })
        .finally(() => {
            // 4. Volver a habilitar el input
            inputField.disabled = false;
            inputField.focus();
            messagesContainer.scrollTop = messagesContainer.scrollHeight; // Scroll final
        });
    }

    // Función principal para enviar el mensaje (llama a la conexión)
    function sendMessage() {
        const userMessage = inputField.value.trim();
        if (userMessage === '') return; // No enviar mensajes vacíos

        addMessage(userMessage, 'user');
        inputField.value = ''; // Limpiar el campo

        // Llamada a la función de conexión real
        getBotResponse(userMessage);
    }

    // Event Listeners (Activación)
    sendBtn.addEventListener('click', sendMessage);
    inputField.addEventListener('keypress', (e) => {
        if (e.key === 'Enter') {
            sendMessage();
        }
    });


});
