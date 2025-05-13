export interface User {
  id: string;
  name: string;
  email: string;
  role: "USER" | "ADMIN";
  createdAt: string;
}

export interface Item {
  id: string;
  title: string;
  description: string;
  price: number;
  size: string;
  condition: string;
  photoUrl: string;
  status: "available" | "reserved" | "sold";
  userId: string;
  user: User;
  createdAt: string;
  updatedAt: string;
}

export interface Order {
  id: string;
  userId: string;
  status: "pending" | "processing" | "completed" | "cancelled";
  total: number;
  items: OrderItem[];
  user: User;
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: string;
  orderId: string;
  itemId: string;
  quantity: number;
  price: number;
  item: Item;
}

export interface Wishlist {
  id: string;
  name: string;
  userId: string;
  items: WishlistItem[];
  createdAt: string;
  updatedAt: string;
}

export interface WishlistItem {
  id: string;
  wishlistId: string;
  itemId: string;
  item: Item;
  createdAt: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isLoading: boolean;
  error: string | null;
  users?: User[];
}

export interface ItemsState {
  items: Item[];
  selectedItem: Item | null;
  isLoading: boolean;
  error: string | null;
  filters: {
    search: string;
    minPrice: number | null;
    maxPrice: number | null;
    size: string | null;
    condition: string | null;
    status: string | null;
  };
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface OrdersState {
  orders: Order[];
  selectedOrder: Order | null;
  isLoading: boolean;
  error: string | null;
  filters: {
    status: string | null;
  };
  pagination: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}

export interface WishlistsState {
  wishlists: Wishlist[];
  selectedWishlist: Wishlist | null;
  isLoading: boolean;
  error: string | null;
}
