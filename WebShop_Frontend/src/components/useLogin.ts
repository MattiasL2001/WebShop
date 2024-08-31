import { useMutation } from '@tanstack/react-query';
import { LoginUser } from "../components/models/LoginUser";
import { Login } from '../services/webShopServices';

interface UseLoginProps {
  onSuccess: (response: { token: string }) => void; // Adjust based on actual backend response
  onError: (error: unknown) => void; // Prefer `unknown` over `any` for better type safety
}

export const useLogin = ({ onSuccess, onError }: UseLoginProps) => {
  return useMutation({
    mutationFn: (loginUser: LoginUser) => Login(loginUser),
    onSuccess,
    onError
  });
};
