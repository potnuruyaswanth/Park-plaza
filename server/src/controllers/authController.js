import User from '../models/User.js';
import jwt from 'jsonwebtoken';
import { JWT_EXPIRY } from '../config/constants.js';
import crypto from 'crypto';
import nodemailer from 'nodemailer';

const generateTokens = (userId, role) => {
  const accessToken = jwt.sign(
    { id: userId, role },
    process.env.JWT_SECRET,
    { expiresIn: JWT_EXPIRY.ACCESS }
  );

  const refreshToken = jwt.sign(
    { id: userId, role, jti: crypto.randomUUID() },
    process.env.REFRESH_TOKEN_SECRET,
    { expiresIn: JWT_EXPIRY.REFRESH }
  );

  return { accessToken, refreshToken };
};

const buildVerificationLink = (token) => {
  const baseUrl = process.env.CLIENT_URL || process.env.APP_BASE_URL || 'http://localhost:5173';
  return `${baseUrl}/verify-email?token=${token}`;
};

const buildResetLink = (token) => {
  const baseUrl = process.env.CLIENT_URL || process.env.APP_BASE_URL || 'http://localhost:5173';
  return `${baseUrl}/reset-password?token=${token}`;
};

const getEmailTransporter = () => {
  if (!process.env.SMTP_HOST || !process.env.SMTP_USER || !process.env.SMTP_PASS) {
    throw new Error('Email service is not configured');
  }

  return nodemailer.createTransport({
    host: process.env.SMTP_HOST,
    port: Number(process.env.SMTP_PORT || 587),
    secure: false,
    auth: {
      user: process.env.SMTP_USER,
      pass: process.env.SMTP_PASS
    }
  });
};

const sendVerificationEmail = async (email, token) => {
  const transporter = getEmailTransporter();
  const link = buildVerificationLink(token);

  await transporter.sendMail({
    from: process.env.SMTP_FROM || 'no-reply@parkplaza.local',
    to: email,
    subject: 'Verify your Park Plaza account',
    text: `Please verify your email by visiting: ${link}`,
    html: `<p>Please verify your email by clicking this link:</p><p><a href="${link}">${link}</a></p>`
  });
};

const sendPasswordResetEmail = async (email, token) => {
  const transporter = getEmailTransporter();
  const link = buildResetLink(token);

  await transporter.sendMail({
    from: process.env.SMTP_FROM || 'no-reply@parkplaza.local',
    to: email,
    subject: 'Reset your Park Plaza password',
    text: `Reset your password by visiting: ${link}`,
    html: `<p>Reset your password by clicking this link:</p><p><a href="${link}">${link}</a></p>`
  });
};

const issueRefreshToken = (user, ip) => {
  const { accessToken, refreshToken } = generateTokens(user._id, user.role);

  user.refreshTokens = user.refreshTokens || [];
  user.refreshTokens.push({ token: refreshToken, createdAt: new Date(), revokedByIp: ip || null });

  if (user.refreshTokens.length > 5) {
    user.refreshTokens = user.refreshTokens.slice(user.refreshTokens.length - 5);
  }

  return { accessToken, refreshToken };
};

const createEmailVerificationToken = () => {
  const rawToken = crypto.randomBytes(32).toString('hex');
  const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex');
  return { rawToken, hashedToken, expires: new Date(Date.now() + 24 * 60 * 60 * 1000) };
};

const createPasswordResetToken = () => {
  const rawToken = crypto.randomBytes(32).toString('hex');
  const hashedToken = crypto.createHash('sha256').update(rawToken).digest('hex');
  return { rawToken, hashedToken, expires: new Date(Date.now() + 60 * 60 * 1000) };
};

export const register = async (req, res) => {
  try {
    const { username, name, email, phone, password, address } = req.body;

    // Validation
    if (!username || !name || !email || !phone || !password) {
      return res.status(400).json({ message: 'Please provide all required fields' });
    }

    // Check if username already exists
    const existingUsername = await User.findOne({ username: username.toLowerCase() });
    if (existingUsername) {
      return res.status(400).json({ message: 'Username already taken. Please choose a different username.' });
    }

    // Check if email already exists
    const existingEmail = await User.findOne({ email });
    if (existingEmail) {
      return res.status(400).json({ message: 'Email already registered' });
    }

    if (!/^[A-Z0-9._%+-]+@gmail\.com$/i.test(email)) {
      return res.status(400).json({ message: 'Email must be a valid @gmail.com address' });
    }

    const { rawToken, hashedToken, expires } = createEmailVerificationToken();

    // Create user
    const user = await User.create({
      username: username.toLowerCase(),
      name,
      email,
      phone,
      password,
      role: 'USER',
      address: address || {},
      emailVerificationToken: hashedToken,
      emailVerificationExpires: expires
    });

    try {
      await sendVerificationEmail(user.email, rawToken);
    } catch (emailError) {
      await User.findByIdAndDelete(user._id);
      return res.status(500).json({ message: emailError.message || 'Failed to send verification email' });
    }

    res.status(201).json({
      message: 'Registration successful. Please verify your email before logging in.',
      user: user.toJSON()
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const loginWithRole = async (req, res, allowedRole) => {
  try {
    const { emailOrUsername, email, username, password } = req.body;

    if (!password) {
      return res.status(400).json({ message: 'Please provide password' });
    }

    // Support login with username OR email
    const loginIdentifier = emailOrUsername || email || username;
    if (!loginIdentifier) {
      return res.status(400).json({ message: 'Please provide username or email' });
    }

    // Find user by email or username
    const user = await User.findOne({
      $or: [
        { email: loginIdentifier },
        { username: loginIdentifier.toLowerCase() }
      ]
    }).select('+password');
    
    if (!user) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (allowedRole && user.role !== allowedRole) {
      return res.status(403).json({ message: 'Unauthorized role for this login' });
    }

    const isPasswordValid = await user.comparePassword(password);
    if (!isPasswordValid) {
      return res.status(401).json({ message: 'Invalid credentials' });
    }

    if (user.role !== 'ADMIN' && !user.emailVerified) {
      return res.status(403).json({ message: 'Please verify your email before logging in' });
    }

    const { accessToken, refreshToken } = issueRefreshToken(user, req.ip);
    await user.save();

    res.status(200).json({
      message: 'Login successful',
      user: user.toJSON(),
      accessToken,
      refreshToken
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const loginUser = async (req, res) => loginWithRole(req, res, 'USER');
export const loginEmployee = async (req, res) => loginWithRole(req, res, 'EMPLOYEE');
export const login = async (req, res) => loginWithRole(req, res, null);

export const verifyEmail = async (req, res) => {
  try {
    const { token } = req.query;

    if (!token) {
      return res.status(400).json({ message: 'Verification token is required' });
    }

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    const user = await User.findOne({
      emailVerificationToken: hashedToken,
      emailVerificationExpires: { $gt: new Date() }
    });

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired verification token' });
    }

    user.emailVerified = true;
    user.emailVerificationToken = null;
    user.emailVerificationExpires = null;
    await user.save();

    res.status(200).json({ message: 'Email verified successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const requestPasswordReset = async (req, res) => {
  try {
    const { email, emailOrUsername, username } = req.body;
    const identifier = email || emailOrUsername || username;

    if (!identifier) {
      return res.status(400).json({ message: 'Please provide email or username' });
    }

    const user = await User.findOne({
      $or: [
        { email: identifier },
        { username: identifier.toLowerCase() }
      ]
    });

    if (!user) {
      return res.status(200).json({ message: 'If the account exists, a reset link has been sent.' });
    }

    if (user.role !== 'ADMIN' && !user.emailVerified) {
      return res.status(403).json({ message: 'Please verify your email before requesting a password reset.' });
    }

    const { rawToken, hashedToken, expires } = createPasswordResetToken();
    user.passwordResetToken = hashedToken;
    user.passwordResetExpires = expires;
    await user.save();

    await sendPasswordResetEmail(user.email, rawToken);

    res.status(200).json({ message: 'If the account exists, a reset link has been sent.' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const resetPassword = async (req, res) => {
  try {
    const { token, password } = req.body;

    if (!token || !password) {
      return res.status(400).json({ message: 'Token and new password are required' });
    }

    const hashedToken = crypto.createHash('sha256').update(token).digest('hex');
    const user = await User.findOne({
      passwordResetToken: hashedToken,
      passwordResetExpires: { $gt: new Date() }
    }).select('+password');

    if (!user) {
      return res.status(400).json({ message: 'Invalid or expired reset token' });
    }

    user.password = password;
    user.passwordResetToken = null;
    user.passwordResetExpires = null;
    user.refreshTokens = [];
    await user.save();

    res.status(200).json({ message: 'Password reset successfully' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const refreshAccessToken = async (req, res) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(401).json({ message: 'Refresh token required' });
    }

    const decoded = jwt.verify(refreshToken, process.env.REFRESH_TOKEN_SECRET);
    const user = await User.findById(decoded.id);

    if (!user) {
      return res.status(401).json({ message: 'Invalid refresh token' });
    }

    const tokenRecord = (user.refreshTokens || []).find((t) => t.token === refreshToken && !t.revokedAt);

    if (!tokenRecord) {
      user.refreshTokens = [];
      await user.save();
      return res.status(401).json({ message: 'Refresh token reuse detected. Please log in again.' });
    }

    tokenRecord.revokedAt = new Date();
    const { accessToken, refreshToken: newRefreshToken } = issueRefreshToken(user, req.ip);
    tokenRecord.replacedByToken = newRefreshToken;
    await user.save();

    res.status(200).json({
      accessToken,
      refreshToken: newRefreshToken
    });
  } catch (error) {
    res.status(401).json({ message: 'Invalid refresh token' });
  }
};

export const logout = async (req, res) => {
  try {
    const userId = req.user.id;
    const { refreshToken } = req.body;
    const user = await User.findById(userId);

    if (user) {
      if (refreshToken) {
        user.refreshTokens = (user.refreshTokens || []).filter((t) => t.token !== refreshToken);
      } else {
        user.refreshTokens = [];
      }
      await user.save();
    }

    res.status(200).json({ message: 'Logout successful' });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Check username availability
export const checkUsername = async (req, res) => {
  try {
    const { username } = req.query;
    
    if (!username) {
      return res.status(400).json({ message: 'Please provide a username' });
    }

    const existingUser = await User.findOne({ username: username.toLowerCase() });
    
    if (existingUser) {
      return res.status(200).json({ 
        available: false, 
        message: 'Username already taken' 
      });
    }

    res.status(200).json({ 
      available: true, 
      message: 'Username is available' 
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// Public endpoint to get showrooms for registration
export const getShowroomsForRegistration = async (req, res) => {
  try {
    const Showroom = (await import('../models/Showroom.js')).default;
    const showrooms = await Showroom.find({ isActive: true }).select('_id name address city');

    res.status(200).json({
      message: 'Showrooms fetched successfully',
      count: showrooms.length,
      showrooms
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};
