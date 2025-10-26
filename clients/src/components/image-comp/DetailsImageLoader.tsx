import { useState, useRef, useEffect, useContext } from "react";
import { BlurLoadContext } from "./BlurLoadComponent";

type ImageProps = {
  imagUrl: string;
  className?: string;
  slug: string;
  thumbUrl: string;
  height?: number;
};

const ImageLoader = ({ imagUrl, thumbUrl, className, }: ImageProps) => {
  const [isLoading, setIsLoading] = useState(true);
  const divRef = useRef<HTMLDivElement>(null);
  const imgRef = useRef<HTMLImageElement>(null);
  const registerBlurDiv = useContext(BlurLoadContext);



  const handleImageLoad = () => {
    setIsLoading(false);
  };

  // Register this image + div with the BlurLoadProvider
  useEffect(() => {
    if (registerBlurDiv && divRef.current && imgRef.current) {
      registerBlurDiv(divRef.current, imgRef.current);
    }
  }, [registerBlurDiv]);

  return (
    <div ref={divRef} className={className}>
      {/* Thumbnail */}
      <img
        sizes="13px"
        alt="Thumbnail"
        src={thumbUrl}
        className="thumbnail-image"
      />

      {/* Full Image */}
      <img
        ref={imgRef}
        sizes="600px"
        className={`fullImage ${isLoading ? "loading" : "loaded"}`}
        alt=""
        src={imagUrl}
        onLoad={handleImageLoad}
      />
    </div>
  );
};

export default ImageLoader;
