import axios from 'axios';
import { jwtDecode, JwtPayload } from 'jwt-decode';

// Kontrollera om en token är utgången
export const isTokenExpired = (token: string | null): boolean => {
  if (!token) return true;

  // Dekodera JWT-token för att extrahera payload
  const decodedToken = jwtDecode<JwtPayload>(token);
  if (!decodedToken.exp) return true; // Om tokenen saknar exp-fält, anta att den är utgången

  const currentTime = Date.now() / 1000;
  return decodedToken.exp < currentTime; // Jämför expirationstid med nuvarande tid
};

// Funktion för att förnya JWT-token
export const refreshAuthToken = async (): Promise<string> => {
  try {
    const token = localStorage.getItem('jwtToken');
    if (!token) throw new Error('No token found in localStorage');

    // Använd rätt endpoint för att förnya token i ditt nuvarande projekt
    const response = await axios.post('https://localhost:7180/auth/refresh-token', { token });

    const { token: newToken } = response.data;
    localStorage.setItem('jwtToken', newToken); // Spara den nya token i localStorage
    return newToken;
  } catch (error) {
    console.error('Failed to refresh token', error);
    throw error;
  }
};
