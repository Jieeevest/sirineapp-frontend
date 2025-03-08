import { createApi, fetchBaseQuery } from "@reduxjs/toolkit/query/react";

// Tipe umum untuk API response
interface ApiResponse<T> {
  success: boolean;
  message: string;
  data: T;
}

// Tipe untuk Product
interface Product {
  id: number;
  name: string;
  description?: string;
  price: number;
  stock: number;
  image?: File | null;
  isPublic: boolean;
  categoryId: number;
  category: Category;
  createdAt: string;
  updatedAt: string;
}

// Tipe untuk Cart
interface Cart {
  id: number;
  userId: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

// Tipe untuk CartItem
interface CartItem {
  id: number;
  cartId: number;
  productId: number;
  quantity: number;
  createdAt: string;
  updatedAt: string;
}

// Tipe untuk Category
interface Category {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}

// Tipe untuk Order
interface Order {
  id: number;
  userId: number;
  totalAmount: number;
  status: string;
  createdAt: string;
  updatedAt: string;
}

// Tipe untuk User
interface User {
  id: number;
  name: string;
  email: string;
  roleId: number;
  roles: Role;
  createdAt: string;
  updatedAt: string;
}

// Tipe untuk Role
export interface Role {
  id: number;
  name: string;
  createdAt: string;
  updatedAt: string;
}

// Tipe untuk ActivityLog
interface ActivityLog {
  id: number;
  activity: string;
  timestamp: string;
  createdAt: string;
  updatedAt: string;
}

// Tipe untuk ErrorLog
interface ErrorLog {
  id: number;
  error: string;
  stackTrace?: string;
  timestamp: string;
  createdAt: string;
  updatedAt: string;
}

export const api = createApi({
  reducerPath: "api",
  baseQuery: fetchBaseQuery({
    baseUrl: `${process.env.NEXT_PUBLIC_API_URL}/api`,
    // Add token to the request headers if available
    prepareHeaders: (headers) => {
      const token = localStorage.getItem("accessToken");
      if (token) {
        headers.set("Authorization", `Bearer ${token}`);
      }
      return headers;
    },
  }),
  endpoints: (builder) => ({
    // public Endpoints
    getPublicProducts: builder.query<Product[], void>({
      query: () => "/public/catalogs",
      transformResponse: (response: ApiResponse<Product[]>) => response.data,
    }),
    getPublicCategories: builder.query<Category[], void>({
      query: () => "/public/categories",
      transformResponse: (response: ApiResponse<Category[]>) => response.data,
    }),
    // Produk Endpoints
    getProducts: builder.query<Product[], void>({
      query: () => "/products",
      transformResponse: (response: ApiResponse<Product[]>) => response.data,
    }),
    getProductById: builder.query<Product, number>({
      query: (id) => `/products/${id}`,
      transformResponse: (response: ApiResponse<Product>) => response.data,
    }),
    createProduct: builder.mutation<Product, Partial<Product>>({
      query: (newProduct) => ({
        url: "/products",
        method: "POST",
        body: newProduct,
      }),
    }),
    updateProduct: builder.mutation<
      Product,
      { id: number; updatedProduct: Partial<Product> }
    >({
      query: ({ id, updatedProduct }) => ({
        url: `/products/${id}`,
        method: "PUT",
        body: updatedProduct,
      }),
    }),
    deleteProduct: builder.mutation<void, number>({
      query: (id) => ({
        url: `/products/${id}`,
        method: "DELETE",
      }),
    }),

    // Cart Endpoints
    getCarts: builder.query<Cart[], void>({
      query: () => "/carts",
      transformResponse: (response: ApiResponse<Cart[]>) => response.data,
    }),
    getCartById: builder.query<Cart, number>({
      query: (id) => `/carts/${id}`,
      transformResponse: (response: ApiResponse<Cart>) => response.data,
    }),
    createCart: builder.mutation<Cart, Partial<Cart>>({
      query: (newCart) => ({
        url: "/carts",
        method: "POST",
        body: newCart,
      }),
    }),
    updateCart: builder.mutation<
      Cart,
      { id: number; updatedCart: Partial<Cart> }
    >({
      query: ({ id, updatedCart }) => ({
        url: `/carts/${id}`,
        method: "PUT",
        body: updatedCart,
      }),
    }),
    deleteCart: builder.mutation<void, number>({
      query: (id) => ({
        url: `/carts/${id}`,
        method: "DELETE",
      }),
    }),

    // CartItem Endpoints
    getCartItems: builder.query<CartItem[], void>({
      query: () => "/cartitems",
      transformResponse: (response: ApiResponse<CartItem[]>) => response.data,
    }),
    getCartItemById: builder.query<CartItem, number>({
      query: (id) => `/cartitems/${id}`,
      transformResponse: (response: ApiResponse<CartItem>) => response.data,
    }),
    createCartItem: builder.mutation<CartItem, Partial<CartItem>>({
      query: (newCartItem) => ({
        url: "/cartitems",
        method: "POST",
        body: newCartItem,
      }),
    }),
    updateCartItem: builder.mutation<
      CartItem,
      { id: number; updatedCartItem: Partial<CartItem> }
    >({
      query: ({ id, updatedCartItem }) => ({
        url: `/cartitems/${id}`,
        method: "PUT",
        body: updatedCartItem,
      }),
    }),
    deleteCartItem: builder.mutation<void, number>({
      query: (id) => ({
        url: `/cartitems/${id}`,
        method: "DELETE",
      }),
    }),

    // Category Endpoints
    getCategories: builder.query<Category[], void>({
      query: () => "/categories",
      transformResponse: (response: ApiResponse<Category[]>) => response.data,
    }),
    getCategoryById: builder.query<Category, number>({
      query: (id) => `/categories/${id}`,
      transformResponse: (response: ApiResponse<Category>) => response.data,
    }),
    createCategory: builder.mutation<Category, Partial<Category>>({
      query: (newCategory) => ({
        url: "/categories",
        method: "POST",
        body: newCategory,
      }),
    }),
    updateCategory: builder.mutation<
      Category,
      { id: number; updatedCategory: Partial<Category> }
    >({
      query: ({ id, updatedCategory }) => ({
        url: `/categories/${id}`,
        method: "PUT",
        body: updatedCategory,
      }),
    }),
    deleteCategory: builder.mutation<void, number>({
      query: (id) => ({
        url: `/categories/${id}`,
        method: "DELETE",
      }),
    }),

    // Order Endpoints
    getOrders: builder.query<Order[], void>({
      query: () => "/orders",
      transformResponse: (response: ApiResponse<Order[]>) => response.data,
    }),
    getOrderById: builder.query<Order, number>({
      query: (id) => `/orders/${id}`,
      transformResponse: (response: ApiResponse<Order>) => response.data,
    }),
    createOrder: builder.mutation<
      Order,
      {
        userEmail: string;
        cart: { productId: number; quantity: number; price: string }[];
      }
    >({
      query: (newOrder) => ({
        url: "/orders",
        method: "POST",
        body: newOrder,
      }),
    }),
    updateOrder: builder.mutation<
      Order,
      { id: number; updatedOrder: Partial<Order> }
    >({
      query: ({ id, updatedOrder }) => ({
        url: `/orders/${id}`,
        method: "PUT",
        body: updatedOrder,
      }),
    }),
    deleteOrder: builder.mutation<void, number>({
      query: (id) => ({
        url: `/orders/${id}`,
        method: "DELETE",
      }),
    }),

    // User Endpoints
    getUsers: builder.query<User[], void>({
      query: () => "/users",
      transformResponse: (response: ApiResponse<User[]>) => response.data,
    }),
    getUserById: builder.query<User, number>({
      query: (id) => `/users/${id}`,
      transformResponse: (response: ApiResponse<User>) => response.data,
    }),
    createUser: builder.mutation<User, Partial<User>>({
      query: (newUser) => ({
        url: "/users",
        method: "POST",
        body: newUser,
      }),
    }),
    updateUser: builder.mutation<
      User,
      { id: number; updatedUser: Partial<User> }
    >({
      query: ({ id, updatedUser }) => ({
        url: `/users/${id}`,
        method: "PUT",
        body: updatedUser,
      }),
    }),
    deleteUser: builder.mutation<void, number>({
      query: (id) => ({
        url: `/users/${id}`,
        method: "DELETE",
      }),
    }),

    // Role Endpoints
    getRoles: builder.query<Role[], void>({
      query: () => "/roles",
      transformResponse: (response: ApiResponse<Role[]>) => response.data,
    }),
    getRoleById: builder.query<Role, number>({
      query: (id) => `/roles/${id}`,
      transformResponse: (response: ApiResponse<Role>) => response.data,
    }),
    createRole: builder.mutation<Role, Partial<Role>>({
      query: (newRole) => ({
        url: "/roles",
        method: "POST",
        body: newRole,
      }),
    }),
    updateRole: builder.mutation<
      Role,
      { id: number; updatedRole: Partial<Role> }
    >({
      query: ({ id, updatedRole }) => ({
        url: `/roles/${id}`,
        method: "PUT",
        body: updatedRole,
      }),
    }),
    deleteRole: builder.mutation<void, number>({
      query: (id) => ({
        url: `/roles/${id}`,
        method: "DELETE",
      }),
    }),

    // ActivityLog Endpoints
    getActivityLogs: builder.query<ActivityLog[], void>({
      query: () => "/activitylogs",
      transformResponse: (response: ApiResponse<ActivityLog[]>) =>
        response.data,
    }),
    getActivityLogById: builder.query<ActivityLog, number>({
      query: (id) => `/activitylogs/${id}`,
      transformResponse: (response: ApiResponse<ActivityLog>) => response.data,
    }),

    // ErrorLog Endpoints
    getErrorLogs: builder.query<ErrorLog[], void>({
      query: () => "/errorlogs",
      transformResponse: (response: ApiResponse<ErrorLog[]>) => response.data,
    }),
    getErrorLogById: builder.query<ErrorLog, number>({
      query: (id) => `/errorlogs/${id}`,
      transformResponse: (response: ApiResponse<ErrorLog>) => response.data,
    }),
  }),
});

export const {
  useGetPublicProductsQuery,
  useGetPublicCategoriesQuery,
  useGetProductsQuery,
  useGetProductByIdQuery,
  useCreateProductMutation,
  useUpdateProductMutation,
  useDeleteProductMutation,
  useGetCartsQuery,
  useGetCartByIdQuery,
  useCreateCartMutation,
  useUpdateCartMutation,
  useDeleteCartMutation,
  useGetCartItemsQuery,
  useGetCartItemByIdQuery,
  useCreateCartItemMutation,
  useUpdateCartItemMutation,
  useDeleteCartItemMutation,
  useGetCategoriesQuery,
  useGetCategoryByIdQuery,
  useCreateCategoryMutation,
  useUpdateCategoryMutation,
  useDeleteCategoryMutation,
  useGetOrdersQuery,
  useGetOrderByIdQuery,
  useCreateOrderMutation,
  useUpdateOrderMutation,
  useDeleteOrderMutation,
  useGetUsersQuery,
  useGetUserByIdQuery,
  useCreateUserMutation,
  useUpdateUserMutation,
  useDeleteUserMutation,
  useGetRolesQuery,
  useGetRoleByIdQuery,
  useCreateRoleMutation,
  useUpdateRoleMutation,
  useDeleteRoleMutation,
  useGetActivityLogsQuery,
  useGetActivityLogByIdQuery,
  useGetErrorLogsQuery,
  useGetErrorLogByIdQuery,
} = api;
