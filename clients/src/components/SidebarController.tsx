import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

const SidebarController = () => {
  const location = useLocation();

  useEffect(() => {
    // Uncheck the checkbox on route change
    const checkbox = document.getElementById('menu-toggle') as HTMLInputElement;
    if (checkbox) {
      checkbox.checked = false; // Reset the checkbox state
    }
  }, [location]); // Runs on every route change

  return null; // No UI, just logic
};

export default SidebarController;
