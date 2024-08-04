import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';

// error handler
export default function errorHandler(error: Error, req: Request, res: Response, next: NextFunction) {
  if (error instanceof mongoose.Error.ValidationError) {
    res.status(400).json({ error: error.message });
  } else {
    res.status(500).json({ error: 'Internal Server Error' });
  }
  next();
}
