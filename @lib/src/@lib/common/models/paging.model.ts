import { IPaging } from '../interfaces';

export class PagingModel<T> implements IPaging<T> {
  total: number;
  page: number;
  pages: number;
  size: number;
  title: string;
  list: T[];
  constructor(
    total?: number,
    page?: number,
    pages?: number,
    size?: number
  ) {
    this.page = page || 0;
    this.pages = pages || 0;
    this.size = size || 0;
    this.total = total || 0;
    this.title = '';
    this.list = [];
  }
}

