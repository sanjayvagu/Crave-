import { Restaurant, MenuItem, Order, City } from "./types";

export const CITIES: City[] = [
  { id: "c1", name: "Yeleswaram", isServiceable: true, pinCodes: ["533429"] },
  { id: "c2", name: "Prathipadu", isServiceable: true, pinCodes: ["533432"] },
  { id: "c4", name: "Pune", isServiceable: false, pinCodes: ["411001"] },
  { id: "c5", name: "Jaipur", isServiceable: false, pinCodes: ["302001"] }
];

export const RESTAURANTS: Restaurant[] = [
  {
    id: "r1",
    cityId: "c1",
    name: "Truffles & Co. (Yeleswaram)",
    rating: 4.8,
    reviewCount: 1240,
    deliveryTime: "30-35 mins",
    tags: ["Burgers", "American", "Desserts"],
    image: "https://images.unsplash.com/photo-1550547660-d9450f859349?auto=format&fit=crop&w=800&q=80",
    offers: "50% OFF up to ₹10",
  },
  {
    id: "r2",
    cityId: "c2",
    name: "Sushi Samba (Prathipadu)",
    rating: 4.9,
    reviewCount: 890,
    deliveryTime: "40-45 mins",
    tags: ["Japanese", "Sushi", "Asian"],
    image: "https://images.unsplash.com/photo-1579871494447-9811cf80d66c?auto=format&fit=crop&w=800&q=80",
    offers: "Flat 20% OFF",
  },
  {
    id: "r3",
    cityId: "c2",
    name: "Napoli Pizzeria (Prathipadu)",
    rating: 4.6,
    reviewCount: 3200,
    deliveryTime: "25-30 mins",
    tags: ["Italian", "Pizzas", "Beverages"],
    image: "https://images.unsplash.com/photo-1565299624946-b28f40a0ae38?auto=format&fit=crop&w=800&q=80",
  },
  {
    id: "r4",
    cityId: "c1",
    name: "Spice Symphony (Yeleswaram)",
    rating: 4.4,
    reviewCount: 450,
    deliveryTime: "35-40 mins",
    tags: ["Indian", "Curries", "Biryani"],
    image: "https://images.unsplash.com/photo-1585937421612-70a008356fbe?auto=format&fit=crop&w=800&q=80",
  }
];

export const GROCERY_ITEMS: MenuItem[] = [
  { id: "g1", restaurantId: "instamart", name: "Farm Fresh Tomatoes", price: 40, description: "500g", isVeg: true, category: "Fresh Veggies", image: "https://images.unsplash.com/photo-1592924357228-91a4daadcfea?auto=format&fit=crop&w=1200&q=100" },
  { id: "g2", restaurantId: "instamart", name: "Amul Taaza Milk", price: 34, description: "500ml pouch", isVeg: true, category: "Dairy & Bread", image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=1200&q=100" },
  { id: "g3", restaurantId: "instamart", name: "Lay's Magic Masala", price: 20, description: "50g pack", isVeg: true, category: "Snacks", image: "https://images.unsplash.com/photo-1566478989037-eade3f7e540b?auto=format&fit=crop&w=1200&q=100" },
  { id: "g4", restaurantId: "instamart", name: "Aashirvaad Atta", price: 245, description: "5kg bag", isVeg: true, category: "Snacks", image: "https://images.unsplash.com/photo-1509440159596-0249088772ff?auto=format&fit=crop&w=1200&q=100" },
  { id: "g5", restaurantId: "instamart", name: "Dove Soap Bar", price: 55, description: "100g", isVeg: true, category: "Care", image: "https://images.unsplash.com/photo-1600857544200-b2f666a9a2ec?auto=format&fit=crop&w=1200&q=100" },
];

export const RECOMMENDED_GROCERY_ITEMS: MenuItem[] = [
  { id: "g6", restaurantId: "instamart", name: "Maggi 2-Minute Noodles", price: 14, description: "70g", isVeg: true, category: "Snacks", image: "https://images.unsplash.com/photo-1612929633738-8fe44f7ec841?auto=format&fit=crop&w=1200&q=100" },
  { id: "g7", restaurantId: "instamart", name: "Surf Excel Easy Wash", price: 110, description: "1kg", isVeg: true, category: "Cleaning", image: "https://images.unsplash.com/photo-1581646271587-1dbdd986d7e0?auto=format&fit=crop&w=1200&q=100" },
  { id: "g8", restaurantId: "instamart", name: "Fortune Sunlite Oil", price: 140, description: "1L pouch", isVeg: true, category: "Snacks", image: "https://images.unsplash.com/photo-1474979266404-7eaacbcd87c5?auto=format&fit=crop&w=1200&q=100" },
  { id: "g9", restaurantId: "instamart", name: "Brooke Bond Red Label", price: 130, description: "250g", isVeg: true, category: "Drinks", image: "https://images.unsplash.com/photo-1597481499750-3e6b22637e12?auto=format&fit=crop&w=1200&q=100" },
  { id: "g10", restaurantId: "instamart", name: "Dettol Handwash", price: 99, description: "200ml", isVeg: true, category: "Care", image: "https://images.unsplash.com/photo-1584622650111-993a426fbf0a?auto=format&fit=crop&w=1200&q=100" },
];

export const PHARMACY_ITEMS: MenuItem[] = [
  { id: "p1", restaurantId: "instamart", name: "Dolo 650 Tablet", price: 30, description: "15 Tablets", isVeg: true, category: "Medicines", image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=1200&q=100" },
  { id: "p2", restaurantId: "instamart", name: "Vicks Vaporub", price: 145, description: "50g", isVeg: true, category: "First Aid", image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=1200&q=100" },
  { id: "p3", restaurantId: "instamart", name: "Honitus Cough Syrup", price: 110, description: "100ml", isVeg: true, category: "Medicines", image: "https://images.unsplash.com/photo-1628771065518-0d82f1938462?auto=format&fit=crop&w=1200&q=100" },
  { id: "p4", restaurantId: "instamart", name: "Revital H Capsules", price: 290, description: "30 Capsules", isVeg: true, category: "Vitamins", image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=1200&q=100" },
  { id: "p5", restaurantId: "instamart", name: "Band-Aid Washproof", price: 65, description: "Pack of 20", isVeg: true, category: "First Aid", image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=1200&q=100" },
];

export const RECOMMENDED_PHARMACY_ITEMS: MenuItem[] = [
  { id: "p6", restaurantId: "instamart", name: "Pudina Hara Pearls", price: 50, description: "Strip of 10", isVeg: true, category: "Medicines", image: "https://images.unsplash.com/photo-1584308666744-24d5c474f2ae?auto=format&fit=crop&w=1200&q=100" },
  { id: "p7", restaurantId: "instamart", name: "Himalaya Liv.52", price: 150, description: "100 Tablets", isVeg: true, category: "Vitamins", image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=1200&q=100" },
  { id: "p8", restaurantId: "instamart", name: "Volini Pain Relief Spray", price: 195, description: "60g", isVeg: true, category: "Health Care", image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=1200&q=100" },
  { id: "p9", restaurantId: "instamart", name: "Eno Regular Flexipack", price: 80, description: "6x5g sachets", isVeg: true, category: "Medicines", image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=1200&q=100" },
  { id: "p10", restaurantId: "instamart", name: "Detox Green Tea", price: 210, description: "25 Tea Bags", isVeg: true, category: "Health Care", image: "https://images.unsplash.com/photo-1550583724-b2692b85b150?auto=format&fit=crop&w=1200&q=100" },
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
    ingredients: ["Dual Premium Beef Patties", "Aged Sharp Cheddar", "Sweet Caramelized Onions", "Signature House Burger Sauce", "Toasted Brioche Bun", "Dill Pickles"],
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
    ingredients: ["Hand-cut Russet Potatoes", "Pure White Truffle Oil", "Grated Parmigiano-Reggiano", "Fresh Parsley Leaves", "Flaky Sea Salt"],
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
    ingredients: ["Creamy Vanilla Bean Ice Cream", "Cold Whole Milk", "Finely Crushed Oreo Cookies", "Sweetened Whipped Cream", "Dark Chocolate Fudge"],
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
    ingredients: ["Sashimi-Grade Yellowfin Tuna", "Sriracha-infused Kewpie Mayo", "Crisp English Cucumber", "Premium Vinegared Sushi Rice", "Toasted Nori Seaweed", "Black & White Sesame Seeds"],
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
    ingredients: ["Lightly Grilled BBQ Unagi (Eel)", "Fresh Thinly-Slices Avocado", "Blanched Tender Asparagus", "Vinegared Sushi Rice", "Toasted Nori Seaweed", "Sweet Soy reduction (Eel Sauce)", "Crunchy Tempura Flakes"],
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
    ingredients: ["Italian San Marzano Tomatoes", "Fresh Fior di Latte Mozzarella", "Fresh Sweet Basil Leaves", "Cold-Pressed Extra Virgin Olive Oil", "Artisanal Slow-Fermented Sourdough Crust"],
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
    ingredients: ["Neapolitan Base Tomato Sauce", "Premium Cured & Sliced Pepperoni", "Whole Milk Mozzarella", "Dried Wild Oregano", "Aromatic Extra Virgin Olive Oil", "Crispy Fermented Dough Crust"],
  }
];

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
