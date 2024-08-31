import axios, { AxiosError, InternalAxiosRequestConfig } from "axios";
import { isTokenExpired, refreshAuthToken } from "../utils";
import { LoginUser } from "../components/models/LoginUser";
import { RegisterUser } from "../components/models/props/registerUser";

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
    try {
        const response = await api.post(`/auth/login`, loginUser);

        const { token } = response.data;
        localStorage.setItem("jwtToken", token);

        return response.data;
    } catch (error) {
        if (error instanceof AxiosError) {
            console.error("Login failed", error.response?.data || error.message);
        } else {
            console.error("An unexpected error occurred during login", error);
        }
        throw error;
    }
};

export const Register = async (registerUser: RegisterUser) => {
    try {
        const response = await api.post(`/auth/register`, registerUser);
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
  