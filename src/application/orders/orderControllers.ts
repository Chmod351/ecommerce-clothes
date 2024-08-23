import { NextFunction, Request, Response } from 'express';
import mongoose from 'mongoose';
import orderService from './orderServices';
import productService from '../products/productServices';

function calculateTotal(cartItems: { productPrice: number; quantity: number }[]) {
  let total = 0;
  console.log('cartItems', cartItems);
  cartItems.forEach((item: { productPrice: number; quantity: number }) => {
    total += item.productPrice * item.quantity;
  });
  console.log(total);
  return total;
}

class OrderController {
  async findAll(req: Request, res: Response, next: NextFunction) {
    const page: number | undefined = parseInt(req.query.page as string) || 1;
    try {
      const { data, totalItems, totalPages } = await orderService.findAll(page);
      res.status(200).json({ data, totalItems, totalPages });
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
    const { orderItems, totalPrice, userData, commentaries, deliveryMode, paymentMethod, shippingAddress1 } = req.body;

    if (!orderItems || !totalPrice || !userData || !deliveryMode || !paymentMethod || !shippingAddress1) {
      console.log(orderItems, totalPrice, userData, deliveryMode, paymentMethod, shippingAddress1);
      return res.status(400).json({ error: 'Faltan campos requeridos.' });
    }
    // Primero, verifica que el total calculado coincida con el total proporcionado
    const calculatedTotal = calculateTotal(orderItems);
    console.log(calculatedTotal, totalPrice);
    if (calculatedTotal !== totalPrice) {
      return res.status(400).json({ error: 'Los totales no coinciden.' });
    }

    // Itera sobre cada item en orderItems para obtener el precio y la cantidad
    const itemsWithPricesAndQuantities = await Promise.all(
      orderItems.map(async ({ _id, quantity }: { _id: mongoose.Types.ObjectId; quantity: number }) => {
        let product;
        try {
          product = await productService.findById(_id);
          if (!product) {
            throw new Error(`El producto no existe    ${_id}`);
          }
        } catch (e) {
          console.log(e);
          throw new Error('El producto no existe');
        }

        return { _id, price: product.price_es, quantity }; // Retorna el precio del producto, el ID y la cantidad
      }),
    );

    // Calcula el total esperado sumando el precio unitario de cada producto multiplicado por su cantidad
    const expectedTotal = itemsWithPricesAndQuantities.reduce((acc, { price, quantity }) => acc + price * quantity, 0);
    console.log('expectedTotal', expectedTotal);
    // Compara el total esperado con el total proporcionado
    if (Math.abs(expectedTotal - parseFloat(totalPrice)) > 0.001) {
      return res.status(400).json({ error: 'El total calculado no coincide con el total proporcionado.' });
    }
    console.log(userData, commentaries, deliveryMode, totalPrice);
    try {
      const createdOrder = await orderService.createOrder({
        commentaries: commentaries,
        deliveryMode: deliveryMode,
        orderItems: orderItems,
        paymentMethod: paymentMethod,
        shippingAddress1: shippingAddress1,
        totalPrice: totalPrice,
        userData: { ...userData },
      });
      console.log(createdOrder);
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
