import { IUser } from './userTypes';
import mongoose from 'mongoose';
import validator from 'email-validator';

const UserSchema = new mongoose.Schema<IUser>(
  {
    email: {
      maxlength: [50, 'Email address is too long'],
      required: [true, 'The email is required'],
      type: String,
      unique: true,
      validate: {
        message: 'Invalid email format',
        validator: (email: string) => validator.validate(email),
      },
    },
    password: {
      minlength: [8, 'The password must have at least 8 characters'],
      required: [true, 'The password is required'],
      type: String,
    },
    type: {
      default: 'customer',
      enum: ['admin', 'customer'],
      type: String,
    },
    username: {
      maxLength: [50, 'The max length for the username is 50 characters'],
      minlength: [3, 'The username must have at least 3 characters'],
      required: [true, 'The username is required'],
      type: String,
      unique: true,
    },
  },
  { timestamps: true },
);

const User = mongoose.model<IUser>('User', UserSchema);
export default User;
