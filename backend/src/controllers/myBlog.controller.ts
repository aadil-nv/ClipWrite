import {  Response, NextFunction } from "express";
import { HttpStatusCode } from "../utils/enums";
import { Blog } from "../models/blog.scheema";
import { AuthRequest } from "../utils/interface";
import { BLOG_MESSAGES } from "../constants/myBlog.constants";

// Get all blogs by the current user (author)
export const getAllMyBlogs = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;

    // Find blogs authored by the current user
    const blogs = await Blog.find({ author: userId }).populate("author");

    if (!blogs.length) {
      return res.status(HttpStatusCode.NOT_FOUND).json({
        message: BLOG_MESSAGES.NO_BLOGS_FOUND,
      });
    }

    res.status(HttpStatusCode.OK).json({
      message: BLOG_MESSAGES.ALL_BLOGS_FETCHED,
      blogs,
    });
  } catch (error) {
    next(error);
  }
};

// Update a blog
export const updateBlog = async (req: AuthRequest, res: Response, next: NextFunction) => {
  console.log("Updating blog with ID:", req.params.id);
  
  try {
    const userId = req.user?.id;
    console.log("User ID:", userId);
    
    const { id } = req.params;
    console.log("Blog ID:", id);
    
    const { title, content, tags, preference, image } = req.body;

    const blog = await Blog.findOne({ _id: id, author: userId });
    if (!blog) {
      return res.status(HttpStatusCode.NOT_FOUND).json({
        message: BLOG_MESSAGES.BLOG_NOT_FOUND,
      });
    }

    blog.title = title ?? blog.title;
    blog.content = content ?? blog.content;
    blog.tags = tags ?? blog.tags;
    blog.preference = preference ?? blog.preference;
    blog.image = image ?? blog.image;

    await blog.save();

    res.status(HttpStatusCode.OK).json({
      message: BLOG_MESSAGES.BLOG_UPDATED,
      blog,
    });
  } catch (error) {
    next(error);
  }
};

// Delete a blog
export const deleteBlog = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const userId = req.user?.id;
    const { id } = req.params;

    const blog = await Blog.findOneAndDelete({ _id: id, author: userId });
    if (!blog) {
      return res.status(HttpStatusCode.NOT_FOUND).json({
        message: BLOG_MESSAGES.BLOG_NOT_FOUND,
      });
    }

    res.status(HttpStatusCode.OK).json({
      message: BLOG_MESSAGES.BLOG_DELETED,
    });
  } catch (error) {
    next(error);
  }
};

// Block a user from accessing the blog
export const updateBlogPublishStatus = async (req: AuthRequest, res: Response, next: NextFunction) => {
    try {
      const userId = req.user?.id;
      const id = req.params.id;
      const { isPublished } = req.body;  // isPublished will be passed in the request body
  
      // Ensure that the `isPublished` field is a boolean
      if (typeof isPublished !== 'boolean') {
        return res.status(HttpStatusCode.BAD_REQUEST).json({
          message: 'The isPublished field must be a boolean.',
        });
      }
  
      const blog = await Blog.findOne({ _id: id, author: userId });
      if (!blog) {
        return res.status(HttpStatusCode.NOT_FOUND).json({
          message: BLOG_MESSAGES.BLOG_NOT_FOUND,
        });
      }
  
      // Update the isPublished field
      blog.isPublished = isPublished;
  
      // Save the updated blog
      await blog.save();
  
      res.status(HttpStatusCode.OK).json({
        message: isPublished ? BLOG_MESSAGES.BLOG_PUBLISHED : BLOG_MESSAGES.BLOG_UNPUBLISHED,
        blog,
      });
    } catch (error) {
      next(error);
    }
  };
  

  export const getBlogById = async (req: AuthRequest, res: Response, next: NextFunction) => {
    console.log("Blog ID:",);
    
    try {
      const userId = req.user?.id;
      const { id} = req.params;
      console.log("Blog ID:", id);
      
  
      const blog = await Blog.findOne({ _id: id, author: userId }).populate("author");
  
      if (!blog) {
        return res.status(HttpStatusCode.NOT_FOUND).json({
          message: BLOG_MESSAGES.BLOG_NOT_FOUND,
        });
      }
  
      res.status(HttpStatusCode.OK).json({
        message: "Blog fetched successfully.",
        blog,
      });
    } catch (error) {
      next(error);
    }
  };