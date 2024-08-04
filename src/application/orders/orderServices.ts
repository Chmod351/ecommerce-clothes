import { IOrder, IOrderBody } from './orderTypes';
import { DB_ID } from '../../config/dbConfig';

import genericRepository from '../../repositories/genericRepository';
const { orderRepository } = genericRepository;
class OrderService {
  async findAll(page: number) {
    return await orderRepository.findAll(page);
  }
  async updateOrderStatus(id: string, status: string) {
    return await orderRepository.update(id, status);
  }
  async findById(id: string | DB_ID) {
    return await orderRepository.findById(id);
  }
  async createOrder(body: IOrderBody): Promise<IOrder> {
    return await orderRepository.create(body as IOrder);
  }
  async deleteOrder(id: string) {
    return await orderRepository.delete(id);
  }
}

const orderService = new OrderService();

export default orderService;
