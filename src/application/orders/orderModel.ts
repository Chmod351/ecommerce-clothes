import { IOrder } from './orderTypes';
import mongoose from 'mongoose';

const OrderSchema = new mongoose.Schema({
  commentaries: {
    required: false,
    type: String,
  },

  deliveryMode: {
    enum: ['PickUp', 'Standard', 'Express_CABA', 'Express_GBA'],
    required: [true, 'This field is required'],
    type: String,
  },
  orderItems: [
    {
      _id: {
        ref: 'Product',
        required: true,
        type: mongoose.Types.ObjectId,
      },
      color: {
        required: [true, 'This field is required'],
        type: String,
      },

      productPrice: {
        required: true,
        type: Number,
      },
      quantity: {
        min: [1, 'The quantity cannot be less than 1'],
        required: true,
        type: Number,
      },
      size: {
        required: [true, 'The size field is required'],
        type: String,
      },
    },
  ],
  paymentId: {
    required: false,
    type: String,
  },
  paymentMethod: {
    enum: ['Mercado Pago', 'Transferencia'],
    required: [true, 'This field is required'],
    type: String,
  },
  paymentStatus: {
    default: 'Pending',
    enum: ['Pending', 'Failed', 'Success'],
    type: String,
  },
  shippingAddress1: {
    required: [true, 'shippingAddress1 is required'],
    type: String,
  },
  shippingAddress2: {
    required: false,
    type: String,
  },
  status: {
    default: 'Pending',
    enum: ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled'],
    type: String,
  },
  totalPrice: {
    require: [true, 'totalPrice is required'],
    type: Number,
  },
  userData: {
    city: {
      required: [true, 'city is required'],
      type: String,
    },
    country: {
      required: [true, 'country is required'],
      type: String,
    },
    dateOrdered: {
      default: Date.now,
      type: Date,
    },
    email: {
      required: [true, 'email is required'],
      type: String,
    },
    floor: {
      required: false,
      type: String,
    },
    name: {
      required: [true, 'name is required'],
      type: String,
    },
    phone: {
      required: false,
      type: String,
    },
    phone2: {
      required: false,
      type: String,
    },
    state: {
      required: [true, 'state is required'],
      type: String,
    },
    surname: {
      required: [true, 'surname is required'],
      type: String,
    },
    userIdCard: {
      required: [true, 'userIdCard is required'],
      type: String,
    },
    zip: { required: true, type: String },
  },
});
OrderSchema.index({ paymentStatus: 1, status: 1 });

const Order = mongoose.model<IOrder>('Order', OrderSchema);
export default Order;
