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

const UserSchema = new mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    name: String,
    role: { type: String, default: 'client' },
    projectName: { type: String, default: 'Nuevo Proyecto' },
    status: { type: String, default: 'Análisis Inicial' }, 
    progress: { type: Number, default: 5 },
    startDate: { type: Date, default: Date.now }
});

const User = mongoose.models.User || mongoose.model('User', UserSchema);

app.post('/api/auth', async (req, res) => {
    await connectToDatabase();
    const { action, email, password, name, userId, newStatus, newProgress } = req.body;

    try {
        if (action === 'register') {
            const existingUser = await User.findOne({ email });
            if (existingUser) return res.status(400).json({ error: "Este correo ya existe." });
            const newUser = new User({ email, password, name });
            await newUser.save();
            return res.json({ success: true, userId: newUser._id, name: newUser.name, role: 'client' });
        }
        if (action === 'login') {
            const user = await User.findOne({ email, password });
            if (!user) return res.status(401).json({ error: "Credenciales incorrectas." });
            return res.json({ success: true, userId: user._id, name: user.name, role: user.role });
        }
        if (action === 'get_dashboard') {
            const user = await User.findById(userId);
            if (!user) return res.status(404).json({ error: "Usuario no encontrado" });
            return res.json({ name: user.name, projectName: user.projectName, status: user.status, progress: user.progress });
        }
        if (action === 'admin_get_users') {
            const users = await User.find({ role: 'client' }).sort({ startDate: -1 });
            return res.json({ users });
        }
        if (action === 'admin_update_project') {
            await User.findByIdAndUpdate(userId, { status: newStatus, progress: newProgress });
            return res.json({ success: true });
        }
    } catch (error) {
        return res.status(500).json({ error: error.message });
    }
});

module.exports.handler = serverless(app);
