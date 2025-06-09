import express, { Request, Response } from 'express';
import { PORT } from './config'; // Import PORT
import authRoutes from './routes/auth'; // Import auth routes
// Potentially import db connection to ensure it's up, though routes might handle it
// import './database/database'; // Ensures connection is attempted

const app = express();

app.use(express.json()); // Middleware to parse JSON bodies

// Mount auth routes
app.use('/api/auth', authRoutes);

app.get('/api', (req: Request, res: Response) => {
  res.send('Backend server is running!');
});

app.listen(PORT, () => {
  console.log(`Backend server listening on port ${PORT}`);
});
