import { IProduct, IProductBody } from './productTypes';
import { NextFunction, Request, Response } from 'express';
import dictionary from '../../config/dictionary';
import mongoose from 'mongoose';
import productService from './productServices';

class ProductController {
  async findAll(req: Request, res: Response, next: NextFunction) {
    const page: number | undefined = parseInt(req.query.page as string) || 1;
    try {
      const products: IProduct[] = await productService.findAll(page);
      res.status(200).json(products);
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
      const page: number | undefined = parseInt(req.query.page as string) || 1,
        products: IProduct[] = await productService.findByQuery(query, page);
      res.status(200).json(products);
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
