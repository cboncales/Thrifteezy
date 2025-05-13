import { configureStore } from "@reduxjs/toolkit";
import type { TypedUseSelectorHook } from "react-redux";
import { useDispatch, useSelector } from "react-redux";
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

// Use throughout your app instead of plain `useDispatch` and `useSelector`
export const useAppDispatch: () => AppDispatch = useDispatch;
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
