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
      console.log(error);
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
      console.log(error);
      next(error);
    }
  }

  async createOrder(req: Request, res: Response, next: NextFunction) {
    const { body } = req;
    try {
      const createdOrder = orderService.createOrder(body);
      res.status(200).json(createdOrder);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
  async deleteOrder(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    try {
      const deletedOrder = orderService.deleteOrder(id);
      res.status(200).json(deletedOrder);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
  // sell metrics here

  async getMonthlySalesReport(req: Request, res: Response, next: NextFunction) {
    try {
      const { month, year } = req.query;
      const startOfMonth = new Date(`${year}-${month}-01`);
      const endOfMonth = new Date(startOfMonth);
      endOfMonth.setMonth(endOfMonth.getMonth() + 1);
      endOfMonth.setDate(1);

      const pipeline = [
        {
          $match: {
            createdAt: {
              $gte: startOfMonth,
              $lt: endOfMonth,
            },
          },
        },
        {
          $group: {
            _id: { $month: '$createdAt' },
            city: { $first: '$shippingAddress.city' },
            country: { $first: '$shippingAddress.country' },
            date: { $first: '$createdAt' },
            sucessfulOrders: { $sum: { $cond: [{ $eq: ['$status', 'Delivered'] }, 1, 0] } },
            totalOrders: { $sum: 1 },
            totalProducts: { $sum: '$products.quantity' },
            totalSales: { $sum: '$totalPrice' },
          },
        },
        {
          $sort: { month: 1, year: 1 },
        },
      ];
      const salesReport = await orderService.getMonthlySalesReport(pipeline, 1);
      res.status(200).json(salesReport);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
}
const orderController = new OrderController();
export default orderController;
