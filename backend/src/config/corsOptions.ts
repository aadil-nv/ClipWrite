import { CorsOptions } from "cors";

const corsOptions: CorsOptions = {
  origin: process.env.CLIENT_URL, // Default to localhost if not set
  methods: "GET,POST,PUT,DELETE,PATCH",
  allowedHeaders: "Content-Type,Authorization",
  credentials: true,
};

export default corsOptions;
