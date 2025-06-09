import dotenv from 'dotenv';
dotenv.config();

export const JWT_SECRET = process.env.JWT_SECRET || 'fallback-secret-key';
export const PORT = process.env.PORT || 3001;
// Add other configurations as needed
