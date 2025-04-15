import { BlogFormData } from '../interfaces/blog.interface';
import { userInstance } from '../middleware/axios';

// Define the response type
interface CreateBlogResponse {
  id: string;
  success: boolean;
  message: string;
}
interface ApiResponse {
  message: string;
  blogs: Blog[];
}

interface Blog {
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

interface Author {
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

export const fetchAllBlogs = async () => {
  const response = await userInstance.get<ApiResponse>('api/blog/all-blogs');
  return response.data.blogs;
};
export const createNewBlog = async (blogData: BlogFormData): Promise<CreateBlogResponse> => {  
  try {
    const response = await userInstance.post<CreateBlogResponse>('api/blog/new-blog',blogData);
    return response.data;
  } catch (error) {
    console.error('Error creating blog post:', error);
    throw new Error('Failed to create blog post');
  }
};

export const getBlogById = async (blogId: string) => {
  
  try {
    const response = await userInstance.get(`api/my-blogs/blog/${blogId}`);
    return response.data.blog;
  } catch (error) {
    console.error('Error fetching blog by ID:', error);
    throw error;
  }
};

export const updateBlog = async (blogId: string, blogData:BlogFormData ) => {
  try {
    const response = await userInstance.put(`api/my-blogs/update-blog/${blogId}`, blogData);
    return response.data;
  } catch (error) {
    console.error('Error updating blog:', error);
    throw error;
  }
};