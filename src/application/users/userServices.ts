import { IUser, IUserBody } from './userTypes';
import { DB_ID } from '../../config/dbConfig';
import genericRepository from '../../repositories/genericRepository';

const { userRepository } = genericRepository;

class UserServices {
  async findById(id: string | DB_ID): Promise<IUser | null> {
    return await userRepository.findById(id);
  }
  async findByEmail(email: string): Promise<IUser | null> {
    return await userRepository.findByEmail(email);
  }
  async createCustomer(body: IUserBody): Promise<IUser> {
    return await userRepository.create(body as IUser);
  }
  async updateCustomer(id: string, info: object): Promise<IUser | null> {
    return await userRepository.update(id, info);
  }
  async deleteCustomer(id: string) {
    return await userRepository.delete(id);
  }
}

const userService = new UserServices();

export default userService;
