import { Request, Response } from 'express';
import { AuthService } from '@/services/AuthService';
import { LoginDto, RegisterDto, ApiResponse } from '@/types';
import { asyncHandler } from '@/middleware/errorHandler';

export class AuthController {
  static login = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const loginData: LoginDto = req.body;
    const result = await AuthService.login(loginData);
    
    const response: ApiResponse = {
      success: true,
      data: result,
      message: 'Login successful'
    };
    
    res.json(response);
  });

  static register = asyncHandler(async (req: Request, res: Response): Promise<void> => {
    const registerData: RegisterDto = req.body;
    const result = await AuthService.register(registerData);
    
    const response: ApiResponse = {
      success: true,
      data: result,
      message: 'Registration successful'
    };
    
    res.status(201).json(response);
  });
}