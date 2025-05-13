import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import type { RootState } from "../../store";

export interface OrderItem {
  id: string;
  name: string;
  price: number;
  quantity: number;
  imageUrl: string;
}

export interface Order {
  id: string;
  userId: string;
  items: OrderItem[];
  total: number;
  status: "PENDING" | "COMPLETED" | "CANCELLED";
  createdAt: string;
  updatedAt: string;
}

interface OrdersState {
  orders: Order[];
  currentOrder: Order | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: OrdersState = {
  orders: [],
  currentOrder: null,
  isLoading: false,
  error: null,
};

export const fetchOrders = createAsyncThunk(
  "orders/fetchOrders",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get<Order[]>("/api/orders");
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch orders"
      );
    }
  }
);

export const fetchOrderById = createAsyncThunk(
  "orders/fetchOrderById",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axios.get<Order>(`/api/orders/${id}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch order details"
      );
    }
  }
);

export const cancelOrder = createAsyncThunk(
  "orders/cancelOrder",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axios.patch<Order>(`/api/orders/${id}/cancel`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to cancel order"
      );
    }
  }
);

const ordersSlice = createSlice({
  name: "orders",
  initialState,
  reducers: {
    clearCurrentOrder: (state) => {
      state.currentOrder = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Orders
      .addCase(fetchOrders.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchOrders.fulfilled, (state, action) => {
        state.isLoading = false;
        state.orders = action.payload;
      })
      .addCase(fetchOrders.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch Order by ID
      .addCase(fetchOrderById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchOrderById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentOrder = action.payload;
      })
      .addCase(fetchOrderById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Cancel Order
      .addCase(cancelOrder.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(cancelOrder.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentOrder = action.payload;
        const index = state.orders.findIndex(
          (order) => order.id === action.payload.id
        );
        if (index !== -1) {
          state.orders[index] = action.payload;
        }
      })
      .addCase(cancelOrder.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearCurrentOrder, clearError } = ordersSlice.actions;

export const selectOrders = (state: RootState) => state.orders.orders;
export const selectCurrentOrder = (state: RootState) =>
  state.orders.currentOrder;
export const selectOrdersLoading = (state: RootState) => state.orders.isLoading;
export const selectOrdersError = (state: RootState) => state.orders.error;

export default ordersSlice.reducer;
