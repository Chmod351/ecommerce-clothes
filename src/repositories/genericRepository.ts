import { Inject, Service } from 'typedi';
import mongoose, { Model } from 'mongoose';
import { IOrder } from '../application/orders/orderTypes';
import { IProduct } from '../application/products/productTypes';
import { IUser } from '../application/users/userTypes';
import Order from '../application/orders/orderModel';
import Product from '../application/products/productModel';
import User from '../application/users/userModel';

interface DeleteResult {
  deletedCount: number;
}

interface IRepository<T> {
  findAll(page: number): Promise<T[]>;
  findByQuery(query: object, page: number): Promise<T[]>;
  findById(id: mongoose.Types.ObjectId | string): Promise<T | null>;
  create(item: T): Promise<T>;
  // eslint-disable-next-line
  update(id: mongoose.Types.ObjectId | string, item: any): Promise<T | null>;
  delete(id: mongoose.Types.ObjectId | string): Promise<DeleteResult>;
}

@Service()
class GenericRepository<T> implements IRepository<T> {
  constructor(@Inject('model') private model: Model<T>) {}
  async findAll(page: number): Promise<T[]> {
    const itemsPerPage: number = 50,
      skip: number = (page - 1) * itemsPerPage;

    return await this.model.find().skip(skip).limit(itemsPerPage).exec();
  }

  async findByQuery(query: object, page: number): Promise<T[]> {
    const itemsPerPage: number = 50,
      skip: number = (page - 1) * itemsPerPage;

    return await this.model.find(query).skip(skip).limit(itemsPerPage).exec();
  }

  async findById(id: mongoose.Types.ObjectId | string): Promise<T | null> {
    return await this.model.findById(id).exec();
  }
  async findByEmail(email: string): Promise<T | null> {
    return await this.model.findOne({ email }).exec();
  }
  async create(item: T): Promise<T> {
    return await this.model.create(item);
  }
  // eslint-disable-next-line
  async update(id: mongoose.Types.ObjectId | string, item: any): Promise<T | null> {
    const updated: T | null = await this.model
      .findOneAndUpdate({ _id: id }, item, {
        new: true,
      })
      .exec();
    return updated;
  }

  async delete(id: mongoose.Types.ObjectId | string): Promise<DeleteResult> {
    return await this.model.deleteOne({ _id: id }).exec();
  }
}
const productRepository = new GenericRepository<IProduct>(Product);

const userRepository = new GenericRepository<IUser>(User);

const orderRepository = new GenericRepository<IOrder>(Order);

const genericRepository = {
  orderRepository,
  productRepository,
  userRepository,
};

export default genericRepository;
