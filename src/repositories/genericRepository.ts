import { DeleteResult, IRepository } from './repositoryTypes';
import { Inject, Service } from 'typedi';
import mongoose, { Model } from 'mongoose';
import { IOrder } from '../application/orders/orderTypes';
import { IProduct } from '../application/products/productTypes';
import { IUser } from '../application/users/userTypes';
import Order from '../application/orders/orderModel';
import Product from '../application/products/productModel';
import User from '../application/users/userModel';

@Service()
class GenericRepository<T> implements IRepository<T> {
  constructor(@Inject('model') private model: Model<T>) {}
  async findAll(page: number): Promise<{ data: T[]; totalItems: number; totalPages: number }> {
    const itemsPerPage: number = 50,
      skip: number = (page - 1) * itemsPerPage;

    const totalItems = await this.model.countDocuments().exec();
    const totalPages = Math.ceil(totalItems / itemsPerPage);

    const data = await this.model.find().skip(skip).limit(itemsPerPage).exec();

    return { data, totalItems, totalPages };
  }

  async findByQuery(query: object, page: number): Promise<{ data: T[]; totalItems: number; totalPages: number }> {
    const itemsPerPage: number = 50,
      skip: number = (page - 1) * itemsPerPage;

    const totalItems = await this.model.countDocuments(query).exec();

    const totalPages = Math.ceil(totalItems / itemsPerPage);

    const data = await this.model.find(query).skip(skip).limit(itemsPerPage).exec();

    return { data, totalItems, totalPages };
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
