const express = require('express');
const serverless = require('serverless-http');
const mongoose = require('mongoose');
const cors = require('cors');

const app = express();
app.use(cors());
app.use(express.json());

const uri = process.env.MONGODB_URI;

let cachedDb = null;
async function connectToDatabase() {
    if (cachedDb && mongoose.connection.readyState === 1) return cachedDb;
    cachedDb = await mongoose.connect(uri, { serverSelectionTimeoutMS: 5000 });
    return cachedDb;
}

// Reutilizamos el esquema del Chat
const ChatSchema = new mongoose.Schema({
    sessionId: String,
    messages: [{ role: String, text: String, timestamp: Date }],
    lastUpdate: { type: Date, default: Date.now }
});

const Chat = mongoose.models.Chat || mongoose.model('Chat', ChatSchema);

app.get('/api/leads', async (req, res) => {
    try {
        await connectToDatabase();
        // Traemos todos los chats ordenados por el más reciente
        const chats = await Chat.find().sort({ lastUpdate: -1 });
        
        // Transformamos los datos para que tu admin.js los entienda
        const leads = chats.map(chat => {
            // Intentamos adivinar datos o mostramos genéricos
            const firstMsg = chat.messages.find(m => m.role === 'user')?.text || "Sin mensaje";
            return {
                _id: chat._id,
                contactName: "Visitante " + chat.sessionId.substr(-4), // Nombre temporal
                contactEmail: "Chat Anónimo", // El bot nuevo no guarda email en campo aparte aun
                typeOfProject: "Consulta General",
                initialMessage: firstMsg,
                timestamp: chat.lastUpdate
            };
        });

        res.json(leads);
    } catch (error) {
        res.status(500).json({ error: error.message });
    }
});

module.exports.handler = serverless(app);
