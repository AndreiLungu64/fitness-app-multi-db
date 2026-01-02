import express, { Request, Response } from 'express';
import path from 'path';
import cors from 'cors';
import { corsOptions } from './config/corsOptions.js';
import { logger } from './middleware/logEvents.js';
import { errorHandler } from './middleware/errorHandler.js';
import verifyJWT from './middleware/verifyJWT.js';
import cookieParser from 'cookie-parser';
import { credentials } from './middleware/credentials.js';
import { connectMongo } from './config/mongo.js';

import { fileURLToPath } from 'url';
import { dirname } from 'path';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

// Import routes
import rootRoutes from './routes/root.js';
import registerRoutes from './routes/api/register.js';
import authRoutes from './routes/api/auth.js';
import refreshRoutes from './routes/api/refresh.js';
import logoutRoutes from './routes/api/logout.js';
import employeeRoutes from './routes/api/employees.js';
import exerciseRoutes from './routes/api/exercises.js';
import workoutPlansRoutes from './routes/api/workoutPlans.js';

const app = express();
const PORT = process.env.PORT || 3500;

// Connect to MongoDB
connectMongo().catch(err => {
  console.error('Failed to connect to MongoDB:', err);
  process.exit(1);
});

// Custom middleware logger
app.use(logger);

// Handle options credentials check - before CORS!
app.use(credentials);

// Cross Origin Resource Sharing
app.use(cors(corsOptions));

// Built-in middleware to handle urlencoded form data
app.use(express.urlencoded({ extended: false }));

// Built-in middleware for json
app.use(express.json());

// Middleware for cookies
app.use(cookieParser());

// Serve static files
app.use('/', express.static(path.join(__dirname, '/public')));

// PUBLIC Routes (no authentication required)
app.use('/', rootRoutes);
app.use('/register', registerRoutes);
app.use('/auth', authRoutes);
app.use('/refresh', refreshRoutes);
app.use('/logout', logoutRoutes);
app.use('/employees', employeeRoutes);
app.use('/api/exercises', exerciseRoutes);

// Protected routes (require JWT)
app.use(verifyJWT);
app.use('/api/workout-plans', workoutPlansRoutes);

// 404 handler
app.all('*', (req: Request, res: Response) => {
  res.status(404);
  if (req.accepts('html')) {
    res.sendFile(path.join(__dirname, 'views', '404.html'));
  } else if (req.accepts('json')) {
    res.json({ error: '404 Not Found' });
  } else {
    res.type('txt').send('404 Not Found');
  }
});

// Error handler
app.use(errorHandler);

app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
