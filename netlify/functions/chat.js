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

// Esquema del Chat
const ChatSchema = new mongoose.Schema({
    sessionId: String,
    messages: [{
        role: String, 
        text: String,
        timestamp: { type: Date, default: Date.now }
    }],
    lastUpdate: { type: Date, default: Date.now }
});

const Chat = mongoose.models.Chat || mongoose.model('Chat', ChatSchema);

app.post('/api/chat', async (req, res) => {
    try {
        await connectToDatabase();
        
        const { message, sessionId, userName } = req.body; 
        const msg = message.toLowerCase(); // Convertimos todo a minúsculas para analizar mejor
        
        let responseText = "";
        const contactoCierre = "\n\n✨ **Déjanos tu nombre y correo** y hablamos en serio.";

        // ======================================================
        // 🛡️ NIVEL 1: SISTEMA DE SEGURIDAD (BLACKLIST)
        // ======================================================
        // Lista de palabras que NO permitimos (puedes agregar más)
        const palabrasProhibidas = [
            "estupido", "idiota", "tonto", "basura", "inutil", 
            "matar", "morir", "droga", "sexo", "porno", 
            "racista", "odio", "politica", "religion"
        ];

        // Verificamos si el mensaje contiene alguna palabra prohibida
        const esOfensivo = palabrasProhibidas.some(palabra => msg.includes(palabra));

        if (esOfensivo) {
            responseText = "🚫 **Sistema de Seguridad Activado:** Mi programación me impide procesar mensajes ofensivos o fuera de las normas de la comunidad. Hablemos de tecnología con respeto, por favor. 🤖";
        }

        // ======================================================
        // 🚀 NIVEL 2: TEMAS DE NEGOCIO (LO QUE SÍ QUEREMOS)
        // ======================================================
        
        // Saludos e Identificación
        else if ((msg.includes('hola') || msg.includes('buenos') || msg.includes('hey')) && userName) {
            responseText = `¡Hola de nuevo, **${userName}**! 👋 Veo que ya tienes cuenta. ¿En qué puedo ayudarte hoy con tu proyecto?`;
        }
        else if ((msg.includes('hola') || msg.includes('buenos') || msg.includes('hey'))) {
            responseText = "¡Hola! Soy Tralecto Bot. 🤖 Estoy aquí para convertir tus ideas en código. ¿Hablamos de una Web, una App o un Juego?";
        }

        // Dashboard y Cuenta
        else if (msg.includes("dashboard") || msg.includes("panel") || msg.includes("proyecto") || msg.includes("avance")) {
            if(userName) {
                responseText = `Como eres cliente registrado (**${userName}**), puedes ver el avance en tu <a href='dashboard.html' style='color:#fff; text-decoration:underline; font-weight:bold;'>Panel de Control aquí</a>.`;
            } else {
                responseText = "Para ver tu proyecto, necesitas iniciar sesión en 'Acceso Clientes'.";
            }
        }

        // Servicios Específicos
        else if (msg.includes("juego") || msg.includes("videojuego") || msg.includes("rpg") || msg.includes("unity")) {
            responseText = "¡Videojuegos! 🎮 Mi especialidad. Hacemos RPGs, plataformas y experiencias 3D. ¿Tienes una idea para móvil o PC?" + contactoCierre;
        } 
        else if (msg.includes("app") || msg.includes("aplicacion") || msg.includes("movil") || msg.includes("android") || msg.includes("ios")) {
            responseText = "¡Apps Móviles! 📱 Desarrollamos aplicaciones nativas que vuelan. ¿Es para un negocio o una startup?" + contactoCierre;
        }
        else if (msg.includes("web") || msg.includes("pagina") || msg.includes("sitio") || msg.includes("ecommerce")) {
            responseText = "¡Desarrollo Web! 🌐 Desde tiendas online hasta sistemas empresariales. Si vive en internet, nosotros lo construimos." + contactoCierre;
        }
        else if (msg.includes("precio") || msg.includes("costo") || msg.includes("cuanto vale") || msg.includes("cotiza")) {
            responseText = "El costo depende de la magnitud de tu sueño. 💰 No es lo mismo un blog que un MMORPG. \n\nPor favor, describe tu idea y te daré un rango estimado.";
        }
        
        // Easter Eggs (Chistes permitidos)
        else if (msg.includes("chiste") || msg.includes("broma")) {
            const chistes = [
                "¿Qué le dice un GIF a un JPG? ... ¡Anímate hombre! 😂",
                "¿Por qué los programadores prefieren el modo oscuro? ... ¡Porque la luz atrae a los bugs! 🐛",
                "¡Toc Toc! ... ¿Quién es? ... ¡Java! ... ¡Java quién? ... ¡Java a funcionar, lo prometo! ☕"
            ];
            responseText = chistes[Math.floor(Math.random() * chistes.length)];
        }

        // ======================================================
        // 🧱 NIVEL 3: EL MURO (RESPUESTA POR DEFECTO RESTRINGIDA)
        // ======================================================
        else {
            // Si llega aquí, es porque preguntó algo que NO tiene que ver con lo anterior.
            // En lugar de intentar responder cualquier cosa, lo devolvemos al carril.
            
            if (userName) {
                responseText = `Disculpa **${userName}**, mi inteligencia está enfocada 100% en **Ingeniería de Software**. 🚧\n\nNo puedo opinar sobre ese tema, pero soy un experto diseñando **Apps, Webs y Videojuegos**. ¿Tienes alguna duda técnica?`;
            } else {
                responseText = "Mi red neuronal está entrenada exclusivamente para **Desarrollo de Software**. 🚧\n\nNo tengo información sobre eso, pero pregúntame sobre cómo crear tu propia App o Videojuego y con gusto te ayudo.";
            }
        }

        // 4. GUARDADO EN BASE DE DATOS
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
        res.status(500).json({ error: "Error interno del servidor." });
    }
});

module.exports.handler = serverless(app);
