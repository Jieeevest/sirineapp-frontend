/* eslint-disable @typescript-eslint/no-explicit-any */
// services/api.ts
import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";
import { Role } from "./api";

interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  data: {
    token: string;
    id: number;
    name: string;
    email: string;
    role: Role;
  };
}

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_API_URL}/api`,
    // Add token to the request headers if available
    // prepareHeaders: (headers) => {
    //   const token = localStorage.getItem("accessToken");
    //   if (token) {
    //     headers.set("Authorization", Bearer ${token});
    //   }
    //   return headers;
    // },
  }),
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: "/auth", // Sesuaikan dengan endpoint login Anda
        method: "POST",
        body: credentials,
      }),
    }),
    register: builder.mutation<any, any>({
      query: (credentials) => ({
        url: "/auth/register",
        method: "POST",
        body: credentials,
      }),
    }),
    forgotPassword: builder.mutation<any, any>({
      query: (credentials) => ({
        url: "/auth/forgot-password",
        method: "POST",
        body: credentials,
      }),
    }),
    resetPassword: builder.mutation<any, any>({
      query: (credentials) => ({
        url: "/auth/reset-password",
        method: "POST",
        body: credentials,
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useRegisterMutation,
  useForgotPasswordMutation,
  useResetPasswordMutation,
} = authApi;
