import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import compression from 'compression';
import morgan from 'morgan';
import dotenv from 'dotenv';
import connectDB from './config/db';
dotenv.config();
const app = express();
const PORT = process.env.PORT || 3000;
// Connect to Database
connectDB();
// Middleware
app.use(helmet());
app.use(cors());
app.use(compression());
app.use(express.json());
app.use(morgan('dev'));
// Health Check
app.get('/health', (req, res) => {
    res.status(200).json({ status: 'OK', message: 'Pokémon Champions API is running' });
});
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
//# sourceMappingURL=server.js.map