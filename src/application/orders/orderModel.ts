import { IOrder } from './orderTypes';
import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
  city: { required: true, type: String },
  country: { required: true, type: String },
  dateOrdered: { default: Date.now, type: Date },
  orderItems: [
    {
      productId: {
        ref: 'Product',
        required: true,
        type: mongoose.Types.ObjectId,
      },
      productPrice: { required: true, type: Number },
      quantity: { min: 1, required: true, type: Number },
    },
  ],
  paymentMethod: { required: true, type: String },
  paymentStatus: { default: 'Pending', enum: ['Pending', 'Failed', 'Success'], type: String },
  shippingAddress1: { required: true, type: String },
  shippingAddress2: { required: false, type: String },
  status: { default: 'Pending', enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'], type: String },
  totalPrice: { required: true, type: Number },
  userData: {
    email: { required: true, type: String },
    name: { required: true, type: String },
    phone: { required: true, type: String },
    phone2: { required: false, type: String },

    surname: { required: true, type: String },
  },
  zip: { required: true, type: String },
});

const Order = mongoose.model<IOrder>('Order', OrderSchema);
export default Order;
