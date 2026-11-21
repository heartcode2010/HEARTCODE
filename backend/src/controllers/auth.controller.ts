import { Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import Setting from '../models/Setting';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

const ADMIN_EMAIL = process.env.ADMIN_EMAIL || 'aniebietabasienobong@gmail.com';

const generateTokens = (user: { id: string; username: string; email?: string; role: 'user' | 'admin' }) => {
  const jwtSecret = process.env.JWT_SECRET || 'supersecretjwtkeyforheartcodenotproductionready123!';
  const refreshSecret = process.env.JWT_REFRESH_SECRET || 'supersecretjwtrefreshkeyforheartcodenotproductionready456!';

  const accessToken = jwt.sign(
    { id: user.id, username: user.username, email: user.email, role: user.role },
    jwtSecret,
    { expiresIn: '30d' }
  );

  const refreshToken = jwt.sign(
    { id: user.id },
    refreshSecret,
    { expiresIn: '60d' }
  );

  return { accessToken, refreshToken };
};

export const register = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { username, email, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Username and password are required' });
    }

    if (username.length < 3) {
      return res.status(400).json({ success: false, message: 'Username must be at least 3 characters long' });
    }

    const existingUser = await User.findOne({
      $or: [{ username }, ...(email ? [{ email }] : [])],
    });

    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Username or email already in use' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    
    // Automatically grant admin role if email matches the designated administrator
    const isSuperAdmin = email && email.toLowerCase() === ADMIN_EMAIL.toLowerCase();
    const assignedRole = isSuperAdmin ? 'admin' : 'user';

    const user = new User({
      username,
      email: email ? email.toLowerCase() : undefined,
      passwordHash,
      role: assignedRole,
    });

    await user.save();

    // Create default settings for the user
    try {
      const setting = new Setting({
        userId: user._id,
      });
      await setting.save();
    } catch {
      // Non-critical setting setup
    }

    const tokens = generateTokens({ id: user._id.toString(), username: user.username, email: user.email, role: user.role });
    user.refreshToken = tokens.refreshToken;
    await user.save();

    return res.status(201).json({
      success: true,
      message: 'Account registered successfully',
      ...tokens,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { username, email, password } = req.body;
    const identifier = username || email;

    if (!identifier || !password) {
      return res.status(400).json({ success: false, message: 'Username/Email and password are required' });
    }

    const user = await User.findOne({
      $or: [
        { username: identifier },
        { email: identifier.toLowerCase() },
      ],
    });

    if (!user || !user.passwordHash) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    // Ensure super admin role is verified
    if (user.email && user.email.toLowerCase() === ADMIN_EMAIL.toLowerCase() && user.role !== 'admin') {
      user.role = 'admin';
      await user.save();
    }

    const tokens = generateTokens({ id: user._id.toString(), username: user.username, email: user.email, role: user.role });
    user.refreshToken = tokens.refreshToken;
    await user.save();

    return res.json({
      success: true,
      message: 'Login successful',
      ...tokens,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const googleAuth = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { email, name, googleId, avatarUrl } = req.body;

    if (!email) {
      return res.status(400).json({ success: false, message: 'Google account email required' });
    }

    const normalizedEmail = email.toLowerCase();
    const isSuperAdmin = normalizedEmail === ADMIN_EMAIL.toLowerCase();

    let user = await User.findOne({
      $or: [
        { email: normalizedEmail },
        ...(googleId ? [{ googleId }] : []),
      ],
    });

    if (!user) {
      // Create new user for this Google account
      const baseUsername = (name || normalizedEmail.split('@')[0]).replace(/[^a-zA-Z0-9]/g, '').toLowerCase() || 'agent';
      let uniqueUsername = baseUsername;
      let counter = 1;

      while (await User.findOne({ username: uniqueUsername })) {
        uniqueUsername = `${baseUsername}${counter++}`;
      }

      user = new User({
        username: uniqueUsername,
        email: normalizedEmail,
        googleId,
        avatarUrl,
        role: isSuperAdmin ? 'admin' : 'user',
      });
      await user.save();
    } else {
      // Update existing user with Google credentials
      if (googleId && !user.googleId) user.googleId = googleId;
      if (avatarUrl && !user.avatarUrl) user.avatarUrl = avatarUrl;
      if (isSuperAdmin) user.role = 'admin';
      await user.save();
    }

    const tokens = generateTokens({ id: user._id.toString(), username: user.username, email: user.email, role: user.role });
    user.refreshToken = tokens.refreshToken;
    await user.save();

    return res.json({
      success: true,
      message: 'Google authentication successful',
      ...tokens,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        avatarUrl: user.avatarUrl,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const refresh = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { refreshToken } = req.body;

    if (!refreshToken) {
      return res.status(400).json({ success: false, message: 'Refresh token is required' });
    }

    const refreshSecret = process.env.JWT_REFRESH_SECRET || 'supersecretjwtrefreshkeyforheartcodenotproductionready456!';
    let decodedPayload: { id: string };

    try {
      decodedPayload = jwt.verify(refreshToken, refreshSecret) as { id: string };
    } catch {
      return res.status(403).json({ success: false, message: 'Invalid or expired refresh token' });
    }

    const user = await User.findById(decodedPayload.id);
    if (!user || user.refreshToken !== refreshToken) {
      return res.status(403).json({ success: false, message: 'Invalid refresh token mapping' });
    }

    const tokens = generateTokens({ id: user._id.toString(), username: user.username, email: user.email, role: user.role });
    user.refreshToken = tokens.refreshToken;
    await user.save();

    return res.json({
      success: true,
      ...tokens,
      user: {
        id: user._id,
        username: user.username,
        email: user.email,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.body;
    const userId = id || (req.user && req.user.id);

    if (userId) {
      const user = await User.findById(userId);
      if (user) {
        user.refreshToken = undefined;
        await user.save();
      }
    }

    return res.json({ success: true, message: 'Logged out successfully' });
  } catch (error) {
    next(error);
  }
};

export const getMe = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    if (!req.user) {
      return res.status(401).json({ success: false, message: 'Authentication required' });
    }

    const user = await User.findById(req.user.id).select('-passwordHash');
    if (!user) {
      return res.status(404).json({ success: false, message: 'User not found' });
    }

    return res.json({
      success: true,
      user,
    });
  } catch (error) {
    next(error);
  }
};

export default { register, login, googleAuth, refresh, logout, getMe };
