import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import cookieParser from "cookie-parser";
import logger from "./middlewares/logger";
import corsOptions from "./config/corsOptions"; 

import { errorHandler } from "./middlewares/errorHandler";
import { authRouter } from "./routes/auth.routes";
import { connectDB } from "./config/connectDB";
import { blogRouter } from "./routes/blog.routes";

connectDB();

const app = express();

app.use(cors(corsOptions)); 
app.use(express.json());
app.use(cookieParser());
app.use(logger);

app.use("/api/auth", authRouter);
app.use("/api/blog", blogRouter);


app.use(errorHandler);

export default app;