import { IProduct } from './productTypes';
import dictionary from '../../config/dictionary';
import mongoose from 'mongoose';

const ProductSchema = new mongoose.Schema<IProduct>(
  {
    category: {
      required: [true, dictionary.thisFieldIsRequired_en],
      type: String,
    },
    description_en: {
      maxLength: [500, 'Your description is too long, please only use 500 characters'],
      minlength: [100, 'Your description is too short, please use at least 100 characters'],
      required: [true, dictionary.thisFieldIsRequired_en],
      type: String,
    },
    description_es: {
      maxLength: [500, 'Your description is too long, please only use 500 characters'],
      minlength: [100, 'Your description is too short, please use at least 100 characters'],
      required: [true, dictionary.thisFieldIsRequired_es],
      type: String,
    },

    image_url: {
      required: [true, 'The image_url is required'],
      type: [String],
    },
    name_en: {
      maxLength: [50, 'The name max length must be 50 characters'],
      minlength: [10, 'The name min length should be at least 10 characters'],
      required: [true, dictionary.thisFieldIsRequired_en],
      type: String,
    },
    name_es: {
      maxLength: [50, 'The name max length must be 50 characters'],
      minlength: [10, 'The name min length should be at least 10 characters'],
      required: [true, dictionary.thisFieldIsRequired_es],
      type: String,
    },

    price_en: {
      min: [1, 'The price cannot be less than 1'],
      required: [true, dictionary.thisFieldIsRequired_en],
      type: Number,
    },
    price_es: {
      min: [1, 'The price cannot be less than 1'],
      required: [true, dictionary.thisFieldIsRequired_es],
      type: Number,
    },
    sale: {
      quantity: {
        default: 0,
        type: Number,
      },
      status: {
        default: false,
        type: Boolean,
      },
      until: {
        default: Date.now,
        type: Date,
      },
    },
    seasson: {
      required: [true, dictionary.thisFieldIsRequired_en],
      type: String,
    },
    stock: [
      {
        color: {
          required: true,
          type: [String],
        },
        provider: {
          required: false,
          type: String,
        },
        providerCost: {
          required: false,
          type: Number,
        },
        quantity: {
          min: [0, 'The stock cannot be less than 0'],
          required: true,
          type: Number,
        },
        size: {
          enum: [
            'XS',
            'S',
            'M',
            'L',
            'XL',
            'XXL',
            'XXXL',
            'XXXXL',
            '25',
            '26',
            '27',
            '28',
            '29',
            '30',
            '31',
            '32',
            '33',
            '34',
            '35',
            '36',
            '37',
            '38',
            '39',
            '40',
            '41',
            '42',
            '43',
            '44',
            '45',
            '46',
            '47',
            '48',
          ],
          required: true,
          type: [String],
        },
      },
    ],

    weight: {
      required: [true, dictionary.thisFieldIsRequired_en],
      type: Number,
    },
  },
  { timestamps: true },
);

const Product = mongoose.model<IProduct>('Product', ProductSchema);

export default Product;
