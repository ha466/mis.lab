import express from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import db from '../database/database'; // SQLite connection
import { JWT_SECRET } from '../config';
import { AuthRequest, protect } from '../middleware/authMiddleware'; // Import protect middleware

const router = express.Router();

// POST /api/auth/register
router.post('/register', (req, res) => {
  const { username, email, password, role = 'staff' } = req.body;

  if (!username || !email || !password) {
    return res.status(400).json({ message: 'Please provide username, email, and password' });
  }

  // Basic email validation
  if (!/\S+@\S+\.\S+/.test(email)) {
      return res.status(400).json({ message: 'Invalid email format' });
  }

  // Role validation
  const allowedRoles = ['admin', 'staff', 'viewer'];
  if (!allowedRoles.includes(role)) {
      return res.status(400).json({ message: 'Invalid role specified' });
  }

  const salt = bcrypt.genSaltSync(10);
  const hashedPassword = bcrypt.hashSync(password, salt);

  const sql = 'INSERT INTO users (username, email, password, role) VALUES (?, ?, ?, ?)';
  db.run(sql, [username, email, hashedPassword, role], function (err) {
    if (err) {
      if (err.message.includes('UNIQUE constraint failed: users.username')) {
        return res.status(409).json({ message: 'Username already exists' });
      }
      if (err.message.includes('UNIQUE constraint failed: users.email')) {
        return res.status(409).json({ message: 'Email already exists' });
      }
      console.error('Registration error:', err.message);
      return res.status(500).json({ message: 'Server error during registration' });
    }
    res.status(201).json({ message: 'User registered successfully', userId: this.lastID });
  });
});

// POST /api/auth/login
router.post('/login', (req, res) => {
  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Please provide email and password' });
  }

  const sql = 'SELECT * FROM users WHERE email = ?';
  db.get(sql, [email], (err, user: any) => {
    if (err) {
      console.error('Login DB error:', err.message);
      return res.status(500).json({ message: 'Server error during login' });
    }
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials (email not found)' });
    }

    const isMatch = bcrypt.compareSync(password, user.password);
    if (!isMatch) {
      return res.status(401).json({ message: 'Invalid credentials (password mismatch)' });
    }

    const token = jwt.sign(
      { userId: user.id, username: user.username, role: user.role },
      JWT_SECRET,
      { expiresIn: '1h' } // Token expires in 1 hour
    );

    res.json({
      message: 'Login successful',
      token,
      user: { id: user.id, username: user.username, email: user.email, role: user.role },
    });
  });
});

// GET /api/auth/profile (Example protected route)
router.get('/profile', protect, (req: AuthRequest, res) => {
    // req.user is populated by the 'protect' middleware
    if (!req.user) {
        return res.status(401).json({ message: 'Not authorized, user data unavailable after protect middleware.'});
    }
    // Fetch more complete user data from DB if needed, excluding password
    const sql = 'SELECT id, username, email, role, createdAt FROM users WHERE id = ?';
    db.get(sql, [req.user.id], (err, profileData) => {
        if (err) {
            console.error('Profile fetch error:', err.message);
            return res.status(500).json({ message: 'Server error fetching profile' });
        }
        if (!profileData) {
            return res.status(404).json({ message: 'User profile not found' });
        }
        res.json({ userProfile: profileData });
    });
});

export default router;
