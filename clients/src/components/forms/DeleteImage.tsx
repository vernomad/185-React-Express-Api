"use client";

import { useState } from "react";

type DeleteImageProps = {
  slug: string;
  imgUrl: string;
  onDeleted?: (dir: string) => void; // ✅ new prop
};

export default function DeleteImage({ slug, imgUrl }: DeleteImageProps) {
  const [formError, setFormError] = useState<string | null>(null);
  const [message, setMessage] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const handleDelete = async () => {
    setFormError(null);
    setMessage(null);
    setLoading(true);

    try {
      const res = await fetch(`/api/project/${slug}/${imgUrl}`, {
        method: "Delete",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ slug, imgUrl }),
      });

      const data = await res.json();

      if (!res.ok) {
        setFormError(data.message || "Error deleting image");
        return;
      }

      setMessage(data.message || "Image deleted successfully");

      // ✅ Notify parent that the image was deleted
      // if (onDeleted) onDeleted(imgUrl);

    } catch (err) {
      console.error(err);
      setFormError("Server error");
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      {formError && <span className="errors">{formError}</span>}
      {message && <span className="response-message">{message}</span>}

        <button 
        type="submit" 
        className="action-button" 
        disabled={loading}
         onClick={handleDelete}>
          {loading ? "Deleting..." : "X"}
        </button>
    </>
  );
}
