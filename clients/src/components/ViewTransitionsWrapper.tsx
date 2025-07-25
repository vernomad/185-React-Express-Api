
// ViewTransitionLayout.tsx
import { useEffect, useRef } from 'react';
import { useLocation } from 'react-router-dom';
type ClssProp = {
  id: string;
  clsName: string;
  children: React.ReactNode;
}

const ViewTransitionLayout = ({ children, clsName, id }: ClssProp) => {
  const location = useLocation();
  const prevPath = useRef(location.pathname);

  useEffect(() => {
    if (
      document.startViewTransition &&
      prevPath.current !== location.pathname
    ) {
      document.startViewTransition(() => {
        // Route already updated; this just triggers the animation
      });
      prevPath.current = location.pathname;
    }
  }, [location]);

  useEffect(() => {
  if (
    typeof document !== 'undefined' &&
    'startViewTransition' in document &&
    prevPath.current !== location.pathname
  ) {
    document.startViewTransition(() => {
      // no-op; only triggers transition
    });
  }
  prevPath.current = location.pathname;
}, [location]);

  return <div className={clsName} id={id} style={{
    viewTransitionName: `${clsName}`,
    contain: 'layout', 
    height: "100dvh",
    position: 'relative', // ensure layout context
  }}>{children}</div>;
};

export default ViewTransitionLayout;

