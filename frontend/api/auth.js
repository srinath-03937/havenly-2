import { User } from './models/index.js';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';

export default async function handler(req, res) {
  // Add CORS headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, PUT, DELETE, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, Authorization');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  if (req.method === 'POST') {
    try {
      const { action, email, password, name, phone, role } = req.body;

      if (action === 'login') {
        // Login logic
        const user = await User.findByEmail(email);
        
        if (!user || !await bcrypt.compare(password, user.password)) {
          return res.status(401).json({ message: 'Invalid credentials' });
        }

        const token = jwt.sign(
          { userId: user.id, email: user.email, role: user.role },
          process.env.JWT_SECRET || 'fallback-secret',
          { expiresIn: '24h' }
        );

        return res.status(200).json({
          message: 'Login successful',
          token,
          user: {
            id: user.id,
            name: user.name,
            email: user.email,
            role: user.role,
            phone: user.phone,
            room_id: user.room_id
          }
        });
      } else if (action === 'register') {
        // Registration logic
        const existingUser = await User.findByEmail(email);
        if (existingUser) {
          return res.status(400).json({ message: 'User already exists' });
        }

        const hashedPassword = await bcrypt.hash(password, 10);
        const newUser = await User.create({
          name,
          email,
          password: hashedPassword,
          phone,
          role
        });

        const token = jwt.sign(
          { userId: newUser.id, email: newUser.email, role: newUser.role },
          process.env.JWT_SECRET || 'fallback-secret',
          { expiresIn: '24h' }
        );

        return res.status(201).json({
          message: 'Registration successful',
          token,
          user: {
            id: newUser.id,
            name: newUser.name,
            email: newUser.email,
            role: newUser.role,
            phone: newUser.phone
          }
        });
      } else {
        return res.status(400).json({ message: 'Invalid action' });
      }
    } catch (error) {
      console.error('Auth error:', error);
      return res.status(500).json({ message: 'Internal server error' });
    }
  } else {
    return res.status(405).json({ message: 'Method not allowed' });
  }
}
