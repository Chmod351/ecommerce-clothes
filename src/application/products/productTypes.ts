import mongoose from 'mongoose';

export interface IProduct extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  name_es: string;
  name_en: string;
  sale: {
    status: boolean;
    quantity: number;
    until: Date;
  };
  description_es: string;
  description_en: string;
  image_url: [string];
  price_es: number;
  price_en: number;
  category: string;
  seasson: string;
  stock: [
    {
      color: [string];
      provider: string;
      providerCost: number;
      quantity: number;
      size: [
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
      ];
    },
  ];
  weight: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IProductBody {
  name_es: string;
  name_en: string;
  description_es: string;
  description_en: string;
  image_url: [string];
  price_es: number;
  price_en: number;
  category: string;
  seasson: string;
  weight: number;
  stock: [
    {
      color: [string];
      provider: string;
      providerCost: number;
      quantity: number;
      size: [
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
      ];
    },
  ];
}
