'use client';

import { useNavigate } from 'react-router-dom';
import { useEffect, useState } from 'react';

const ViewTransitionWrapper = ({ children }: { children: React.ReactNode }) => {
  const navigate = useNavigate();
  const [isTransitioning, setIsTransitioning] = useState(false);
  const isTransitionSupported =
    typeof document !== 'undefined' && 'startViewTransition' in document;

  useEffect(() => {
    const handleRouteChange = (url: string) => {
      if (isTransitionSupported && !isTransitioning) {
        setIsTransitioning(true);

        // Trigger the view transition
        document.startViewTransition(() => {
          navigate(url); // Perform navigation using React Router
        });

        console.log("View-transition called", url);
      } else {
        // Fallback for unsupported browsers or when transitioning
        navigate(url);
      }
    };

    // Listen for route changes, using `window.location` for a manual URL change
    const handlePopState = () => {
      if (!isTransitioning) {
        handleRouteChange(window.location.pathname);
      }
    };

    // Detect when the user navigates or pops state
    window.addEventListener('popstate', handlePopState);

    // Clean up on unmount
    return () => {
      window.removeEventListener('popstate', handlePopState);
    };
  }, [isTransitioning, navigate, isTransitionSupported]);

  // Ensure the transition is completed and allow normal interactions again
  useEffect(() => {
    if (isTransitioning && document.readyState === 'complete') {
      setIsTransitioning(false);
    }
  }, [isTransitioning]);

  return <>{children}</>;
};

export default ViewTransitionWrapper;
