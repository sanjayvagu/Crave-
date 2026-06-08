export interface Restaurant {
  id: string;
  name: string;
  rating: number;
  deliveryTime: string;
  tags: string[];
  image: string;
  offers?: string;
}

export interface MenuItem {
  id: string;
  restaurantId: string;
  name: string;
  description: string;
  price: number;
  image: string;
  isVeg: boolean;
  category?: string;
}

export interface CartItem extends MenuItem {
  quantity: number;
}

export interface Order {
  id: string;
  restaurantName: string;
  date: string;
  total: number;
  items: { name: string; quantity: number }[];
  status: 'Delivered' | 'Cancelled' | 'Processing' | 'Preparing' | 'Out for Delivery';
}
