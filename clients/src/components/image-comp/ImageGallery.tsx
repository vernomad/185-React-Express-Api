
import { useState } from 'react';
import { AnimatePresence, motion } from 'motion/react';

interface Image {
  id: number;
  title: string;
  //category: string;
  url: string;
  height: number; // Height for Masonry layout
}

interface ImageGalleryProps {
  images: Image[];
}

// const FlipInAnimation = () => {
//   return (
//     <motion.div
//       initial={{ opacity: 0, transform: 'scale(0)' }}
//       animate={{ opacity: 1, transform: 'scale(1)' }}
//       transition={{ duration: 0.5 }}
//     >
//       Content to animate
//     </motion.div>
//   );
// };

// const RotateInAnimation = () => {
//   return (
//     <motion.div
//       initial={{ opacity: 0, transform: 'rotate(-180deg)' }}
//       animate={{ opacity: 1, transform: 'rotate(0deg)' }}
//       transition={{ duration: 0.5 }}
//     >
//       Content to animate
//     </motion.div>
//   );
// };


const ImageGallery = ({ images }: ImageGalleryProps) => {
  //const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedImage, setSelectedImage] = useState<Image | null>(null);

  // const filteredImages = selectedCategory === 'All'
  //   ? images
  //   : images.filter(image => image.category === selectedCategory);

  //   const handleCategoryChange = (category: string) => {
  //     setSelectedCategory(category);
  //   };
  
    const updateView = (image: Image) => {
      setSelectedImage(image);
    };

  return (
   
    <div className=''>
      {/* <div className="filter-controls">
        <button className='' onClick={() => handleCategoryChange('All')}>All</button>
        <button className='' onClick={() => handleCategoryChange('Vintage Classic')}>Vintage Classic</button>
        <button className='' onClick={() => handleCategoryChange('Muscel Car')}>Muscel Car</button>
      </div> */}
      {selectedImage && (
        <div className="selected-image">
           <motion.div
                  key={selectedImage.id} // Make sure to set a unique key
                  initial={{ opacity: 0, transform: 'translateY(-5px)' }}
                  animate={{ opacity: 1, transform: 'translateY(0)' }}
                  transition={{ duration: 0.5 }}>

          <img src={selectedImage.url} alt={selectedImage.title} />
          </motion.div>
          <p className='details'><small>{selectedImage.title}</small></p>
        </div>
      )}
      <div className="masonry-container">
      <AnimatePresence>
        {images.map(image => (
          <div className="masonry-item" key={image.id}>
             <motion.div
                  // Make sure to set a unique key
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -10 }}
                  transition={{ duration: 0.5 }}
                >
            <img
              src={image.url}
              alt={image.title}
              onClick={() => updateView(image)}
              style={{ height: image.height }} 
              className='cursor-pointer'
            />
            </motion.div>
          </div>
        ))}
          </AnimatePresence>
      </div>
      
    </div>
  
  );
};

export default ImageGallery;
