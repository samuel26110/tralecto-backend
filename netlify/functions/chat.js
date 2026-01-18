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
        const contactoCierre = "\n\n🚀 **Este mensaje llegará directamente a nuestros programadores.** Por favor, escribe tu **nombre y correo electrónico** para que podamos enviarte una propuesta detallada.";

        // 1. VIDEOJUEGOS
        if (msg.includes("juego") || msg.includes("videojuego")) {
            responseText = "¡Los videojuegos son nuestra pasión! 🎮 En Tralecto creamos experiencias en 2D, 3D y VR para móviles o PC. Ya sea un RPG, un plataformas o un juego de acción, podemos hacerlo realidad." + contactoCierre;
        } 
        // 2. APLICACIONES MÓVILES
        else if (msg.includes("app") || msg.includes("aplicacion") || msg.includes("móvil")) {
            responseText = "¡Excelente! 📱 Desarrollamos Apps nativas e híbridas (iOS/Android). Desde herramientas para empresas hasta redes sociales con diseño de vanguardia." + contactoCierre;
        }
        // 3. PÁGINAS WEB
        else if (msg.includes("web") || msg.includes("página") || msg.includes("sitio")) {
            responseText = "¡Entendido! 🌐 Creamos desde tiendas online (E-commerce) y webs para restaurantes, hasta plataformas complejas de software. Nos adaptamos totalmente a tu modelo de negocio." + contactoCierre;
        }
        // 4. CHISTES
        else if (msg.includes("chiste") || msg.includes("gracia")) {
            const chistes = [
                "¿Qué le dice un Jaguar a otro Jaguar? ... Jaguar you? 😂",
                "¿Por qué el libro de matemáticas se quitó la vida? ... ¡Porque tenía muchos problemas! 📚",
                "¿Qué hace una abeja en el gimnasio? ... ¡Zumba! 🐝"
            ];
            responseText = chistes[Math.floor(Math.random() * chistes.length)];
        }
        // 5. RESPUESTA GENÉRICA (Identidad de marca)
        else {
            responseText = "En **Tralecto** somos un estudio creativo especializado en transformar ideas en software: Webs, Apps móviles y Videojuegos (2D/3D/VR). 🚀 \n\n¿Tienes un proyecto en mente? Cuéntame un poco más y **déjanos tu nombre y correo** para que nuestro equipo técnico se ponga en contacto contigo.";
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
