import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import { BLOG_MESSAGES } from "../constants/blog.constants";
import { HttpStatusCode } from "../utils/enums";
import { Blog } from "../models/blog.scheema";
import { AuthRequest } from "../utils/interface";

export const createBlog = async (req: AuthRequest, res: Response, next: NextFunction) => {
  console.log("hitting here0", req.body);
  
  try {
    const errors = validationResult(req);
    if (!errors.isEmpty()) {
      return res.status(HttpStatusCode.BAD_REQUEST).json({ errors: errors.array() });
    }

    const { title, content, tags, preference, image } = req.body;
    const id = req.user?.id;

    console.log(req.body);
    

    const blog = new Blog({
      title,
      content,
      author :id,
      tags,
      preference,
      image,
    });

    await blog.save();

    res.status(HttpStatusCode.CREATED).json({
      message: BLOG_MESSAGES.BLOG_CREATED,
      blog,
    });
  } catch (error) {
    next(error);
  }
};

export const getAllBlogs = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const blogs = await Blog.find({}).populate("author");
    res.status(HttpStatusCode.OK).json({
      message: BLOG_MESSAGES.ALL_BLOGS_FETCHED,
      blogs,
    });
  } catch (error) {
    next(error);
  }
};

export const getBlogById = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const id = req.params.id;    
    const blog = await Blog.findById(id).populate("author" );    

    if (!blog) {
      return res.status(HttpStatusCode.NOT_FOUND).json({ message: BLOG_MESSAGES.BLOG_NOT_FOUND });
    }

    res.status(HttpStatusCode.OK).json({
      message: BLOG_MESSAGES.BLOG_FETCHED,
      blog,
    });
  } catch (error) {
    next(error);
  }
};

export const updateBlog = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const updatedData = req.body;

    const blog = await Blog.findByIdAndUpdate(id, updatedData, { new: true });

    if (!blog) {
      return res.status(HttpStatusCode.NOT_FOUND).json({ message: BLOG_MESSAGES.BLOG_NOT_FOUND });
    }

    res.status(HttpStatusCode.OK).json({
      message: BLOG_MESSAGES.BLOG_UPDATED,
      blog,
    });
  } catch (error) {
    next(error);
  }
};

export const deleteBlog = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const blog = await Blog.findByIdAndDelete(id);

    if (!blog) {
      return res.status(HttpStatusCode.NOT_FOUND).json({ message: BLOG_MESSAGES.BLOG_NOT_FOUND });
    }

    res.status(HttpStatusCode.OK).json({ message: BLOG_MESSAGES.BLOG_DELETED });
  } catch (error) {
    next(error);
  }
};


export const 