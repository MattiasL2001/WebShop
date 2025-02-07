export interface LoginMenuProps {
    isLoggedIn: boolean;
    setIsLoggedIn: (isLoggedIn: boolean) => void;
    toggleLoginMenu: () => void;
  }