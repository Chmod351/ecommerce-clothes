import mongoose, { Document } from 'mongoose';
import { IProduct } from '../products/productTypes';

interface OrderItems {
  productId: IProduct;
  productPrice: number;
  quantity: number;
}
export interface IOrder extends Document {
  _id: mongoose.Types.ObjectId;
  city: string;
  country: string;
  dateOrdered: Date;
  orderItems: [OrderItems];
  shippingAddress1: string;
  shippingAddress2: string;
  paymentMethod: string;
  paymentStatus: 'Pending' | 'Failed' | 'Success';
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  totalPrice: number;
  userData: {
    email: string;
    name: string;
    phone: string;
    phone2: string;
    surname: string;
  };
  zip: string;
}

export interface IOrderBody {
  city: string;
  country: string;
  orderItems: [OrderItems];
  paymentMethod: string;
  shippingAddress1: string;
  shippingAddress2: string;
  status: 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  totalPrice: number;
  userData: {
    email: string;
    name: string;
    phone: string;
    phone2: string;
    surname: string;
  };
  zip: string;
}
