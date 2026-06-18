/**
 * backend/src/services/UserService.ts
 * Business logic layer for user-related operations.
 * Controllers delegate to this service rather than touching Mongoose directly.
 */
import bcrypt from 'bcryptjs';
import User from '../models/User';
import Setting from '../models/Setting';
import type { UserRole } from '../types';

class UserService {
  /** Find user by ID — throws if not found */
  async findById(id: string) {
    const user = await User.findById(id).select('-passwordHash -refreshToken');
    if (!user) throw new Error('User not found');
    return user;
  }

  /** Find user by username */
  async findByUsername(username: string) {
    return User.findOne({ username });
  }

  /** Create a new user and generate default settings */
  async create(username: string, password: string, role: UserRole = 'user') {
    const existing = await User.findOne({ username });
    if (existing) throw new Error('Username already taken');

    if (username.length < 3) throw new Error('Username must be at least 3 characters');
    if (password.length < 6) throw new Error('Password must be at least 6 characters');

    const passwordHash = await bcrypt.hash(password, 10);
    const user = await User.create({ username, passwordHash, role });

    // Default settings
    await Setting.create({ userId: user._id });

    return user;
  }

  /** Validate a password against the stored hash */
  async validatePassword(user: any, plainText: string): Promise<boolean> {
    return bcrypt.compare(plainText, user.passwordHash);
  }

  /** Update the stored refresh token (or clear it on logout) */
  async setRefreshToken(userId: string, token: string | undefined) {
    await User.findByIdAndUpdate(userId, { refreshToken: token });
  }

  /** List all users (admin) */
  async listAll() {
    return User.find().select('-passwordHash -refreshToken').sort({ createdAt: -1 });
  }

  /** Delete a user */
  async delete(userId: string) {
    await User.findByIdAndDelete(userId);
  }
}

export default new UserService();
