import { NextFunction, Request, Response } from 'express';
import { IOrder } from './orderTypes';
import orderService from './orderServices';

class OrderController {
  async findAll(req: Request, res: Response, next: NextFunction) {
    const page: number | undefined = parseInt(req.query.page as string) || 1;
    try {
      const orders: IOrder[] = await orderService.findAll(page);
      res.status(200).json(orders);
    } catch (error) {
      next(error);
    }
  }
  async updateOrderStatus(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    const { status } = req.body;
    try {
      const updatedOrder = await orderService.updateOrderStatus(id, status);
      res.status(200).json(updatedOrder);
    } catch (error) {
      next(error);
    }
  }

  createOrder(req: Request, res: Response, next: NextFunction) {
    const { body } = req;
    try {
      const createdOrder = orderService.createOrder(body);
      res.status(200).json(createdOrder);
    } catch (error) {
      next(error);
    }
  }
  deleteOrder(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    try {
      const deletedOrder = orderService.deleteOrder(id);
      res.status(200).json(deletedOrder);
    } catch (error) {
      next(error);
    }
  }
}
const orderController = new OrderController();
export default orderController;
