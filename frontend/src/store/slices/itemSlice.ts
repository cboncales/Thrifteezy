import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import type { Item, ItemFilters, ItemPagination } from "../../types/item";

interface ItemState {
  items: Item[];
  loading: boolean;
  error: string | null;
  pagination: ItemPagination | null;
}

const initialState: ItemState = {
  items: [],
  loading: false,
  error: null,
  pagination: null,
};

interface FetchItemsParams {
  page: number;
  limit: number;
  category?: string;
  condition?: Item["condition"];
  minPrice?: number;
  maxPrice?: number;
  search?: string;
}

export const fetchItems = createAsyncThunk(
  "items/fetchItems",
  async (params: FetchItemsParams) => {
    const { page, limit, ...filters } = params;
    const queryParams = new URLSearchParams({
      page: page.toString(),
      limit: limit.toString(),
      ...Object.entries(filters).reduce((acc, [key, value]) => {
        if (value !== undefined) {
          acc[key] = value.toString();
        }
        return acc;
      }, {} as Record<string, string>),
    });

    const response = await axios.get(`/api/items?${queryParams.toString()}`);
    return response.data;
  }
);

const itemSlice = createSlice({
  name: "items",
  initialState,
  reducers: {},
  extraReducers: (builder) => {
    builder
      .addCase(fetchItems.pending, (state) => {
        state.loading = true;
        state.error = null;
      })
      .addCase(fetchItems.fulfilled, (state, action) => {
        state.loading = false;
        state.items = action.payload.items;
        state.pagination = {
          page: action.payload.page,
          limit: action.payload.limit,
          total: action.payload.total,
          totalPages: action.payload.totalPages,
        };
      })
      .addCase(fetchItems.rejected, (state, action) => {
        state.loading = false;
        state.error = action.error.message || "Failed to fetch items";
      });
  },
});

export default itemSlice.reducer;
