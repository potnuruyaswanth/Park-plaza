import express from 'express';
import {
	register,
	login,
	loginUser,
	loginEmployee,
	refreshAccessToken,
	logout,
	getShowroomsForRegistration,
	checkUsername,
	verifyEmail,
	requestPasswordReset,
	resetPassword
} from '../controllers/authController.js';
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();

router.post('/register', register);
router.post('/register-user', register);
router.post('/login', login);
router.post('/login-user', loginUser);
router.post('/login-employee', loginEmployee);
router.get('/verify-email', verifyEmail);
router.post('/password/forgot', requestPasswordReset);
router.post('/password/reset', resetPassword);
router.get('/check-username', checkUsername);
router.get('/showrooms', getShowroomsForRegistration);
router.post('/refresh-token', refreshAccessToken);
router.post('/logout', authMiddleware, logout);

export default router;
