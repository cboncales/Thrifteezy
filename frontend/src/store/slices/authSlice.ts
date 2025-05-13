import { createSlice, createAsyncThunk } from "@reduxjs/toolkit";
import axios from "axios";
import type { AuthState, User } from "../../types";

const API_URL = "http://localhost:3000/api";

interface LoginCredentials {
  email: string;
  password: string;
}

interface RegisterData extends LoginCredentials {
  name: string;
}

interface AuthResponse {
  user: User;
  token: string;
}

const initialState: AuthState = {
  user: null,
  token: localStorage.getItem("token"),
  isLoading: false,
  error: null,
};

// Set auth token in axios headers
const setAuthToken = (token: string | null) => {
  if (token) {
    axios.defaults.headers.common["Authorization"] = `Bearer ${token}`;
    localStorage.setItem("token", token);
  } else {
    delete axios.defaults.headers.common["Authorization"];
    localStorage.removeItem("token");
  }
};

// Initialize auth token from localStorage
if (initialState.token) {
  setAuthToken(initialState.token);
}

export const login = createAsyncThunk<AuthResponse, LoginCredentials>(
  "auth/login",
  async (credentials, { rejectWithValue }) => {
    try {
      const response = await axios.post<AuthResponse>(
        `${API_URL}/auth/login`,
        credentials
      );
      const { token, user } = response.data;
      setAuthToken(token);
      return { token, user };
    } catch (error: any) {
      return rejectWithValue(error.response?.data?.error || "Login failed");
    }
  }
);

export const register = createAsyncThunk<AuthResponse, RegisterData>(
  "auth/register",
  async (data, { rejectWithValue }) => {
    try {
      const response = await axios.post<AuthResponse>(
        `${API_URL}/auth/register`,
        data
      );
      const { token, user } = response.data;
      setAuthToken(token);
      return { token, user };
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || "Registration failed"
      );
    }
  }
);

export const logout = createAsyncThunk("auth/logout", async () => {
  setAuthToken(null);
});

export const getCurrentUser = createAsyncThunk<User>(
  "auth/getCurrentUser",
  async (_, { rejectWithValue, getState }) => {
    try {
      const { auth } = getState() as { auth: AuthState };
      const response = await axios.get<User>(`${API_URL}/auth/me`, {
        headers: { Authorization: `Bearer ${auth.token}` },
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.error || "Failed to get user data"
      );
    }
  }
);

// Add admin actions
export const fetchAllUsers = createAsyncThunk(
  "auth/fetchAllUsers",
  async (_, { rejectWithValue }) => {
    try {
      const response = await axios.get<User[]>("/api/users");
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to fetch users"
      );
    }
  }
);

export const updateUserRole = createAsyncThunk(
  "auth/updateUserRole",
  async (
    { userId, role }: { userId: string; role: "USER" | "ADMIN" },
    { rejectWithValue }
  ) => {
    try {
      const response = await axios.patch<User>(`/api/users/${userId}/role`, {
        role,
      });
      return response.data;
    } catch (error: any) {
      return rejectWithValue(
        error.response?.data?.message || "Failed to update user role"
      );
    }
  }
);

const authSlice = createSlice({
  name: "auth",
  initialState,
  reducers: {
    clearError: (state) => {
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Login
      .addCase(login.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(login.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(login.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Register
      .addCase(register.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(register.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload.user;
        state.token = action.payload.token;
      })
      .addCase(register.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Logout
      .addCase(logout.fulfilled, (state) => {
        state.user = null;
        state.token = null;
      })
      // Get Current User
      .addCase(getCurrentUser.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getCurrentUser.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(getCurrentUser.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
        state.user = null;
        state.token = null;
        localStorage.removeItem("token");
      })
      // Fetch All Users
      .addCase(fetchAllUsers.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(fetchAllUsers.fulfilled, (state, action) => {
        state.isLoading = false;
        state.users = action.payload;
      })
      .addCase(fetchAllUsers.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Update User Role
      .addCase(updateUserRole.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(updateUserRole.fulfilled, (state, action) => {
        state.isLoading = false;
        state.user = action.payload;
      })
      .addCase(updateUserRole.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const { clearError } = authSlice.actions;
export default authSlice.reducer;
