import { SessionData } from 'express-session';
import mongoose from 'mongoose';

export interface MySessionData extends SessionData {
  loggedin?: boolean;
}

export interface IUser extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  username: string;
  password: string;
  email: string;
  type: 'admin' | 'customer';
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IUserBody {
  email: string;
  password: string;
  username: string;
}

export interface MySessionData extends SessionData {
  loggedin?: boolean;
  user?: {
    type?: string;
  };
}
