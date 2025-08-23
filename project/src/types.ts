export interface Product {
  id: string;
  name: string;
  price: number;
  image: string;
  category: string;
  location: string;
  directions: string;
  rating: number;
  reviews: number;
  inStock: boolean;
  tags: string[];
  nutritionInfo?: {
    calories: number;
    protein: number;
    fiber: number;
    sugar: number;
  };
  allergens?: string[];
  materials?: string[];
  description: string;
}

export interface ChatMessage {
  id: string;
  text: string;
  isUser: boolean;
  timestamp: Date;
  products?: Product[];
}

export interface WishlistItem {
  id: string;
  name: string;
  onlinePrice: number;
  storePrice: number;
  availability: 'online' | 'store' | 'both';
  rating: number;
  image: string;
}