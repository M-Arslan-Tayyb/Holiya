import { configureStore } from "@reduxjs/toolkit";
import { authApi } from "@/services/features/auth/api";
import { chatApi } from "@/services/features/chat/api";
import authSlice from "@/services/slices/authSlice";
import { dashboardApi } from "@/services/features/dashboard/api";

export const store = configureStore({
  reducer: {
    auth: authSlice,
    [authApi.reducerPath]: authApi.reducer,
    [chatApi.reducerPath]: chatApi.reducer,
    [dashboardApi.reducerPath]: dashboardApi.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware()
      .concat(authApi.middleware)
      .concat(chatApi.middleware)
      .concat(dashboardApi.middleware),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
