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
        'name': string;
        'role': string;
        'email': string;
        'birthdate': string;
      }>(token);
      setIsAuthenticated(true);
      setUser({
        name: decodedToken['name'],
        role: decodedToken['role'],
        email: decodedToken['email'],
        birthDate: decodedToken['birthdate']
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
