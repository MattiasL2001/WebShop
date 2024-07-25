export interface NavProps {
    IsScrolled: boolean;
    IsCartMenuOpen: boolean;
    IsLoginMenuOpen: boolean;
    IsSidebarMenuOpen: boolean;
    toggleCartMenu: () => void;
    toggleLoginMenu: () => void;
    toggleSidebarMenu: () => void;
  }
  