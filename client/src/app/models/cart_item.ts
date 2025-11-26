import { Item } from './item';

export interface CartItem extends Item {
  quantity: number;
}
