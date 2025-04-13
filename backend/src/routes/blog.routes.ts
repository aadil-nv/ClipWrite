import { Router } from "express";
import { createBlogValidation } from "../middlewares/authValidators";
import { validateRequest } from "../middlewares/validateRequest";
import { createBlog,getAllBlogs,getBlogById } from "../controllers/blog.controller";

export const blogRouter = Router();

blogRouter.post("/new-blog",createBlogValidation, validateRequest, createBlog);
blogRouter.get("/all-blogs", validateRequest, getAllBlogs);
blogRouter.get("/my-blogs", validateRequest,getBlogById );
blogRouter.get("/latest", validateRequest, getAllBlogs);

    