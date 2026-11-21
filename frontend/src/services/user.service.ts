/**
 * user.service.ts
 * Typed API wrappers for the /api/users/* endpoints.
 */
import api from './api';
import type { User, UserSettings } from '../types';

export interface UpdateProfilePayload {
  username?: string;
  password?: string;
}

const userService = {
  /** Get the authenticated user's profile */
  async getProfile(): Promise<User> {
    const res = await api.get<{ success: boolean; user: User }>('/users/me');
    return res.data.user;
  },

  /** Update the authenticated user's profile */
  async updateProfile(payload: UpdateProfilePayload): Promise<User> {
    const res = await api.patch<{ success: boolean; user: User }>('/users/me', payload);
    return res.data.user;
  },

  /** Get the authenticated user's settings */
  async getSettings(): Promise<UserSettings> {
    const res = await api.get<{ success: boolean; settings: UserSettings }>('/settings');
    return res.data.settings;
  },

  /** Update settings */
  async updateSettings(settings: Partial<UserSettings>): Promise<UserSettings> {
    const res = await api.patch<{ success: boolean; settings: UserSettings }>(
      '/settings',
      settings
    );
    return res.data.settings;
  },

  /** Admin: list all users */
  async listAll(): Promise<User[]> {
    const res = await api.get<{ success: boolean; users: User[] }>('/users');
    return res.data.users;
  },

  /** Admin: delete a user */
  async deleteUser(userId: string): Promise<void> {
    await api.delete(`/users/${userId}`);
  },
};

export default userService;
