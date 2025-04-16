import { Request, Response, NextFunction } from "express";
import { validationResult } from "express-validator";
import { BLOG_MESSAGES } from "../constants/blog.constants";
import { HttpStatusCode } from "../utils/enums";
import { Blog } from "../models/blog.scheema";
import { AuthRequest } from "../utils/interface";
import mongoose from "mongoose";
import { User } from "../models/user.scheema";

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

export const getAllBlogs = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const myId = req.user?.id;

    // Get logged-in user's preferences
    const user = await User.findById(myId);

    const userPreferences = user?.preferences || [];

    const blogs = await Blog.find({
      $and: [
        {
          $or: [
            { isPublished: true },
            { author: myId }
          ]
        },
        {
          blockedUsers: { $ne: myId }
        },
        {
          preference: { $in: userPreferences }
        }
      ]
    }).populate("author");

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


export const addLike = async (req: AuthRequest, res: Response, next: NextFunction) => {
  console.log("calling add like controller", req.body);

  try {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(HttpStatusCode.BAD_REQUEST).json({ message: "Invalid user ID" });
    }

    const userObjectId = new mongoose.Types.ObjectId(userId);

    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(HttpStatusCode.NOT_FOUND).json({
        message: BLOG_MESSAGES.BLOG_NOT_FOUND,
      });
    }

    // Check if user is blocked
    if (blog.blockedUsers.some(uid => uid && uid.equals(userObjectId))) {
      return res.status(HttpStatusCode.FORBIDDEN).json({
        message: "You are blocked from interacting with this blog.",
      });
    }

    const hasLiked = blog.likedBy.some(uid => uid && uid.equals(userObjectId));
    const hasDisliked = blog.dislikedBy.some(uid => uid && uid.equals(userObjectId));

    if (hasLiked) {
      blog.likeCount -= 1;
      blog.likedBy = blog.likedBy.filter(uid => uid && !uid.equals(userObjectId));
      await blog.save();

      return res.status(HttpStatusCode.OK).json({
        message: BLOG_MESSAGES.LIKE_REMOVED || "Like removed",
        likeCount: blog.likeCount,
      });
    }

    // If user has disliked, remove the dislike first
    if (hasDisliked) {
      blog.dislikeCount -= 1;
      blog.dislikedBy = blog.dislikedBy.filter(uid => uid && !uid.equals(userObjectId));
    }

    // Then add the like
    blog.likeCount += 1;
    blog.likedBy.push(userObjectId);
    await blog.save();

    return res.status(HttpStatusCode.OK).json({
      message: BLOG_MESSAGES.LIKE_ADDED || "Like added",
      likeCount: blog.likeCount,
      dislikeCount: blog.dislikeCount,
    });

  } catch (error) {
    next(error);
  }
};


export const blockBlog = async (req: AuthRequest, res: Response, next: NextFunction) => {
  console.log("calling block blog controller", req.body);
  
  try {
    const  blogId  = req.params.id;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(HttpStatusCode.BAD_REQUEST).json({ message: "Invalid user ID" });
    }

    if (!blogId) {
      return res.status(HttpStatusCode.BAD_REQUEST).json({ message: "Blog ID is required" });
    }

    const userObjectId = new mongoose.Types.ObjectId(userId);

    const blog = await Blog.findById(blogId);
    if (!blog) {
      return res.status(HttpStatusCode.NOT_FOUND).json({ message: BLOG_MESSAGES.BLOG_NOT_FOUND });
    }

    const isBlocked = blog.blockedUsers.some(id => id.equals(userObjectId));

    if (isBlocked) {
      blog.blockedUsers = blog.blockedUsers.filter(id => !id.equals(userObjectId));
      await blog.save();
      return res.status(HttpStatusCode.OK).json({ message: "Blog unblocked successfully" });
    }

    blog.blockedUsers.push(userObjectId);
    await blog.save();

    return res.status(HttpStatusCode.OK).json({ message: "Blog blocked successfully" });
  } catch (error) {
    next(error);
  }
};


export const addDislike = async (req: AuthRequest, res: Response, next: NextFunction) => {
  try {
    const { id } = req.params;
    const userId = req.user?.id;

    if (!userId) {
      return res.status(HttpStatusCode.BAD_REQUEST).json({ message: "Invalid user ID" });
    }

    const userObjectId = new mongoose.Types.ObjectId(userId);

    const blog = await Blog.findById(id);
    if (!blog) {
      return res.status(HttpStatusCode.NOT_FOUND).json({
        message: BLOG_MESSAGES.BLOG_NOT_FOUND,
      });
    }

    const hasDisliked = blog.dislikedBy.some(uid => uid?.equals(userObjectId));
    const hasLiked = blog.likedBy.some(uid => uid?.equals(userObjectId));

    // Toggle off dislike if already disliked
    if (hasDisliked) {
      blog.dislikeCount -= 1;
      blog.dislikedBy = blog.dislikedBy.filter(uid => uid && !uid.equals(userObjectId));
      await blog.save();
      return res.status(HttpStatusCode.OK).json({
        message: BLOG_MESSAGES.DISLIKE_REMOVED || "Dislike removed",
        dislikeCount: blog.dislikeCount,
      });
    }

    // If already liked, remove like first
    if (hasLiked) {
      blog.likeCount -= 1;
      blog.likedBy = blog.likedBy.filter(uid => uid && !uid.equals(userObjectId));
    }

    // Then add dislike
    blog.dislikeCount += 1;
    blog.dislikedBy.push(userObjectId);
    await blog.save();

    return res.status(HttpStatusCode.OK).json({
      message: BLOG_MESSAGES.DISLIKE_ADDED || "Dislike added",
      dislikeCount: blog.dislikeCount,
      likeCount: blog.likeCount,
    });

  } catch (error) {
    next(error);
  }
};


export const getLatestBlog = async (req: Request, res: Response, next: NextFunction) => {
  try {
    const latestBlog = await Blog.findOne({ isPublished: true })
      .sort({ createdAt: -1 }) // sort by newest
      .populate("author");

    if (!latestBlog) {
      return res.status(404).json({ message: "No published blogs found" });
    }

    res.status(200).json({
      message: "Latest blog fetched",
      blog: latestBlog,
    });
  } catch (error) {
    next(error);
  }
};