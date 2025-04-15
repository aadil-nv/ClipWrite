import { Router } from "express";
import { validateRequest } from "../middlewares/validateRequest";
import { deleteBlog, getAllMyBlogs, updateBlog, updateBlogPublishStatus,getBlogById } from "../controllers/myBlog.controller";
import { authMiddleware } from "../middlewares/authMiddleware";

export const myBlogRouter = Router();



myBlogRouter.get("/all-blogs", authMiddleware,validateRequest, getAllMyBlogs);
myBlogRouter.get("/blog/:id", authMiddleware,validateRequest, getBlogById);


myBlogRouter.put("/update-blog/:id", authMiddleware,validateRequest, updateBlog);

myBlogRouter.delete("/blog/:id", authMiddleware,validateRequest, deleteBlog);

myBlogRouter.patch("/publish-status/:id", authMiddleware,validateRequest, updateBlogPublishStatus);
