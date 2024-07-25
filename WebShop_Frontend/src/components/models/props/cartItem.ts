export interface CartItem {
  id: number;
  name: string;
  image: string | null;
  description: string;
  price: number;
  quantity: number;
}