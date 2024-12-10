import { useEffect } from 'react';

const HeaderScrollEffect = () => {
  useEffect(() => {
    // eslint-disable-next-line @typescript-eslint/no-unsafe-function-type
    const debounce = (func: Function, wait: number) => {
      let timeout: NodeJS.Timeout;
      
      return (...args: unknown[]) => {
        clearTimeout(timeout);
        timeout = setTimeout(() => func(...args), wait);
      };
    };
   

    const handleScroll = debounce(() => {
      const header = document.querySelector('#header') as HTMLBodyElement;
      const background = document.querySelector("#background") as HTMLBodyElement;
      const scrollPosition = window.scrollY;

      console.log('Scroll Position:', scrollPosition);
      // Check the scroll position and add/remove the 'active' class accordingly
      if (header) {
      if (scrollPosition >= 50) {
      
          //console.log('Header found:', header);
          header.classList.add('active');
        
         // console.log('Active class added');
      } else {

          header.classList.remove('active');
        
         // console.log('Active class removed');
      }
    } else {
      console.error('Header not found');
    }
    if (background) {
      if (scrollPosition >= 50) {
        background.classList.add('active');
      } else {
        background.classList.remove('active');
      }
    } else {
      console.log("Background not found")
    }
    }, 50);

    window.addEventListener('scroll', handleScroll);

    return () => {
      window.removeEventListener('scroll', handleScroll);
    };
  }, []);

  return null; // This component doesn't render any content, so return null
};

export default HeaderScrollEffect;
