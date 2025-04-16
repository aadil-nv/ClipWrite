import { Router } from "express";
import { createBlogValidation } from "../middlewares/authValidators";
import { validateRequest } from "../middlewares/validateRequest";
import { addDislike, addLike, blockBlog, createBlog,getAllBlogs,getBlogById, getLatestBlog } from "../controllers/blog.controller";
import { authMiddleware } from "../middlewares/authMiddleware";

export const blogRouter = Router();

blogRouter.post("/new-blog",authMiddleware,createBlogValidation, validateRequest, createBlog);
blogRouter.get("/all-blogs",authMiddleware, validateRequest, getAllBlogs);
blogRouter.get("/blogs/:id",authMiddleware, validateRequest,getBlogById );
blogRouter.get("/latest",authMiddleware, validateRequest, getLatestBlog);
blogRouter.patch("/like/:id",authMiddleware, validateRequest, addLike);
blogRouter.patch("/dislike/:id",authMiddleware, validateRequest, addDislike);
blogRouter.patch("/block/:id",authMiddleware, validateRequest, blockBlog);

    