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

const ChatSchema = new mongoose.Schema({
    userMessage: String,
    botResponse: String,
    timestamp: { type: Date, default: Date.now }
});

const Chat = mongoose.models.Chat || mongoose.model('Chat', ChatSchema);

app.post('/api/chat', async (req, res) => {
    try {
        await connectToDatabase();
        const { message } = req.body;
        const msg = message.toLowerCase();
        
        let responseText = "";

        if (msg.includes("hola") || msg.includes("buenos días") || msg.includes("buenas tardes")) {
            responseText = "¡Hola! Soy el asistente de Tralecto. No tomo café porque mi sistema prefiere la electricidad, pero tengo toda la energía para ayudarte. ¿Qué proyecto tienes en mente?";
        } 
        else if (msg.includes("juego") || msg.includes("videojuego")) {
            responseText = "¿Dijiste juegos? 🎮 ¡Eso nos encanta! En Tralecto creamos experiencias interactivas que enganchan. ¿Tienes una idea para el próximo gran éxito?";
        }
        else if (msg.includes("app") || msg.includes("aplicacion") || msg.includes("móvil")) {
            responseText = "¡Apps a la medida! 📱 Ya sea para Android o iOS, en Tralecto las hacemos fluidas y elegantes. ¿Es para tu negocio o una idea personal?";
        }
        else if (msg.includes("chiste") || msg.includes("gracia") || msg.includes("divertido")) {
            const chistes = [
                "¿Qué le dice un Jaguar a otro Jaguar? ... Jaguar you? 😂",
                "¿Por qué el libro de matemáticas se quitó la vida? ... ¡Porque tenía muchos problemas! 📚",
                "¿Cómo se dice 'pañuelo' en japonés? ... Saka-moko. 🤧",
                "¿Qué hace una abeja en el gimnasio? ... ¡Zumba! 🐝"
            ];
            responseText = chistes[Math.floor(Math.random() * chistes.length)];
        }
        else if (msg.includes("precio") || msg.includes("costo") || msg.includes("cuánto")) {
            responseText = "El precio depende de las medidas de tu proyecto. Pero no te asustes, cuéntame más y te doy un presupuesto que no te haga llorar.";
        }
        else {
            responseText = "¡Interesante! He guardado tu mensaje. Mientras tanto, ¿por qué no me das más detalles sobre lo que buscas en Tralecto?";
        }

        const newChat = new Chat({ userMessage: message, botResponse: responseText });
        await newChat.save();

        res.json({ response: responseText });

    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "Hubo un corto circuito mental." });
    }
});

module.exports.handler = serverless(app);
