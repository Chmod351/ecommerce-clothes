import mongoose from 'mongoose';

export interface IProduct extends mongoose.Document {
  _id: mongoose.Types.ObjectId;
  name_es: string;
  name_en: string;
  description_es: string;
  description_en: string;
  image_url: string;
  price_es: number;
  price_en: number;
  category: string;
  seasson: string;
  stock: number;
  createdAt?: Date;
  updatedAt?: Date;
}

export interface IProductBody {
  name_es: string;
  name_en: string;
  description_es: string;
  description_en: string;
  image_url: string;
  price_es: number;
  price_en: number;
  category: string;
  seasson: string;
  stock: number;
}
