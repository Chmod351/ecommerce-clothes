import { NextFunction, Request, Response } from 'express';
import { MySessionData } from '../application/users/userTypes';
import mongoose from 'mongoose';

function containsIdInParams(req: Request, res: Response, next: NextFunction) {
  const id: string = req.params._id;
  if (!id) {
    return next(new Error('Missing id parameter'));
  } else if (!mongoose.Types.ObjectId.isValid(id)) {
    console.log(`Invalid id: ${id}`);
    return next(new Error('Invalid ID'));
  }
  next();
}
function isUserAdmin(req: Request, res: Response, next: NextFunction) {
  const userType = (req.session as MySessionData).user?.type;
  if (!req.session || userType !== 'admin') {
    return res.status(401).json({ error: 'Unauthorized' });
  } else {
    next();
  }
}
const idChecker = {
  containsIdInParams,
  isUserAdmin,
};
export default idChecker;
