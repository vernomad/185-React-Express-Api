import { BlurLoadContext } from "./BlurLoadComponent";
import { useState, useRef, useEffect, useContext } from "react";
import { CSSProperties } from "react";

type ImageProps = {
  imageUrl: string;
  thumbUrl: string;
  onClick: () => void;
  style?: CSSProperties; 
};

const ImageLoader = ({imageUrl, thumbUrl, onClick}: ImageProps) => {
     const [isLoading, setIsLoading] = useState(true);
      const divRef = useRef<HTMLDivElement>(null);
      const imgRef = useRef<HTMLImageElement>(null);
     const registerBlurDiv = useContext(BlurLoadContext);

      const handleImageLoad = () => {
    setIsLoading(false);
  };

  useEffect(() => {
    if (registerBlurDiv && divRef.current && imgRef.current) {
      registerBlurDiv(divRef.current, imgRef.current);
    }
  }, [registerBlurDiv]);

  return (
    <div ref={divRef} className="blur-container">
         <img
        sizes="13px"
        alt="Thumbnail"
        src={thumbUrl}
        className="blur-image"
      />

       <img
        ref={imgRef}
        sizes="600px"
        className={`fullImage ${isLoading ? "loading" : "loaded"}`}
        alt="Main thumbnail image"
        src={imageUrl}
        onLoad={handleImageLoad}
        onClick={onClick}
      />

    </div>
  )
}

export default ImageLoader