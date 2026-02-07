import express from 'express';
import dotenv from 'dotenv';
import cors from 'cors';
import main_route from "./routes/MainRoute";

dotenv.config();

console.log('🚀 Starting server...');
console.log('Environment check:');
console.log('   PORT:', process.env.PORT);
console.log('   JWT_SECRET:', process.env.JWT_SECRET ? 'SET ✅' : 'MISSING ❌');
console.log('   REFRESH_TOKEN:', process.env.REFRESH_TOKEN ? 'SET ✅' : 'MISSING ❌');
console.log('   DATABASE_URL:', process.env.DATABASE_URL ? 'SET ✅' : 'MISSING ❌');

const app = express();
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

app.use(cors({
    origin: "http://localhost:5173",
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE'],
    allowedHeaders: ['Content-Type', 'Authorization'],
    credentials: true,
}));

app.use('/api/v1', main_route.router);


app.use((req, res) => {
    res.status(404).json({
        message: 'Route not found',
        path: req.path
    });
});

const PORT = process.env.PORT || 8080;
app.listen(PORT, () => {
    console.log(`🚀 Server is running on port ${PORT}`);
    console.log(`📍 http://localhost:${PORT}`);
});