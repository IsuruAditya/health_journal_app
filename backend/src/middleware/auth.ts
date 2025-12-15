import { Request, Response, NextFunction } from 'express';
import { AuthService } from '../services/AuthService';
import { AuthTokenPayload } from '../types';

declare global {
  namespace Express {
    interface Request {
      user?: AuthTokenPayload;
    }
  }
}

export const authMiddleware = (req: Request, res: Response, next: NextFunction): void => {
  try {
    const authHeader = req.header('Authorization');
    const token = authHeader?.replace('Bearer ', '');
    
    if (!token) {
      res.status(401).json({ 
        success: false, 
        error: 'Access denied. No token provided.' 
      });
      return;
    }

    const decoded = AuthService.verifyToken(token);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).json({ 
      success: false, 
      error: 'Invalid token.' 
    });
  }
};