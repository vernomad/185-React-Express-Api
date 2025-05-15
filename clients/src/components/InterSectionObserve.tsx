import React, { useEffect } from 'react';

interface MySectObserveProps {
  targetContainers: string[];
  children: React.ReactNode;
}


export default function MySectObserve({ children, targetContainers }: MySectObserveProps) {
  useEffect(() => {
    const options = {
      rootMargin: '0px 0px -100px 0px',
      threshold: 0.1, // half of item height
    };

    const observer = new IntersectionObserver((entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        console.log(entry.target);
        entry.target.classList.add('intersecting');
        observer.unobserve(entry.target);
      });
    }, options);

    if (Array.isArray(targetContainers)) {
      targetContainers.forEach((containerClass) => {
        const elements = document.querySelectorAll(`.${containerClass}`);
        elements.forEach((element) => {
          observer.observe(element);
        });
      });
    }
    

    // Cleanup the observer when component unmounts
    return () => {
      if (Array.isArray(targetContainers)) {
        targetContainers.forEach((containerClass) => {
          const elements = document.querySelectorAll(`.${containerClass}`);
          elements.forEach((element) => {
            observer.unobserve(element);
          });
        });
      }
    };
  }, [targetContainers]);

  return <>{children}</>;
}
