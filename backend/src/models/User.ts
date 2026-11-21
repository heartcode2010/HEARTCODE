import { Schema, model, Document } from 'mongoose';

export interface IUser extends Document {
  username: string;
  email?: string;
  passwordHash?: string;
  googleId?: string;
  avatarUrl?: string;
  role: 'user' | 'admin';
  refreshToken?: string;
  createdAt: Date;
  updatedAt: Date;
}

const UserSchema = new Schema<IUser>(
  {
    username: {
      type: String,
      required: true,
      unique: true,
      trim: true,
      minlength: 3,
    },
    email: {
      type: String,
      sparse: true,
      trim: true,
      lowercase: true,
    },
    passwordHash: {
      type: String,
      default: null,
    },
    googleId: {
      type: String,
      sparse: true,
    },
    avatarUrl: {
      type: String,
      default: null,
    },
    role: {
      type: String,
      enum: ['user', 'admin'],
      default: 'user',
    },
    refreshToken: {
      type: String,
      default: null,
    },
  },
  {
    timestamps: true,
  }
);

export const User = model<IUser>('User', UserSchema);
export default User;
