const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

dotenv.config();

const isPlaceholderSecret = (value = '') => {
  const normalized = value.trim().toLowerCase();
  return !normalized || normalized.includes('replace_with') || normalized.includes('change_in_production') || normalized.includes('your_super_secret');
};

const validateProductionEnv = () => {
  if (process.env.NODE_ENV !== 'production') return;

  if (!process.env.MONGO_URI) {
    throw new Error('Missing required env var: MONGO_URI');
  }

  if (isPlaceholderSecret(process.env.JWT_SECRET)) {
    throw new Error('JWT_SECRET must be set to a strong production value');
  }

  if (!process.env.CORS_ORIGIN) {
    throw new Error('Missing required env var: CORS_ORIGIN');
  }
};

validateProductionEnv();
connectDB();

const app = express();
const allowedOrigins = (process.env.CORS_ORIGIN || 'http://localhost:5173,http://localhost:3000')
  .split(',')
  .map((origin) => origin.trim())
  .filter(Boolean);

app.disable('x-powered-by');
app.set('trust proxy', 1);

app.use((req, res, next) => {
  res.setHeader('Referrer-Policy', 'strict-origin-when-cross-origin');
  res.setHeader('X-Content-Type-Options', 'nosniff');
  res.setHeader('X-Frame-Options', 'DENY');
  res.setHeader('Cross-Origin-Opener-Policy', 'same-origin');
  next();
});

app.use(cors({ origin: allowedOrigins, credentials: true }));
app.use(express.json({ limit: '1mb' }));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/user', require('./routes/user'));
app.use('/api/parcels', require('./routes/parcels'));
app.use('/api/admin', require('./routes/admin'));

app.get('/', (req, res) => res.json({ message: 'Courier Tracking API Running' }));

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
