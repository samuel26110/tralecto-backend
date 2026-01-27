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

// Esquema organizado por Conversación
const ChatSchema = new mongoose.Schema({
    sessionId: String,
    messages: [{
        role: String, // 'user' o 'bot'
        text: String,
        timestamp: { type: Date, default: Date.now }
    }],
    lastUpdate: { type: Date, default: Date.now }
});

const Chat = mongoose.models.Chat || mongoose.model('Chat', ChatSchema);

app.post('/api/chat', async (req, res) => {
    try {
        await connectToDatabase();
        const { message, sessionId } = req.body;
        const msg = message.toLowerCase();
        
        let responseText = "";
        const contactoCierre = "\n\n✨ **Nuestros programadores ya están afilando el teclado.** Suéltanos tu **nombre y correo** aquí abajo y te contactaremos más rápido que un bug en viernes por la tarde.";

        // Lógica con humor de Tralecto
        if (msg.includes("@") && (msg.includes(".com") || msg.includes(".es") || msg.includes(".net"))) {
            responseText = "¡Recibido y procesado! 📩 Acabas de alegrarle el día a nuestro equipo. Vamos a analizar tu idea y te escribiremos pronto. ¡Gracias por elegir el lado divertido del software en **Tralecto**! 👋✨";
        }
        else if (msg.includes("juego") || msg.includes("videojuego")) {
            responseText = "¡Amo los videojuegos! 🎮 En Tralecto creamos experiencias en 2D, 3D y VR para móviles o PC. Ya sea un RPG o un plataformas, nosotros le damos al 'Play' a tu idea." + contactoCierre;
        } 
        else if (msg.includes("app") || msg.includes("aplicacion") || msg.includes("móvil")) {
            responseText = "¡Una App! El accesorio favorito de todos. 📱 En Tralecto cocinamos apps para Android e iOS que son una delicia visual. ¿Tienes la idea del millón?" + contactoCierre;
        }
        else if (msg.includes("web") || msg.includes("página") || msg.includes("sitio")) {
            responseText = "¡Webs que enamoran! 🌐 Desde una tienda online hasta plataformas de software ultra-potentes. Si se puede navegar, en Tralecto lo construimos con estilo." + contactoCierre;
        }
        else if (msg.includes("chiste") || msg.includes("gracia")) {
            const chistes = [
                "¿Qué le dice un Jaguar a otro Jaguar? ... Jaguar you? 😂",
                "¿Por qué el libro de matemáticas se quitó la vida? ... ¡Porque tenía muchos problemas! 📚",
                "¿Qué hace una abeja en el gimnasio? ... ¡Zumba! 🐝",
                "¿Cómo se despiden los programadores? ... ¡Adi-OS! 🖥️"
            ];
            responseText = chistes[Math.floor(Math.random() * chistes.length)];
        }
        else {
            responseText = "¡Hola! Estás en **Tralecto**, el rincón donde el café se convierte en código mágico. 🚀 Hacemos Webs, Apps y Videojuegos épicos. \n\nCuéntame tu idea y **déjanos tu nombre y correo**; prometemos no enviarte spam aburrido.";
        }

        // GUARDAR O ACTUALIZAR LA CONVERSACIÓN
        await Chat.findOneAndUpdate(
            { sessionId: sessionId },
            { 
                $push: { 
                    messages: [
                        { role: 'user', text: message },
                        { role: 'bot', text: responseText }
                    ] 
                },
                $set: { lastUpdate: Date.now() }
            },
            { upsert: true, new: true }
        );

        res.json({ response: responseText });

    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "¡Ups! Mi cerebro de silicio tuvo un hipo." });
    }
});

module.exports.handler = serverless(app);
