export interface Item {
  id: string;
  name: string;
  description: string;
  price: number;
  imageUrl: string;
  condition: "NEW" | "LIKE_NEW" | "GOOD" | "FAIR" | "POOR";
  category: string;
  sellerId: string;
  createdAt: string;
  updatedAt: string;
}

export interface ItemFilters {
  category?: string;
  condition?: Item["condition"];
  minPrice?: number;
  maxPrice?: number;
  search?: string;
}

export interface ItemPagination {
  page: number;
  limit: number;
  total: number;
  totalPages: number;
}
