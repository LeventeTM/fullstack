export interface OrderItem {
  name: string;
  image: string;
  pivot: {
    quantity: number;
    price: number;
  };
}

export interface UserOrder {
  id: number;
  status: string;
  total_price: number;
  created_at: string;
  items: OrderItem[];
}
