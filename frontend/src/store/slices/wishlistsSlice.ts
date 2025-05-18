import {
  createSlice,
  createAsyncThunk,
  createSelector,
} from "@reduxjs/toolkit";
import axios from "axios";
import type { RootState } from "../index";

// Define API URL
const API_URL = "http://localhost:5000/api";

export interface WishlistItem {
  id: string;
  name: string;
  price: number;
  imageUrl: string;
  description: string;
  createdAt: string;
}

export interface Wishlist {
  id: string;
  userId: string;
  name: string;
  items: WishlistItem[];
  isPublic: boolean;
  createdAt: string;
  updatedAt: string;
}

interface WishlistsState {
  wishlists: Wishlist[];
  currentWishlist: Wishlist | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: WishlistsState = {
  wishlists: [],
  currentWishlist: null,
  isLoading: false,
  error: null,
};

export const fetchWishlists = createAsyncThunk(
  "wishlists/fetchWishlists",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get<Wishlist[]>(`${API_URL}/wishlists`);
      // Ensure we return an array even if the API response structure changes
      return Array.isArray(response.data) ? response.data : [];
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch wishlists"
      );
    }
  }
);

export const fetchWishlistById = createAsyncThunk(
  "wishlists/fetchWishlistById",
  async (id: string, { rejectWithValue }) => {
    try {
      const response = await axios.get<Wishlist>(`${API_URL}/wishlists/${id}`);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch wishlist"
      );
    }
  }
);

export const fetchDefaultWishlist = createAsyncThunk(
  "wishlists/fetchDefaultWishlist",
  async (_, { dispatch, rejectWithValue }) => {
    try {
      // Get all wishlists for the user
      const response = await axios.get<Wishlist[]>(`${API_URL}/wishlists`);

      // Log for debugging
      console.log(
        "Fetched wishlists for default selection:",
        response.data?.length || 0
      );

      // If user has any wishlist, return the first one (primary wishlist)
      if (response.data && response.data.length > 0) {
        console.log("Using existing wishlist:", response.data[0].id);
        return response.data[0];
      }

      // If no wishlists exist, create exactly one default wishlist
      console.log("No wishlist found, creating default wishlist");
      const newWishlist = await dispatch(
        createWishlist({ name: "My Wishlist", isPublic: false })
      ).unwrap();

      console.log("Created new default wishlist:", newWishlist.id);
      return newWishlist;
    } catch (error: any) {
      console.error("Error fetching default wishlist:", error);
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch default wishlist"
      );
    }
  }
);

export const createWishlist = createAsyncThunk(
  "wishlists/createWishlist",
  async (data: { name: string; isPublic: boolean }, { rejectWithValue }) => {
    try {
      const response = await axios.post<Wishlist>(`${API_URL}/wishlists`, data);
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to create wishlist"
      );
    }
  }
);

export const addToWishlist = createAsyncThunk(
  "wishlists/addToWishlist",
  async (
    { wishlistId, itemId }: { wishlistId: string; itemId: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.post<Wishlist>(
        `${API_URL}/wishlists/${wishlistId}/items`,
        { itemId }
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to add item to wishlist"
      );
    }
  }
);

export const removeFromWishlist = createAsyncThunk(
  "wishlists/removeFromWishlist",
  async (
    { wishlistId, itemId }: { wishlistId: string; itemId: string },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.delete<Wishlist>(
        `${API_URL}/wishlists/${wishlistId}/items/${itemId}`
      );
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to remove item from wishlist"
      );
    }
  }
);

export const deleteWishlist = createAsyncThunk(
  "wishlists/deleteWishlist",
  async (id: string, { rejectWithValue }) => {
    try {
      await axios.delete(`${API_URL}/wishlists/${id}`);
      return id;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to delete wishlist"
      );
    }
  }
);

const wishlistsSlice = createSlice({
  name: "wishlists",
  initialState,
  reducers: {
    clearCurrentWishlist: (state) => {
      state.currentWishlist = null;
    },
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Fetch Wishlists
      .addCase(fetchWishlists.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchWishlists.fulfilled, (state, action) => {
        state.isLoading = false;
        state.wishlists = action.payload;
      })
      .addCase(fetchWishlists.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch Wishlist by ID
      .addCase(fetchWishlistById.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchWishlistById.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentWishlist = action.payload;
      })
      .addCase(fetchWishlistById.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Fetch Default Wishlist
      .addCase(fetchDefaultWishlist.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchDefaultWishlist.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentWishlist = action.payload;
        // Add to wishlists array if not already there
        if (!state.wishlists.some((w) => w.id === action.payload.id)) {
          state.wishlists.push(action.payload);
        }
      })
      .addCase(fetchDefaultWishlist.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Create Wishlist
      .addCase(createWishlist.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(createWishlist.fulfilled, (state, action) => {
        state.isLoading = false;
        state.wishlists.push(action.payload);
        state.currentWishlist = action.payload;
      })
      .addCase(createWishlist.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Add to Wishlist
      .addCase(addToWishlist.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(addToWishlist.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentWishlist = action.payload;
        const index = state.wishlists.findIndex(
          (w) => w.id === action.payload.id
        );
        if (index !== -1) {
          state.wishlists[index] = action.payload;
        }
      })
      .addCase(addToWishlist.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Remove from Wishlist
      .addCase(removeFromWishlist.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(removeFromWishlist.fulfilled, (state, action) => {
        state.isLoading = false;
        state.currentWishlist = action.payload;
        const index = state.wishlists.findIndex(
          (w) => w.id === action.payload.id
        );
        if (index !== -1) {
          state.wishlists[index] = action.payload;
        }
      })
      .addCase(removeFromWishlist.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Delete Wishlist
      .addCase(deleteWishlist.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(deleteWishlist.fulfilled, (state, action) => {
        state.isLoading = false;
        state.wishlists = state.wishlists.filter(
          (w) => w.id !== action.payload
        );
        if (state.currentWishlist?.id === action.payload) {
          state.currentWishlist = null;
        }
      })
      .addCase(deleteWishlist.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearCurrentWishlist, clearError } = wishlistsSlice.actions;

export const selectWishlists = (state: RootState) => state.wishlists.wishlists;
export const selectCurrentWishlist = (state: RootState) =>
  state.wishlists.currentWishlist;
export const selectWishlistsLoading = (state: RootState) =>
  state.wishlists.isLoading;
export const selectWishlistsError = (state: RootState) => state.wishlists.error;

// Helper selector to check if item is in wishlist
export const selectIsItemInWishlist = createSelector(
  [
    (state: RootState) => state.wishlists.currentWishlist,
    (_, itemId: string) => itemId,
  ],
  (wishlist, itemId) => {
    if (!wishlist || !wishlist.items) return false;
    return wishlist.items.some((item) => item.id === itemId);
  }
);

// Memoized selector to extract item ids from the current wishlist
export const selectWishlistItemIds = createSelector(
  [(state: RootState) => state.wishlists.currentWishlist],
  (wishlist) => {
    if (!wishlist || !wishlist.items) return [];
    return wishlist.items.map((item) => item.id);
  }
);

export default wishlistsSlice.reducer;
