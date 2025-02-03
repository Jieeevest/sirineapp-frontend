// store.ts
import { configureStore } from "@reduxjs/toolkit";
import { api } from "./services/api"; // Import your RTK Query service
import { authApi } from "./services/authApi";

export const store = configureStore({
  reducer: {
    // Add RTK Query API reducer
    [authApi.reducerPath]: authApi.reducer,
    [api.reducerPath]: api.reducer,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware().concat(authApi.middleware, api.middleware), // Add the middleware needed for RTK Query
});

// Export types for TypeScript
export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;
