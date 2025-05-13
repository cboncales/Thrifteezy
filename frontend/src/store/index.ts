import { configureStore } from "@reduxjs/toolkit";
import authReducer from "./slices/authSlice";
import itemReducer from "./slices/itemSlice";
import ordersReducer from "./slices/ordersSlice";
import wishlistsReducer from "./slices/wishlistsSlice";

export const store = configureStore({
  reducer: {
    auth: authReducer,
    items: itemReducer,
    orders: ordersReducer,
    wishlists: wishlistsReducer,
  },
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
