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