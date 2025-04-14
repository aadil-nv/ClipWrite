import { BlogFormData } from '../interfaces/blog.interface';
import { userInstance } from '../middleware/axios';

// Define the response type
interface CreateBlogResponse {
  id: string;
  success: boolean;
  message: string;
}

export const createNewBlog = async (blogData: BlogFormData): Promise<CreateBlogResponse> => {

    console.log("Blog data:", blogData);
    
  try {
    const response = await userInstance.post<CreateBlogResponse>(
      'api/blog/new-blog',
      blogData
    );
    return response.data;
  } catch (error) {
    console.error('Error creating blog post:', error);
    throw new Error('Failed to create blog post');
  }
};


export const getBlogById = async (blogId: string) => {
  console.log("Blog ID:", blogId);
  
  try {
    const response = await userInstance.get(`/api/blog/${blogId}`);
    return response.data.blog;
  } catch (error) {
    console.error('Error fetching blog by ID:', error);
    throw error;
  }
};

export const updateBlog = async (blogId: string, blogData: any) => {
  try {
    const response = await userInstance.put(`/api/blogs/${blogId}`, blogData);
    return response.data;
  } catch (error) {
    console.error('Error updating blog:', error);
    throw error;
  }
};