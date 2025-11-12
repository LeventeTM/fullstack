export interface Item {
  id: number;
  name: string;
  category: 'tejtermék' | 'gyümölcs' | 'zöldség' | 'pékáru' | 'hús' | string;
  price: number;
  stock: number;
  weight: number;
  description: string;
  image: string;
}
