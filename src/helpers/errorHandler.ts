import { NextFunction, Request, Response } from 'express';

// error handler
export default function errorHandler(error: Error, req: Request, res: Response, next: NextFunction) {
  if (error && error.message) {
    res.status(400).json({ error: error.message });
  } else {
    console.log(error.message);
    res.status(500).json({ error: 'Internal Server Error' });
  }
  next();
}
