import { NextFunction, Request, Response } from 'express';
import Product from '../products/productModel';
import mongoose from 'mongoose';
import orderService from './orderServices';

function calculateTotal(cartItems: any) {
  let total = 0;
  cartItems.forEach((item: { productPrice: number; quantity: number }) => {
    total += item.productPrice * item.quantity;
  });

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
    const { orderItems, totalPrice, ...otherData } = req.body;

    // Primero, verifica que el total calculado coincida con el total proporcionado
    const calculatedTotal = calculateTotal(orderItems);
    console.log(calculatedTotal, totalPrice);
    if (calculatedTotal !== totalPrice) {
      return res.status(400).json({ error: 'Los totales no coinciden.' });
    }

    // Itera sobre cada item en orderItems para obtener el precio y la cantidad
    const itemsWithPricesAndQuantities = await Promise.all(
      orderItems.map(async ({ productId, quantity }: { productId: mongoose.Types.ObjectId; quantity: number }) => {
        const product = await Product.findById(productId); // Asume que tienes un modelo de Producto
        if (!product) {
          throw new Error('El producto no existe');
        }
        return { price: product.price_es, productId, quantity }; // Retorna el precio del producto, el ID y la cantidad
      }),
    );

    // Calcula el total esperado sumando el precio unitario de cada producto multiplicado por su cantidad
    const expectedTotal = itemsWithPricesAndQuantities.reduce((acc, { price, quantity }) => acc + price * quantity, 0);
    console.log(expectedTotal);
    // Compara el total esperado con el total proporcionado
    if (Math.abs(expectedTotal - parseFloat(totalPrice)) > 0.001) {
      return res.status(400).json({ error: 'El total calculado no coincide con el total proporcionado.' });
    }
    // Si todo está bien, procede a crear la orden...
    try {
      const createdOrder = await orderService.createOrder({ ...otherData, totalPrice }); // Asume que el servicio crea la orden con el totalPrice
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
