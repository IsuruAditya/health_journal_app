import { Router } from 'express';
import { AuthController } from '../controllers/AuthController';
import { validateRequest, loginSchema, registerSchema } from '../middleware/validation';

const router = Router();

router.post('/login', validateRequest(loginSchema), AuthController.login);
router.post('/register', validateRequest(registerSchema), AuthController.register);

export default router;