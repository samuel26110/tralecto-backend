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
        const contactoCierre = "\n\n✨ **Nuestros programadores ya están afilando el teclado para leerte.** Suéltanos tu **nombre y correo** aquí abajo y te contactaremos más rápido que un bug en viernes por la tarde.";

        // 1. DETECCIÓN DE CORREO (Finalización con estilo)
        if (msg.includes("@") && (msg.includes(".com") || msg.includes(".es") || msg.includes(".net"))) {
            responseText = "¡Recibido y procesado! 📩 Acabas de alegrarle el día a nuestro equipo. Vamos a analizar tu idea y te escribiremos pronto. ¡Gracias por elegir el lado divertido del software en **Tralecto**! ¡Nos vemos en el código! 👋✨";
        }
        // 2. VIDEOJUEGOS
        else if (msg.includes("juego") || msg.includes("videojuego")) {
            responseText = "¡Amo los videojuegos! 🎮 En Tralecto no solo los jugamos, ¡los creamos! Ya sea un mundo en 3D para flipar, un RPG pixel-art o algo loco en VR para móvil o PC, nosotros le damos al 'Play' a tu idea." + contactoCierre;
        } 
        // 3. APLICACIONES MÓVILES
        else if (msg.includes("app") || msg.includes("aplicacion") || msg.includes("móvil")) {
            responseText = "¡Una App! El accesorio favorito de todo el mundo. 📱 En Tralecto cocinamos apps para Android e iOS que son una delicia visual y técnica. ¿Tienes la idea del millón o algo para mejorar el mundo?" + contactoCierre;
        }
        // 4. PÁGINAS WEB
        else if (msg.includes("web") || msg.includes("página") || msg.includes("sitio")) {
            responseText = "¡Webs que enamoran! 🌐 Desde una tienda para vender hasta arena en el desierto, hasta plataformas de software ultra-potentes. Si se puede navegar, en Tralecto lo podemos construir con estilo." + contactoCierre;
        }
        // 5. CHISTES (Selección aleatoria)
        else if (msg.includes("chiste") || msg.includes("gracia")) {
            const chistes = [
                "¿Qué le dice un Jaguar a otro Jaguar? ... Jaguar you? 😂",
                "¿Por qué el libro de matemáticas se quitó la vida? ... ¡Porque tenía muchos problemas! 📚",
                "¿Qué hace una abeja en el gimnasio? ... ¡Zumba! 🐝",
                "¿Cómo se despiden los programadores? ... ¡Adi-OS! 🖥️"
            ];
            responseText = chistes[Math.floor(Math.random() * chistes.length)];
        }
        // 6. RESPUESTA GENÉRICA (Personalidad Tralecto)
        else {
            responseText = "¡Hola! Estás en **Tralecto**, el rincón donde el café se convierte en código mágico. 🚀 Hacemos de todo: Webs, Apps y Videojuegos épicos. \n\nCuéntame qué locura tienes en mente y **déjanos tu nombre y correo**; prometemos no enviarte spam aburrido, solo soluciones geniales.";
        }

        const newChat = new Chat({ userMessage: message, botResponse: responseText });
        await newChat.save();

        res.json({ response: responseText });

    } catch (error) {
        console.error("Error:", error);
        res.status(500).json({ error: "¡Ups! Mi cerebro de silicio acaba de tener un hipo. ¡Inténtalo de nuevo!" });
    }
});

module.exports.handler = serverless(app);
