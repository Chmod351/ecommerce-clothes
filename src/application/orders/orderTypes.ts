import mongoose, { Document } from 'mongoose';

interface OrderItems {
  _id: mongoose.Types.ObjectId;
  productPrice: number;
  quantity: number;
  color: string;
  size: string;
}
export interface IOrder extends Document {
  commentaries: string;
  deliveryMode: string;
  orderItems: [OrderItems];
  shippingAddress1: string;
  shippingAddress2: string;
  paymentId: string;
  paymentMethod: 'Mercado Pago' | 'Transferencia';
  paymentStatus: 'Pending' | 'Failed' | 'Success';
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  totalPrice: number;
  userData: {
    city: string;
    country: string;
    dateOrdered: Date;
    email: string;
    name: string;
    phone: string;
    phone2: string;
    surname: string;
    zip: string;
  };
}
export interface IOrderBody {
  orderItems: [OrderItems];
  paymentMethod: string;
  commentaries: string;
  deliveryMode: string;
  shippingAddress1: string;
  paymentId: string;
  // shippingAddress2: string;
  // status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  totalPrice: number;
  userData: {
    city: string;
    country: string;
    email: string;
    name: string;
    phone: string;
    phone2: string;
    surname: string;
    zip: string;
  };
}
