import { MercadoPagoConfig, Payment } from 'mercadopago';
import { NextFunction, Request, Response } from 'express';
import ENV from '../../config/envConfig';
import Order from './orderModel';
import axios from 'axios';
import mongoose from 'mongoose';
import orderService from './orderServices';
import productService from '../products/productServices';

const precios = {
  CABA: 5500,
  Delivery: 6000,
  GBA: 7500,
  Pickup: 4500,
};
function calculateTotal(cartItems: { productPrice: number; quantity: number }[], deliveryMode: string) {
  let deliveryCost = 0;

  if (deliveryMode === 'Pickup') {
    deliveryCost = precios.Pickup;
  }
  if (deliveryMode === 'Express_CABA') {
    deliveryCost = precios.CABA;
  }
  if (deliveryMode === 'Express_GBA') {
    deliveryCost = precios.GBA;
  }
  if (deliveryMode === 'Standard') {
    deliveryCost = precios.Delivery;
  }

  let total = 0;
  console.log('cartItems', cartItems);
  cartItems.forEach((item: { productPrice: number; quantity: number }) => {
    total += item.productPrice * item.quantity;
  });

  total += deliveryCost;
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
    // Obtener el estado de pago
    const { status, id, paymentId, paymentMethod } = req.body;
    if (!status || !id || !paymentMethod) {
      return res.status(400).json({
        error: `Faltan datos para actualizar el estado de la orden. status:${status}, id:${id},  paymentMethod:${paymentMethod}`,
      });
    }
    // Iniciar la sesión de transacción
    const session = await mongoose.startSession();
    session.startTransaction();

    try {
      // Verificar el estado de pago de Mercado Pago si corresponde
      if (paymentMethod === 'Mercado Pago') {
        const mercadoPagoUrl = `https://api.mercadopago.com/v1/payments/${paymentId}`;
        const paymentMp = await axios.get(mercadoPagoUrl, {
          headers: {
            Authorization: `Bearer ${process.env.MERCADO_PAGO_CLIENT_ID}`,
          },
        });
        if (paymentMp.data.status !== 'approved') {
          const updatedOrder = await orderService.updateOrderStatus(id, 'Cancelled');
          await session.commitTransaction();
          session.endSession();
          return res.status(400).json({
            error: 'No se ha podido generar la orden porque el cliente canceló el pago.',
            orden: updatedOrder,
          });
        }
      }

      // Obtener la orden antes de actualizar el estado
      const order = await Order.findById(id).populate('orderItems._id').session(session).exec(); // Asegúrate de popular los productos
      if (!order) {
        await session.abortTransaction();
        session.endSession();
        return res.status(404).json({ error: 'Orden no encontrada' });
      }

      // Si el estado es "Shipped", reducir el stock
      if (status === 'Shipped') {
        for (const item of order.orderItems) {
          console.log({ item }, item._id);
          const product = await productService.findById(item._id);

          if (!product) {
            await session.abortTransaction();
            session.endSession();
            return res.status(404).json({ error: `Producto no encontrado: ${item._id}` });
          }

          // Buscar el stock correspondiente al color y talla del producto

          const stockItem = product.stock.find(
            (stock: any) => stock.color.includes(item.color) && stock.size.includes(item.size),
          );

          console.log({ stockItem }, item.color, item.size);
          if (stockItem && stockItem.quantity >= item.quantity) {
            // Reducir la cantidad en stock
            stockItem.quantity -= item.quantity;
          } else {
            await session.abortTransaction();
            session.endSession();
            return res.status(400).json({
              error: `No hay suficiente stock para el producto: ${product.name_en},stock:${product.stock}`,
            });
          }

          // Guardar el producto con el stock actualizado
          await product.save({ session });
        }
      }

      // Actualizar el estado de la orden
      const updatedOrder = await orderService.updateOrderStatus(id, status);

      // Hacer commit de la transacción si todo es exitoso
      await session.commitTransaction();
      session.endSession();

      res.status(200).json(updatedOrder);
    } catch (error) {
      // Si ocurre un error, se hace rollback
      await session.abortTransaction();
      session.endSession();
      console.error(error);
      next(error);
    }
  }

  async createOrder(req: Request, res: Response, next: NextFunction) {
    try {
      const {
        orderItems,
        totalPrice,
        userData,
        commentaries,
        deliveryMode,
        paymentMethod,
        shippingAddress1,
        mercadoPagoInfo,
      } = req.body;

      let deliveryCost = 0;

      if (deliveryMode === 'Pickup') {
        deliveryCost = precios.Pickup;
      }
      if (deliveryMode === 'Express_CABA') {
        deliveryCost = precios.CABA;
      }
      if (deliveryMode === 'Express_GBA') {
        deliveryCost = precios.GBA;
      }
      if (deliveryMode === 'Standard') {
        deliveryCost = precios.Delivery;
      }

      if (!orderItems || !totalPrice || !userData || !deliveryMode || !paymentMethod || !shippingAddress1) {
        console.log(orderItems, totalPrice, userData, deliveryMode, paymentMethod, shippingAddress1);
        return res.status(400).json({ error: 'Faltan campos requeridos.' });
      }

      const calculatedTotal = calculateTotal(orderItems, deliveryMode);
      if (calculatedTotal !== totalPrice) {
        return res.status(400).json({ error: 'Los totales no coinciden.' });
      }

      const itemsWithPricesAndQuantities = await Promise.all(
        orderItems.map(async ({ _id, quantity }: { _id: mongoose.Types.ObjectId; quantity: number }) => {
          const product = await productService.findById(_id);
          if (!product) throw new Error(`El producto no existe ${_id}`);

          return { _id, price: product.price_es, quantity };
        }),
      );

      const expectedTotal = itemsWithPricesAndQuantities.reduce(
        (acc, { price, quantity }) => acc + price * quantity,
        0,
      );
      const finalTotal = expectedTotal + deliveryCost;

      if (Math.abs(finalTotal - parseFloat(totalPrice)) > 0.001) {
        return res.status(400).json({ error: 'El total calculado no coincide con el total proporcionado.' });
      }

      let createdOrder;

      if (paymentMethod === 'Mercado Pago') {
        try {
          const client = new MercadoPagoConfig({ accessToken: ENV.ACCESS_TOKEN_MP ?? '' });
          const payment = new Payment(client);
          const paymentResponse: any = await payment.create({
            body: {
              ...mercadoPagoInfo,
              description: 'Orden de compra',
            },
          });
          console.log({ paymentResponse });
          if (!paymentResponse) {
            return res.status(400).json({ error: 'No se pudo realizar la orden porque falló el pago.' });
          }

          createdOrder = await orderService.createOrder({
            commentaries,
            deliveryMode,
            mercadoPagoInfo,
            orderItems,
            paymentId: paymentResponse.id,
            paymentMethod,
            paymentStatus: 'Success',
            shippingAddress1,
            totalPrice,
            userData: { ...userData },
          });

          return res.status(200).json(createdOrder);
        } catch (error) {
          console.log('mercado pago');
          console.log(error);
          return next(error);
        }
      }
      // Si el método de pago no es Mercado Pago o se salta el proceso anterior
      createdOrder = await orderService.createOrder({
        commentaries,
        deliveryMode,
        mercadoPagoInfo,
        orderItems,
        paymentMethod,
        paymentStatus: 'Pending',
        shippingAddress1,
        totalPrice,
        userData: { ...userData },
      });

      return res.status(200).json(createdOrder);
    } catch (error) {
      console.log('GENERAL');
      console.log(error);
      return next(error);
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
    const startDate = new Date();
    startDate.setDate(1);
    startDate.setHours(0, 0, 0, 0);
    const endDate = new Date(startDate.getTime());
    endDate.setMonth(endDate.getMonth() + 1);
    try {
      const pipeline = [
        {
          $match: {
            /*     created_at: { */
            /* $gte: startDate, */
            /* $lt: endDate, */
            /* }, */
            status: 'Delivered',
          },
        },
        {
          $unwind: '$orderItems',
        },
        {
          $lookup: {
            as: 'productInfo',
            foreignField: '_id',
            from: 'products',
            localField: 'orderItems._id',
          },
        },
        {
          $unwind: {
            path: '$productInfo',
            preserveNullAndEmptyArrays: true,
          },
        },
        {
          $group: {
            _id: '$_id',
            orderItems: {
              $addToSet: {
                productPrice: '$orderItems.productPrice',
                product_id: '$orderItems._id',
                quantity: '$orderItems.quantity',
                stockInfo: {
                  $map: {
                    as: 'stockItem',
                    in: {
                      color: '$$stockItem.color',
                      provider: '$$stockItem.provider',
                      providerCost: '$$stockItem.providerCost',
                      quantity: '$$stockItem.quantity',
                      size: '$$stockItem.size',
                    },
                    input: '$productInfo.stock',
                  },
                },
              },
            },
          },
        },
        {
          $sort: {
            createdAt: -1,
          },
        },
      ];

      const salesReport = await orderService.getAggregate(pipeline);
      res.status(200).json(salesReport);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
}
const orderController = new OrderController();
export default orderController;
