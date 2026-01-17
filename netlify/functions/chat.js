const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
const serverless = require('serverless-http');
require('dotenv').config();

const app = express();

// Conexión optimizada para funciones (reutiliza la conexión)
let cachedDb = null;

async function connectToDatabase() {
    if (cachedDb) return cachedDb;
    const db = await mongoose.connect(process.env.MONGODB_URI);
    cachedDb = db;
    return db;
}

const LeadSchema = new mongoose.Schema({
    initialMessage: { type: String, required: true },
    typeOfProject: { type: String, default: 'Unspecified' },
    contactName: { type: String, default: null },
    contactEmail: { type: String, default: null },
    currentStep: { type: Number, default: 0 },
    history: [{ sender: String, message: String, timestamp: { type: Date, default: Date.now } }],
    isCompleted: { type: Boolean, default: false },
    timestamp: { type: Date, default: Date.now }
});

const Lead = mongoose.models.Lead || mongoose.model('Lead', LeadSchema);

app.use(cors());
app.use(express.json());

// Endpoint del Chatbot
app.post('/api/chat', async (req, res) => {
    await connectToDatabase();
    const userMessage = req.body.message || '';
    
    let lead = await Lead.findOne({ isCompleted: false }).sort({ timestamp: -1 });

    if (!lead) {
        lead = new Lead({ initialMessage: userMessage, currentStep: 0, history: [{ sender: 'user', message: userMessage }] });
    } else {
        lead.history.push({ sender: 'user', message: userMessage });
    }

    let botResponse = '';
    switch (lead.currentStep) {
        case 0:
            lead.currentStep = 1;
            botResponse = "Gracias por contactarnos. ¿Qué tipo de proyecto buscas? (Web, Móvil, etc.)";
            break;
        case 1:
            lead.typeOfProject = userMessage;
            lead.currentStep = 2;
            botResponse = `¡Genial! Para asesorarte, ¿Cuál es tu nombre completo?`;
            break;
        case 2:
            lead.contactName = userMessage;
            lead.currentStep = 3;
            botResponse = `Perfecto. Por último, ¿Cuál es tu correo electrónico?`;
            break;
        case 3:
            lead.contactEmail = userMessage;
            lead.isCompleted = true;
            lead.currentStep = 4;
            botResponse = `¡Listo! Te contactaremos en menos de 24 horas.`;
            break;
        default:
            botResponse = "Ya registramos tu solicitud. ¡Gracias!";
    }

    lead.history.push({ sender: 'bot', message: botResponse });
    await lead.save();
    res.json({ success: true, response: botResponse });
});

// Exportar como función de Netlify
module.exports.handler = serverless(app);