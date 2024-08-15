import { IProduct, IProductBody } from './productTypes';
import { NextFunction, Request, Response } from 'express';
import dictionary from '../../config/dictionary';
import mongoose from 'mongoose';
import productService from './productServices';

class ProductController {
  async findAll(req: Request, res: Response, next: NextFunction) {
    const page: number | undefined = parseInt(req.query.page as string) || 1;
    try {
      const { data, totalItems, totalPages }: { data: IProduct[]; totalItems: number; totalPages: number } =
        await productService.findAll(page);
      const productsWithoutUnnecessaryInfo = data.map((product: IProduct) => {
        return {
          _id: product._id.toString(),
          category: product.category,
          description_en: product.description_en,
          description_es: product.description_es,
          image_url: product.image_url,
          name_en: product.name_en,
          name_es: product.name_es,
          price_en: product.price_en,
          price_es: product.price_es,
          seasson: product.seasson,
          weight: product.weight,
        };
      });
      res.status(200).json({ data: productsWithoutUnnecessaryInfo, totalItems, totalPages });
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  async findByQuery(req: Request, res: Response, next: NextFunction) {
    try {
      const query: string | undefined = req.query.query as string;
      if (!query) {
        return res.status(400).json({ error: dictionary.missingQueryParameter });
      }
      const page: number | undefined = parseInt(req.query.page as string) || 1;
      const { data, totalItems, totalPages }: { data: IProduct[]; totalItems: number; totalPages: number } =
        await productService.findByQuery(query, page);
      res.status(200).json({ data, totalItems, totalPages });
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  async findById(req: Request, res: Response, next: NextFunction) {
    const { id } = req.params;
    try {
      const product: IProduct | null = await productService.findById(id);
      res.status(200).json(product);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  async create(req: Request, res: Response, next: NextFunction) {
    console.log(req.sessionID, req);
    const {
      description_es,
      description_en,
      name_es,
      name_en,
      image_url,
      price_en,
      price_es,
      stock,
      category,
      seasson,
      weight,
    }: IProductBody = req.body;
    try {
      const createdProduct: IProduct = await productService.createProduct({
        category,
        description_en,
        description_es,
        image_url,
        name_en,
        name_es,
        price_en,
        price_es,
        seasson,
        stock,
        weight,
      });

      res.json(createdProduct);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  async update(req: Request, res: Response, next: NextFunction) {
    const {
      id,
      description_es,
      description_en,
      name_es,
      name_en,
      image_url,
      price_en,
      price_es,
      stock,
      category,
      seasson,
      weight,
    } = req.body;
    try {
      const updatedProduct: IProduct | null = await productService.updateProduct(id, {
        category,
        description_en,
        description_es,
        image_url,
        name_en,
        name_es,
        price_en,
        price_es,
        seasson,
        stock,

        weight,
      });
      res.status(200).json(updatedProduct);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }

  async delete(req: Request, res: Response, next: NextFunction) {
    const { id }: { id: mongoose.Types.ObjectId } = req.body;
    try {
      const deletedProduct = await productService.deleteProduct(id);
      res.status(200).json(deletedProduct);
    } catch (error) {
      console.log(error);
      next(error);
    }
  }
}

const productController = new ProductController();

export default productController;
