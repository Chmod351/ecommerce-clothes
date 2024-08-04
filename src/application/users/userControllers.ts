import { NextFunction, Request, Response } from 'express';
import Encrypt from '../../helpers/encription';
import { IUser } from './userTypes';
import { SessionData } from 'express-session';
import customerService from './userServices';
import dictionary from '../../config/dictionary';

interface MySessionData extends SessionData {
  loggedin?: boolean;
}
const encryption = new Encrypt();

class CustomerController {
  async findById(req: Request, res: Response, next: NextFunction) {
    try {
      const userId: string = req.params.id;
      const user: IUser | null = await customerService.findById(userId);
      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  }
  async update(req: Request, res: Response, next: NextFunction) {
    try {
      const { password } = req.body;
      const hashedPassword = await encryption.hashPassword(password);
      const customerId: string = req.params.id;
      const newCustomer: IUser | null = await customerService.updateCustomer(customerId, {
        password: hashedPassword,
      });
      res.status(200).json(newCustomer);
    } catch (error) {
      next(error);
    }
  }
  async create(req: Request, res: Response, next: NextFunction) {
    const { username, password, email } = req.body;

    if (!username || !password || !email) {
      return res.status(400).json({ error: dictionary.badRequest });
    }
    try {
      console.log(req.body);

      const hashedPassword = await encryption.hashPassword(password);
      console.log(hashedPassword);
      const user: IUser = await customerService.createCustomer({
        email,
        password: hashedPassword,
        username,
      });
      res.status(200).json(user);
    } catch (error) {
      next(error);
    }
  }
  async login(req: Request, res: Response, next: NextFunction) {
    try {
      const { email, password } = req.body;
      const user: IUser | null = await customerService.findByEmail(email);
      if (user !== null) {
        const match: boolean = await encryption.comparePassword(password, user.password);
        if (user === null || !match) {
          res.status(400).json({ message: 'password or email invalid' });
        } else {
          req.session.regenerate((err) => {
            if (err) {
              return next(err);
            }
            (req.session as MySessionData).loggedin = true;
            res.status(200).json({ message: dictionary.taskDoneSusscessfully, user });
          });
        }
      }
    } catch (error) {
      next(error);
    }
  }
  async logout(req: Request, res: Response, next: NextFunction) {
    try {
      req.session.destroy(function (err) {
        if (err) {
          next(err);
        } else {
          res.clearCookie('sessionId');
          res.status(200).json({ message: 'Logged out successfully' });
        }
      });
    } catch (error) {
      next(error);
    }
  }
  async delete(req: Request, res: Response, next: NextFunction) {
    try {
      const userId: string = req.params.id;
      const deletedCustomer = await customerService.deleteCustomer(userId);
      res.status(200).json(deletedCustomer);
    } catch (error) {
      next(error);
    }
  }
}

const customerController = new CustomerController();
export default customerController;
