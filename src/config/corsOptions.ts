import allowedOrigins from "./allowedOrigins";

const corsOptions = {
    origin: (origin: string | undefined, callback: (err: Error | null, allowed?: boolean) => void) => {
      if (!origin) {
        return callback(null, true);
      }
      if (allowedOrigins.indexOf(origin) !== -1) {
        callback(null, true); // Allow requests with undefined origins or matching allowed origins
      } else {
        console.log(`Blocked CORS request from origin: ${origin}`);
        callback(new Error('Not allowed by CORS'));
      }
    },
    methods: 'GET, POST, PUT, DELETE, OPTIONS',
    credentials: true, // Ensure credentials are allowed
    optionsSuccessStatus: 200
  };

export default corsOptions;
