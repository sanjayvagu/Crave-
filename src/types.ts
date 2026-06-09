export interface City {
  id: string;
  name: string;
  isServiceable: boolean;
  pinCodes: string[];
}

export interface Restaurant {
  id: string;
  cityId?: string;
  name: string;
  rating: number;
  reviewCount: number;
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
  ingredients?: string[];
}

export interface CartItem extends MenuItem {
  quantity: number;
  instructions?: string;
}

export interface Address {
  id: string;
  label: string;
  value: string;
}

export interface Order {
  id: string;
  restaurantName: string;
  date: string;
  total: number;
  items: { name: string; quantity: number }[];
  status:
    | "Delivered"
    | "Cancelled"
    | "Processing"
    | "Preparing"
    | "Out for Delivery";
}
