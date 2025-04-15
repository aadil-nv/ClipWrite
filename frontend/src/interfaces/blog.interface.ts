// src/types/blog.ts
export interface BlogTag {
    id: string;
    name: string;
  }
  
  export interface BlogFormData {
    title: string;
    content: string;
    author: string; // Will need to be populated from user context
    image: string;
    tags: string[];
    preference: string[]; // Changed from single preference to array of preference
    isPublished: boolean;
  }


  export interface Author {
    _id: string;
    name: string;
    email: string;
    mobile: string;
    dob: string;
    preferences: string[];
    createdAt: string;
    updatedAt: string;
    image: string;
  }
  
  export interface Blog {
    _id: string;
    title: string;
    content: string;
    author: Author;
    tags: string[];
    preference: string[];
    image: string;
    isPublished: boolean;
    likeCount: number;
    dislikeCount: number;
    createdAt: string;
    updatedAt: string;
  }
  
  export interface BlogsProps {
    featuredBlog?: Blog;
  }
  
  export interface ApiResponse {
    message: string;
    blogs: Blog[];
  }

  export interface BlogCardProps {
    blog: Blog;
    onLike: (blogId: string) => void;
    onClick: () => void;
    formatDate: (date: string) => string;
    calculateReadTime: (content: string) => number;
  }