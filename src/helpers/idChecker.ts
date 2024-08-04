import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';

function idChecker(req: Request, res: Response, next: NextFunction) {
  const id: string = req.params._id;
  if (!id) {
    return next(new Error('Missing id parameter'));
  } else if (!mongoose.Types.ObjectId.isValid(id)) {
    return next(new Error('Invalid ID'));
  }
  next();
}
export default idChecker;
