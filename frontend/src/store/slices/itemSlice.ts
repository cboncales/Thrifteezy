import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import type { RootState } from "../index";

const API_URL = "http://localhost:5000/api";

export interface Item {
  id: string;
  name: string;
  description: string;
  price: number;
  category: string;
  size: string;
  condition: "NEW" | "LIKE_NEW" | "GOOD" | "FAIR" | "POOR";
  imageUrl: string;
  sellerId: string;
  sellerName: string;
  createdAt: string;
  updatedAt: string;
}

export interface ItemFilters {
  search?: string;
  category?: string;
  condition?: string;
  minPrice?: number;
  maxPrice?: number;
  sortBy?: "price_asc" | "price_desc" | "newest" | "oldest";
}

interface ItemsResponse {
  items: Item[];
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

interface ItemsState {
  items: Item[];
  currentItem: Item | null;
  categories: string[];
  filters: ItemFilters;
  isLoading: boolean;
  error: string | null;
  pagination: {
    total: number;
    page: number;
    limit: number;
    pages: number;
  };
}

const initialState: ItemsState = {
  items: [],
  currentItem: null,
  categories: [],
  filters: {},
  isLoading: false,
  error: null,
  pagination: {
    total: 0,
    page: 1,
    limit: 10,
    pages: 0,
  },
};

export const fetchItems = createAsyncThunk(
  "items/fetchItems",
  async (filters: ItemFilters, { rejectWithValue }) => {
    try {
      const params = new URLSearchParams();
      if (filters.search) params.append("search", filters.search);
      if (filters.category) params.append("category", filters.category);
      if (filters.condition) params.append("condition", filters.condition);
      if (filters.minPrice)
        params.append("minPrice", filters.minPrice.toString());
      if (filters.maxPrice)
        params.append("maxPrice", filters.maxPrice.toString());
      if (filters.sortBy) params.append("sortBy", filters.sortBy);

      const response = await axios.get<ItemsResponse>(
        `${API_URL}/items?${params.toString()}`
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch items"
      );
    }
  }
);

export const fetchItemById = createAsyncThunk(
  "items/fetchItemById",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axios.get<Item>(`${API_URL}/items/${id}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch item"
      );
    }
  }
);

export const fetchCategories = createAsyncThunk(
  "items/fetchCategories",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get<string[]>(`${API_URL}/items/categories`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch categories"
      );
    }
  }
);

export const createItem = createAsyncThunk(
  "items/createItem",
  async (data: FormData, { rejectWithValue }) => {
    try {
      const response = await axios.post<Item>(`${API_URL}/items`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create item"
      );
    }
  }
);

export const updateItem = createAsyncThunk(
  "items/updateItem",
  async ({ id, data }: { id: string; data: FormData }, { rejectWithValue }) => {
    try {
      const response = await axios.patch<Item>(`${API_URL}/items/${id}`, data, {
        headers: {
          "Content-Type": "multipart/form-data",
        },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update item"
      );
    }
  }
);

export const deleteItem = createAsyncThunk(
  "items/deleteItem",
  async (id: string, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/items/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete item"
      );
    }
  }
);

const itemsSlice = createSlice({
  name: "items",
  initialState,
  reducers: {
    setFilters: (state, action) => {
      state.filters = { ...state.filters, ...action.payload };
    },
    clearFilters: (state) => {
      state.filters = {};
    },
    clearCurrentItem: (state) => {
      state.currentItem = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Items
      .addCase(fetchItems.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchItems.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = action.payload.items;
        state.pagination = action.payload.pagination;
      })
      .addCase(fetchItems.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch Item by ID
      .addCase(fetchItemById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchItemById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentItem = action.payload;
      })
      .addCase(fetchItemById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch Categories
      .addCase(fetchCategories.fulfilled, (state, action) => {
        state.categories = action.payload;
      })
      // Create Item
      .addCase(createItem.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createItem.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items.unshift(action.payload);
      })
      .addCase(createItem.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Update Item
      .addCase(updateItem.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateItem.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentItem = action.payload;
        const index = state.items.findIndex(
          (item) => item.id === action.payload.id
        );
        if (index !== -1) {
          state.items[index] = action.payload;
        }
      })
      .addCase(updateItem.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Delete Item
      .addCase(deleteItem.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteItem.fulfilled, (state, action) => {
        state.isLoading = false;
        state.items = state.items.filter((item) => item.id !== action.payload);
        if (state.currentItem?.id === action.payload) {
          state.currentItem = null;
        }
      })
      .addCase(deleteItem.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { setFilters, clearFilters, clearCurrentItem, clearError } =
  itemsSlice.actions;

export const selectItems = (state: RootState) => state.items.items;
export const selectCurrentItem = (state: RootState) => state.items.currentItem;
export const selectCategories = (state: RootState) => state.items.categories;
export const selectFilters = (state: RootState) => state.items.filters;
export const selectItemsLoading = (state: RootState) => state.items.isLoading;
export const selectItemsError = (state: RootState) => state.items.error;

export default itemsSlice.reducer;
