import mongoose from 'mongoose';

export interface DeleteResult {
  deletedCount: number;
}

export interface IRepository<T> {
  findAll(page: number): Promise<{ data: T[]; totalItems: number; totalPages: number }>;
  findByQuery(query: object, page: number): Promise<{ data: T[]; totalItems: number; totalPages: number }>;
  findById(id: mongoose.Types.ObjectId | string): Promise<T | null>;
  create(item: T): Promise<T>;
  // eslint-disable-next-line
  update(id: mongoose.Types.ObjectId | string, item: any): Promise<T | null>;
  delete(id: mongoose.Types.ObjectId | string): Promise<DeleteResult>;
}
