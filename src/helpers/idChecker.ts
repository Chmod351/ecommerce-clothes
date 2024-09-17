import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';

function containsIdInParams(req: Request, res: Response, next: NextFunction) {
  console.log('params', req.params);
  const { id } = req.params;
  if (!id) {
    return next(new Error('Missing id parameter'));
  } else if (!mongoose.Types.ObjectId.isValid(id)) {
    console.log(`Invalid id: ${id}`);
    return next(new Error('Invalid ID'));
  }
  next();
}
function isUserAdmin(req: Request, res: Response, next: NextFunction) {
  console.log(req.session);
  if (!req.session) {
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
