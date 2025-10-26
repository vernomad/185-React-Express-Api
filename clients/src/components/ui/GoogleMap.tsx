import { useState } from "react";

type MapProps = {
  width: number;
  height: number;
  clsName?: string;
};

export default function GoogleMap({ width, height, clsName }: MapProps) {
  const [loaded, setLoaded] = useState(false);

  return (
    <>
      {!loaded && (
        <div className="map-loading">
          <h2 className="animate-pulse">
            Loading map...
          </h2>
        </div>
      )}

      <iframe
        title="Find us on Google Maps"
        src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d77505.50359569631!2d172.26286885626814!3d-43.49785987195489!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x6d31f853d8a00f27%3A0xa4abeee98371ffc8!2s185%20Bells%20Road%2C%20West%20Melton%207671!5e0!3m2!1sen!2snz!4v1665604298389!5m2!1sen!2snz"
        width={width}
        height={height}
        style={{ border: 0 }}
        className={clsName}
        allowFullScreen
        loading="lazy"
        referrerPolicy="no-referrer-when-downgrade"
        onLoad={() => setLoaded(true)} // ✅ triggers when iframe finishes loading
      ></iframe>
    </>
  );
}
