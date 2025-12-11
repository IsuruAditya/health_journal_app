import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { UserModel } from '@/models/User';
import { AuthTokenPayload, LoginDto, RegisterDto } from '@/types';

export class AuthService {
  private static readonly JWT_SECRET = process.env.JWT_SECRET || 'your-secret-key';
  private static readonly JWT_EXPIRES_IN = '24h';

  static async login(loginData: LoginDto) {
    const { email, password } = loginData;
    
    const user = await UserModel.findByEmail(email);
    if (!user) {
      throw new Error('Invalid credentials');
    }

    const isValidPassword = await bcrypt.compare(password, user.password);
    if (!isValidPassword) {
      throw new Error('Invalid credentials');
    }

    const token = this.generateToken({ id: user.id, email: user.email });
    
    return {
      token,
      user: { id: user.id, email: user.email }
    };
  }

  static async register(registerData: RegisterDto) {
    const { email, password } = registerData;
    
    const existingUser = await UserModel.findByEmail(email);
    if (existingUser) {
      throw new Error('User already exists');
    }

    const hashedPassword = await bcrypt.hash(password, 10);
    const user = await UserModel.create(email, hashedPassword);
    
    const token = this.generateToken({ id: user.id, email: user.email });
    
    return {
      token,
      user: { id: user.id, email: user.email }
    };
  }

  static generateToken(payload: AuthTokenPayload): string {
    return jwt.sign(payload, this.JWT_SECRET, { expiresIn: this.JWT_EXPIRES_IN });
  }

  static verifyToken(token: string): AuthTokenPayload {
    return jwt.verify(token, this.JWT_SECRET) as AuthTokenPayload;
  }
}