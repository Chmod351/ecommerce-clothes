import mongoose from 'mongoose';

export interface DeleteResult {
  deletedCount: number;
}

export interface IRepository<T> {
  findAll(page: number): Promise<T[]>;
  findByQuery(query: object, page: number): Promise<T[]>;
  findById(id: mongoose.Types.ObjectId | string): Promise<T | null>;
  create(item: T): Promise<T>;
  // eslint-disable-next-line
  update(id: mongoose.Types.ObjectId | string, item: any): Promise<T | null>;
  delete(id: mongoose.Types.ObjectId | string): Promise<DeleteResult>;
}
