import { IProduct, IProductBody } from '../products/productTypes';

import genericRepository from '../../repositories/genericRepository';
import mongoose from 'mongoose';

const { productRepository } = genericRepository;

class ProductServices {
  async findAll(page: number) {
    return await productRepository.findAll(page);
  }
  async findByQuery(query: string, page: number) {
    const searchRegex = new RegExp(query, 'i');
    const q: object = {
      $or: [
        { name_es: searchRegex },
        { name_en: searchRegex },
        { description_es: searchRegex },
        { description_en: searchRegex },
        { category: searchRegex },
        { seasson: searchRegex },

        // otros campos que quieras incluir en la búsqueda
      ],
    };
    return await productRepository.findByQuery(q, page);
  }
  async findById(id: string | mongoose.Types.ObjectId) {
    return await productRepository.findById(id);
  }
  async createProduct(body: IProductBody): Promise<IProduct> {
    return await productRepository.create(body as IProduct);
  }
  async updateProduct(id: string, product: object) {
    return await productRepository.update(id, product);
  }
  async deleteProduct(id: string | mongoose.Types.ObjectId) {
    return await productRepository.delete(id);
  }
}

const productService = new ProductServices();

export default productService;
