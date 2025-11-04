import { refreshApi } from './lib/api';
import { jwtDecode, JwtPayload } from 'jwt-decode';

export const isTokenExpired = (token: string | null): boolean => {
  if (!token) return true;
  const d = jwtDecode<JwtPayload>(token);
  if (!d.exp) return true;
  return d.exp < Date.now() / 1000;
};

export const refreshAuthToken = async (): Promise<string> => {
  const token = localStorage.getItem('jwtToken');
  if (!token) throw new Error('No token found in localStorage');

  const { data } = await refreshApi.post('/auth/refresh-token', { token }); // <-- viktig ändring
  const newToken = data.token;
  if (!newToken) throw new Error('No token in refresh response');

  localStorage.setItem('jwtToken', newToken);
  return newToken;
};
