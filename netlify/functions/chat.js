const express = require('express');
const serverless = require('serverless-http');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

// Variable para mantener la conexión abierta y que no tarde en cada mensaje
let cachedDb = null;

async function connectToDatabase() {
    if (cachedDb) return cachedDb;
    cachedDb = await mongoose.connect(process.env.MONGODB_URI, {
        serverSelectionTimeoutMS: 5000, // Máximo 5 segundos para conectar
    });
    return cachedDb;
}

const ChatSchema = new mongoose.Schema({
    userMessage: String,
    botResponse: String,
    timestamp: { type: Date, default: Date.now }
});

// Evitar error de re-compilación de modelo en Netlify
const Chat = mongoose.models.Chat || mongoose.model('Chat', ChatSchema);

app.post('/api/chat', async (req, res) => {
    try {
        await connectToDatabase();
        const { message } = req.body;
        
        const responseText = `¡Hola! Recibí tu mensaje sobre: "${message}". El sistema Tralecto está listo.`;
        
        const newChat = new Chat({ 
            userMessage: message, 
            botResponse: responseText 
        });
        
        await newChat.save();
        res.json({ response: responseText });
    } catch (error) {
        console.error("Error detallado:", error);
        res.status(500).json({ error: "Error interno del servidor", details: error.message });
    }
});

module.exports.handler = serverless(app);
