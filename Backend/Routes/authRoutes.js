import express, { Router } from 'express';

import {
    login,
	logout,
	signup,
	verifyEmail,
	forgetPassword,
	resetPassword,
	checkAuth,
} from '../controllers/auth.controller.js';

import { verifyToken } from '../middlewares/verifyToken.js'; // Use named import
// ... existing code ...
// ... existing code ... 
const router = Router();
router.get('/check-auth', verifyToken, checkAuth) 
router.post('/signup',signup)
router.post('/login',login)
router.post('/logout',logout)
router.post('/verify-email',verifyEmail)
router.post('/forget-password',forgetPassword)

router.post('/reset-password/:token/',resetPassword)
export default router;