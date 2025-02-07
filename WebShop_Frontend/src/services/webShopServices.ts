import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { isTokenExpired, refreshAuthToken } from "../utils";
import { LoginUser } from "../components/models/LoginUser";
import { RegisterUser } from "../components/models/props/registerUser";
import { AddProduct } from "../components/models/props/addProduct";

const api = axios.create({
  baseURL: 'https://localhost:7180',
});

api.interceptors.request.use(
  async (config: InternalAxiosRequestConfig) => {
    let token = localStorage.getItem('jwtToken');

    if (token && isTokenExpired(token)) {
      try {
        token = await refreshAuthToken();
      } catch (error) {
        console.error('Failed to refresh token:', error);
        throw error;
      }
    }

    if (token && config.headers) {
      config.headers['Authorization'] = `Bearer ${token}`;
    }

    return config;
  },
  (error: AxiosError) => {
    return Promise.reject(error);
  }
);

export const Login = async (loginUser: LoginUser) => {
  const basicAuth = btoa(`${loginUser.email}:${loginUser.password}`);
  console.log(basicAuth)

  try {
      const response = await api.post(
          `/auth/token`, 
          'grant_type=client_credentials',
          {
              headers: {
                  'Authorization': `Basic ${basicAuth}`,
                  'Content-Type': 'application/x-www-form-urlencoded',
              },
          }
      );

      const { token } = response.data;
      localStorage.setItem("jwtToken", token);

      return response.data;
  } catch (error) {
      console.error("Login failed", error);
      throw error;
  }
};

export const Register = async (registerUser: RegisterUser) => {
    try {
        const response = await api.post(`/user/register`, registerUser);
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            console.error("Registration failed", error.response?.data || error.message);
        } else {
            console.error("An unexpected error occurred during registration", error);
        }
        throw error;
    }
};

export const GetUsersAdmin = () => {
  return api.get(`/api/admin/users`)
      .then(response => response.data)
      .catch((error) => {
          if (error instanceof AxiosError) {
              console.error("Failed to get users", error.response?.data || error.message);
          } else {
              console.error("An unexpected error occurred while getting users", error);
          }
          throw error;
      });
};

export const GetProductsAdmin = () => {
    return api.get(`/api/admin/products`)
        .then(response => response.data)
        .catch((error) => {
            if (error instanceof AxiosError) {
                console.error("Failed to get products", error.response?.data || error.message);
            } else {
                console.error("An unexpected error occurred while getting products", error);
            }
            throw error;
        });
};

export const GetProducts = (
    numberPerPage: number, 
    page: number, 
    type?: number, 
    color?: number, 
    gender?: number, 
    sortBy?: string, 
    search?: string
) => {
    const params: any = { numberPerPage, page };

    if (type !== undefined) params.type = type;
    if (color !== undefined) params.color = color;
    if (gender !== undefined) params.gender = gender;
    if (sortBy !== undefined) params.sortBy = sortBy;
    if (search !== undefined) params.search = search;

    return api.get(`/Product/products`, { params })
        .then(response => response.data)
        .catch((error) => {
            if (error instanceof AxiosError) {
                console.error("Failed to get products", error.response?.data || error.message);
            } else {
                console.error("An unexpected error occurred while getting products", error);
            }
            throw error;
        });
};

export const GetNumberOfProducts = async () => {
    try {
        const response = await api.get(`/Product/all`);
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            console.error("Failed to get number of products", error.response?.data || error.message);
        } else {
            console.error("An unexpected error occurred while getting the number of products", error);
        }
        throw error;
    }
};

export const ChangePassword = async (email: string, newPassword: string) => {
    try {
        const response = await api.put(`/user/${email}/change-password`, null, {
            params: { newPassword },
        });
        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            console.error("Failed to change password", error.response?.data || error.message);
        } else {
            console.error("An unexpected error occurred while changing the password", error);
        }
        throw error;
    }
};

export const deleteUser = async (email: string) => {
    try {
      const response = await api.delete(`/user/delete`, {
        params: { email },
      });
  
      return response.data;
    } catch (error) {
      if (error instanceof AxiosError) {
        console.error("Failed to delete user", error.response?.data || error.message);
      } else {
        console.error("An unexpected error occurred while deleting the user", error);
      }
      throw error;
    }
};

export const fetchUserById = async (id: number) => {
  try {
    const response = await api.get(`/user/user`, { params: { id } });
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error("Failed to fetch user by ID", error.response?.data || error.message);
    } else {
      console.error("An unexpected error occurred while fetching the user", error);
    }
    throw error;
  }
};

export const fetchProductById = async (id: number) => {
  try {
    const response = await api.get(`/product`, { params: { id } });
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error("Failed to fetch product by ID", error.response?.data || error.message);
    } else {
      console.error("An unexpected error occurred while fetching the product", error);
    }
    throw error;
  }
};

export const adminCreateUser = async (user: RegisterUser) => {
  try {
    const response = await api.post(`/api/admin/users/`, user);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error("Failed to create user", error.response?.data || error.message);
    } else {
      console.error("An unexpected error occurred while creating the user", error);
    }
    throw error;
  }
};

export const adminUpdateUser = async (id: number, user: any) => {
  try {
    const response = await api.put(`/api/admin/users/${id}`, user);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error("Failed to update user", error.response?.data || error.message);
    } else {
      console.error("An unexpected error occurred while updating the user", error);
    }
    throw error;
  }
};

export const adminDeleteUser = async (id: number) => {
  try {
    const response = await api.delete(`/api/admin/users/${id}`);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error("Failed to delete user", error.response?.data || error.message);
    } else {
      console.error("An unexpected error occurred while deleting the user", error);
    }
    throw error;
  }
};

export const adminCreateProduct = async (product: AddProduct) => {
  try {
    const response = await api.post(`/api/admin/products/`, product);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error("Failed to create product", error.response?.data || error.message);
    } else {
      console.error("An unexpected error occurred while creating the product", error);
    }
    throw error;
  }
};

export const adminUpdateProduct = async (id: number, product: any) => {
  try {
    const response = await api.put(`/api/admin/products/${id}`, product);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error("Failed to update product", error.response?.data || error.message);
    } else {
      console.error("An unexpected error occurred while updating the product", error);
    }
    throw error;
  }
};


export const adminDeleteProduct = async (id: number) => {
  try {
    const response = await api.delete(`/api/admin/products/${id}`);
    return response.data;
  } catch (error) {
    if (error instanceof AxiosError) {
      console.error("Failed to delete product", error.response?.data || error.message);
    } else {
      console.error("An unexpected error occurred while deleting the product", error);
    }
    throw error;
  }
};

export const placeOrder = async (order: any) => {
  try {
    const response = await api.post("/user/order", order);
    return response.data;
  } catch (error) {
    console.error(error);
  }
};

export const getOrdersByEmail = async (email: string) => {
  try {
      const response = await api.get(`/user/${email}/orders`);
      return response.data;
  } catch (error) {
      if (error instanceof AxiosError) {
          console.error("Failed to fetch orders", error.response?.data || error.message);
      } else {
          console.error("An unexpected error occurred while fetching orders", error);
      }
      throw error;
  }
};
