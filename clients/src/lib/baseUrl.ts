
export  const baseUrl =
    import.meta.env.MODE === "development"
      ? import.meta.env.VITE_DEV_URL
      : import.meta.env.VITE_BASE_URL;