import { Router } from "express";
import { createBlogValidation } from "../middlewares/authValidators";
import { validateRequest } from "../middlewares/validateRequest";
import { createBlog,getAllBlogs,getBlogById } from "../controllers/blog.controller";
import { authMiddleware } from "../middlewares/authMiddleware";

export const blogRouter = Router();

blogRouter.post("/new-blog",authMiddleware,createBlogValidation, validateRequest, createBlog);
blogRouter.get("/all-blogs",authMiddleware, validateRequest, getAllBlogs);
blogRouter.get("/blogs/:id",authMiddleware, validateRequest,getBlogById );
blogRouter.get("/latest",authMiddleware, validateRequest, getAllBlogs);
blogRouter.get("/like/:id",authMiddleware, validateRequest, getAllBlogs);

    