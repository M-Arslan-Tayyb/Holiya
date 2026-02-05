import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "@/services/features/auth/api";
import { chatApi } from "@/services/features/chat/api"; // adjust path as needed
import authSlice from "@/services/slices/authSlice";

export const store = configureStore({
  reducer: {
    auth: authSlice,
    [authApi.reducerPath]: authApi.reducer,
    [chatApi.reducerPath]: chatApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(authApi.middleware)
      .concat(chatApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
