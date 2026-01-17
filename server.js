// server.js - Optimizado para Tralecto (Producción)
const express = require('express');
const cors = require('cors');
const mongoose = require('mongoose');
require('dotenv').config(); 

const app = express();
// Cambio vital: usa el puerto del servidor o el 4000 por defecto
const port = process.env.PORT || 4000; 

// 1. CONEXIÓN A MONGODB
const mongoURI = process.env.MONGODB_URI; 
mongoose.connect(mongoURI)
    .then(() => console.log('✅ Conectado a MongoDB Atlas'))
    .catch(err => console.error('❌ Error MongoDB:', err));

// Esquema del Lead
const LeadSchema = new mongoose.Schema({
    initialMessage: { type: String, required: true },
    typeOfProject: { type: String, default: 'Unspecified' }, 
    contactName: { type: String, default: null },
    contactEmail: { type: String, default: null },
    currentStep: { type: Number, default: 0 },
    history: [{ sender: String, message: String, timestamp: { type: Date, default: Date.now } }],
    isCompleted: { type: Boolean, default: false },
    isManaged: { type: Boolean, default: false },
    timestamp: { type: Date, default: Date.now }
});
const Lead = mongoose.model('Lead', LeadSchema);

// Middlewares
app.use(cors()); // En producción cambia a app.use(cors({ origin: 'https://tralectos.netlify.app' }));
app.use(express.json());

// 2. PROTECCIÓN DE ADMIN
const checkAdminToken = (req, res, next) => {
    const providedToken = req.query.token || req.headers['x-admin-token'];
    if (!providedToken || providedToken !== process.env.ADMIN_TOKEN_SECRET) {
        return res.status(401).json({ success: false, message: "No autorizado" });
    }
    next();
};

// 3. LÓGICA DEL CHATBOT
app.post('/api/chat', async (req, res) => {
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
            botResponse = "Gracias por contactarnos. Nuestro objetivo es definir tu proyecto en 3 preguntas. Primero, **¿Qué tipo de proyecto estás buscando?** (Web, Móvil, Software a Medida, etc.)";
            break;
        case 1:
            lead.typeOfProject = userMessage;
            lead.currentStep = 2;
            botResponse = `¡Entendido! Un proyecto de ${userMessage} suena genial. Para que un asesor te contacte, **¿Cuál es tu nombre completo?**`;
            break;
        case 2:
            lead.contactName = userMessage;
            lead.currentStep = 3;
            botResponse = `Perfecto, ${lead.contactName}. Por último, **¿Cuál es tu correo electrónico de contacto?**`;
            break;
        case 3:
            lead.contactEmail = userMessage;
            lead.isCompleted = true; 
            lead.currentStep = 4;
            botResponse = `¡Excelente! Hemos registrado tu solicitud. Te contactaremos en **${userMessage}** en menos de 24 horas. ¡Gracias por elegir Tralecto!`;
            break;
        default:
            botResponse = "Ya hemos registrado tu solicitud. Si necesitas algo más, reinicia el chat.";
    }

    try {
        lead.history.push({ sender: 'bot', message: botResponse });
        await lead.save(); 
        res.json({ success: true, response: botResponse });
    } catch (error) {
        res.status(500).json({ success: false, response: "Error al guardar datos." });
    }
});

// 4. ENDPOINTS ADMIN
app.get('/api/leads', checkAdminToken, async (req, res) => {
    const allLeads = await Lead.find({}).sort({ timestamp: -1 }).select('-history'); 
    res.json(allLeads);
});

app.delete('/api/leads/:id', checkAdminToken, async (req, res) => {
    await Lead.findByIdAndDelete(req.params.id);
    res.json({ success: true, message: "Lead eliminado" });
});

app.listen(port, () => console.log(`Servidor Tralecto funcionando en puerto ${port}`));