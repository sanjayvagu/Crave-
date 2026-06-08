import { Restaurant, MenuItem } from "./types";

export const RESTAURANTS: Restaurant[] = [
  {
    id: "r1",
    name: "Truffles & Co.",
    rating: 4.8,
    reviewCount: 1240,
    deliveryTime: "30-35 mins",
    tags: ["Burgers", "American", "Desserts"],
    image: "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=80",
    offers: "50% OFF up to $10",
  },
  {
    id: "r2",
    name: "Sushi Samba",
    rating: 4.9,
    reviewCount: 890,
    deliveryTime: "40-45 mins",
    tags: ["Japanese", "Sushi", "Asian"],
    image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=800&q=80",
    offers: "Flat 20% OFF",
  },
  {
    id: "r3",
    name: "Napoli Pizzeria",
    rating: 4.6,
    reviewCount: 3200,
    deliveryTime: "25-30 mins",
    tags: ["Italian", "Pizzas", "Beverages"],
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "r4",
    name: "Spice Symphony",
    rating: 4.4,
    reviewCount: 450,
    deliveryTime: "35-40 mins",
    tags: ["Indian", "Curries", "Biryani"],
    image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=800&q=80",
  }
];

export const MENU_ITEMS: MenuItem[] = [
  // Truffles & Co.
  {
    id: "m1",
    restaurantId: "r1",
    name: "Classic Smash Burger",
    description: "Double beef patty, aged cheddar, caramelized onions, house sauce on brioche.",
    price: 14.50,
    image: "https://images.unsplash.com/photo-1568901346375-23c9450c58cd?auto=format&fit=crop&w=400&q=80",
    isVeg: false,
    category: "Main Course",
  },
  {
    id: "m2",
    restaurantId: "r1",
    name: "Truffle Fries",
    description: "Crispy skin-on fries tossed in white truffle oil and parmesan.",
    price: 6.00,
    image: "https://images.unsplash.com/photo-1576107232684-1279f39085ec?auto=format&fit=crop&w=400&q=80",
    isVeg: true,
    category: "Recommended",
  },
  {
    id: "m3",
    restaurantId: "r1",
    name: "Oreo Shake",
    description: "Thick hand-spun milkshake with crushed Oreos and whipped cream.",
    price: 7.50,
    image: "https://images.unsplash.com/photo-1572490122747-3968b75cc699?auto=format&fit=crop&w=400&q=80",
    isVeg: true,
    category: "Beverages",
  },
  
  // Sushi Samba
  {
    id: "m4",
    restaurantId: "r2",
    name: "Spicy Tuna Roll",
    description: "Fresh yellowfin tuna, spicy mayo, cucumber, topped with sesame.",
    price: 18.00,
    image: "https://images.unsplash.com/photo-1615361200141-f45040f367be?auto=format&fit=crop&w=400&q=80",
    isVeg: false,
    category: "Recommended",
  },
  {
    id: "m5",
    restaurantId: "r2",
    name: "Dragon Roll",
    description: "Eel, asparagus, topped with avocado and sweet eel sauce.",
    price: 22.00,
    image: "https://images.unsplash.com/photo-1553621042-f6e147245754?auto=format&fit=crop&w=400&q=80",
    isVeg: false,
    category: "Main Course",
  },

  // Napoli Pizzeria
  {
    id: "m6",
    restaurantId: "r3",
    name: "Margherita Pizza",
    description: "San Marzano tomato sauce, fresh mozzarella, basil, extra virgin olive oil.",
    price: 16.00,
    image: "https://images.unsplash.com/photo-1574071318508-1cdbab80d002?auto=format&fit=crop&w=400&q=80",
    isVeg: true,
    category: "Main Course",
  },
  {
    id: "m7",
    restaurantId: "r3",
    name: "Pepperoni Pizza",
    description: "Classic cheese pizza topped with premium cured pepperoni.",
    price: 19.00,
    image: "https://images.unsplash.com/photo-1628840042765-356cda07504e?auto=format&fit=crop&w=400&q=80",
    isVeg: false,
    category: "Recommended",
  }
];

import { Order } from "./types";

export const MOCK_ORDERS: Order[] = [
  {
    id: "ORD-ACTIVE1",
    restaurantName: "Truffles & Co.",
    date: "Today, 01:00 PM",
    total: 25.50,
    items: [
      { name: "Classic Smash Burger", quantity: 1 },
      { name: "Oreo Shake", quantity: 1 }
    ],
    status: "Preparing"
  },
  {
    id: "ORD-1A2B3C",
    restaurantName: "Truffles & Co.",
    date: "12 Oct 2026, 08:30 PM",
    total: 31.99,
    items: [
      { name: "Classic Smash Burger", quantity: 2 },
      { name: "Truffle Fries", quantity: 1 }
    ],
    status: "Delivered"
  },
  {
    id: "ORD-9X8Y7Z",
    restaurantName: "Sushi Samba",
    date: "05 Oct 2026, 01:15 PM",
    total: 45.50,
    items: [
      { name: "Spicy Tuna Roll", quantity: 1 },
      { name: "Dragon Roll", quantity: 1 }
    ],
    status: "Delivered"
  },
  {
    id: "ORD-5P6Q7R",
    restaurantName: "Napoli Pizzeria",
    date: "28 Sep 2026, 07:45 PM",
    total: 19.00,
    items: [
      { name: "Pepperoni Pizza", quantity: 1 }
    ],
    status: "Cancelled"
  }
];
