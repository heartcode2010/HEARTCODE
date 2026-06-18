import { Response, NextFunction } from 'express';
import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import User from '../models/User';
import Setting from '../models/Setting';
import { AuthenticatedRequest } from '../middleware/auth.middleware';

const generateTokens = (user: { id: string; username: string; role: 'user' | 'admin' }) => {
  const jwtSecret = process.env.JWT_SECRET || 'supersecretjwtkeyforheartcodenotproductionready123!';
  const refreshSecret = process.env.JWT_REFRESH_SECRET || 'supersecretjwtrefreshkeyforheartcodenotproductionready456!';

  const accessToken = jwt.sign(
    { id: user.id, username: user.username, role: user.role },
    jwtSecret,
    { expiresIn: '15m' }
  );

  const refreshToken = jwt.sign(
    { id: user.id },
    refreshSecret,
    { expiresIn: '7d' }
  );

  return { accessToken, refreshToken };
};

export const register = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { username, password, role } = req.body;

    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Username and password are required' });
    }

    if (username.length < 3) {
      return res.status(400).json({ success: false, message: 'Username must be at least 3 characters long' });
    }

    const existingUser = await User.findOne({ username });
    if (existingUser) {
      return res.status(400).json({ success: false, message: 'Username is already taken' });
    }

    const passwordHash = await bcrypt.hash(password, 10);
    
    // Assign admin role if requested AND it's either the first user or registered with an admin flag (simplified configuration)
    const assignedRole = role === 'admin' ? 'admin' : 'user';

    const user = new User({
      username,
      passwordHash,
      role: assignedRole,
    });

    await user.save();

    // Create default settings for the user
    const setting = new Setting({
      userId: user._id,
    });
    await setting.save();

    const tokens = generateTokens({ id: user._id.toString(), username: user.username, role: user.role });
    user.refreshToken = tokens.refreshToken;
    await user.save();

    return res.status(201).json({
      success: true,
      message: 'User registered successfully',
      ...tokens,
      user: {
        id: user._id,
        username: user.username,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const login = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { username, password } = req.body;

    if (!username || !password) {
      return res.status(400).json({ success: false, message: 'Username and password are required' });
    }

    const user = await User.findOne({ username });
    if (!user) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const isMatch = await bcrypt.compare(password, user.passwordHash);
    if (!isMatch) {
      return res.status(401).json({ success: false, message: 'Invalid credentials' });
    }

    const tokens = generateTokens({ id: user._id.toString(), username: user.username, role: user.role });
    user.refreshToken = tokens.refreshToken;
    await user.save();

    return res.json({
      success: true,
      message: 'Login successful',
      ...tokens,
      user: {
        id: user._id,
        username: user.username,
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
    } catch (err) {
      return res.status(403).json({ success: false, message: 'Invalid or expired refresh token' });
    }

    const user = await User.findById(decodedPayload.id);
    if (!user || user.refreshToken !== refreshToken) {
      return res.status(403).json({ success: false, message: 'Invalid refresh token mapping' });
    }

    const tokens = generateTokens({ id: user._id.toString(), username: user.username, role: user.role });
    user.refreshToken = tokens.refreshToken;
    await user.save();

    return res.json({
      success: true,
      ...tokens,
      user: {
        id: user._id,
        username: user.username,
        role: user.role,
      },
    });
  } catch (error) {
    next(error);
  }
};

export const logout = async (req: AuthenticatedRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.body; // or req.user.id
    const userId = id || (req.user && req.user.id);

    if (!userId) {
      return res.status(400).json({ success: false, message: 'User ID required' });
    }

    const user = await User.findById(userId);
    if (user) {
      user.refreshToken = undefined;
      await user.save();
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
export default { register, login, refresh, logout, getMe };
