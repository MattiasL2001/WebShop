import { useMutation } from '@tanstack/react-query';
import { LoginUser } from "../components/models/LoginUser";
import { Login } from '../services/webShopServices';

interface UseLoginProps {
  onSuccess: (response: { token: string }) => void;
  onError: (error: unknown) => void;
}

export const useLogin = ({ onSuccess, onError }: UseLoginProps) => {
  return useMutation({
    mutationFn: (loginUser: LoginUser) => Login(loginUser),
    onSuccess,
    onError
  });
};
