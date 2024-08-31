import React, { createContext, useContext, ReactNode, useState, useEffect } from 'react';
import { jwtDecode, JwtPayload } from 'jwt-decode';
import { isTokenExpired } from "./utils";

interface User {
  name: string;
  role: string;
  email: string;
  birthDate: string;
}

interface AuthContextProps {
  isAuthenticated: boolean;
  user: User | null;
  setAuthenticated: (value: boolean, user?: User) => void;
}

const AuthContext = createContext<AuthContextProps | undefined>(undefined);

export const AuthProvider: React.FC<{ children: ReactNode }> = ({ children }) => {
  const [isAuthenticated, setIsAuthenticated] = useState<boolean>(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const token = localStorage.getItem('jwtToken');
    if (token && !isTokenExpired(token)) {
      const decodedToken = jwtDecode<JwtPayload & {
        'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name': string;
        'http://schemas.microsoft.com/ws/2008/06/identity/claims/role': string;
        'http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress': string;
        'http://schemas.microsoft.com/ws/2008/06/identity/claims/userdata': string;
      }>(token);
      setIsAuthenticated(true);
      setUser({
        name: decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name'],
        role: decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/role'],
        email: decodedToken['http://schemas.xmlsoap.org/ws/2005/05/identity/claims/emailaddress'],
        birthDate: decodedToken['http://schemas.microsoft.com/ws/2008/06/identity/claims/userdata']
      });
    } else {
      localStorage.removeItem('jwtToken');
      setIsAuthenticated(false);
      setUser(null);
    }
  }, []);

  const setAuthenticated = (value: boolean, user?: User) => {
    setIsAuthenticated(value);
    if (user) {
      setUser(user);
    } else {
      setUser(null);
      localStorage.removeItem('jwtToken');
    }
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, setAuthenticated }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
