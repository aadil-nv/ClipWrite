import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import { userInstance } from '../../middleware/axios';

// Define proper TypeScript interfaces
interface Author {
  _id: string;
  name: string;
  email: string;
  mobile: string;
  dob: string;
  preferences: string[];
  createdAt: string;
  updatedAt: string;
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

interface ApiResponse {
  message: string;
  blog: Blog;
}

export default function BlogDetail() {
    console.log("hitting here");
    
  const { id } = useParams<{ id: string }>();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  useEffect(() => {
    const fetchBlogDetail = async () => {

        console.log("calling fetchBlogDetail=====>11111111111");
        
      try {
        setIsLoading(true);
        const response = await userInstance.get<ApiResponse>(`api/blog/blogs/${id}`);
        setBlog(response.data.blog);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching blog details:', error);
        setError('Failed to load blog. Please try again later.');
        setIsLoading(false);
      }
    };

    if (id) {
      fetchBlogDetail();
    }
  }, [id]);

  // Function to like a blog
  const handleLikeBlog = async () => {
    if (!blog) return;
    
    try {
      await userInstance.post(`api/blog/like/${blog._id}`);
      // Refresh blog to get updated like count
      const response = await userInstance.get<ApiResponse>(`api/blog/${id}`);
      setBlog(response.data.blog);
    } catch (error) {
      console.error('Error liking blog:', error);
    }
  };

  // Format date to readable format
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { 
      year: 'numeric', 
      month: 'long', 
      day: 'numeric' 
    });
  };

  // Calculate read time based on content length
  const calculateReadTime = (content: string): number => {
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-screen">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-16 text-center">
        <h2 className="text-2xl font-bold text-red-600 mb-4">Error</h2>
        <p className="text-gray-700 mb-6">{error || 'Blog not found'}</p>
        <button 
          onClick={() => navigate('/blogs')}
          className="px-6 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700"
        >
          Back to Blogs
        </button>
      </div>
    );
  }

  return (
    <motion.div 
      className="max-w-4xl mx-auto px-4 py-12"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Back Button */}
      <button 
        onClick={() => navigate('/blogs')}
        className="mb-8 flex items-center text-teal-600 hover:text-teal-800"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
        </svg>
        Back to Blogs
      </button>

      {/* Blog Header */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-2 mb-4">
          {blog.preference.map((pref, index) => (
            <span key={index} className="bg-teal-100 text-teal-800 text-xs font-medium px-2 py-1 rounded-md">
              {pref}
            </span>
          ))}
        </div>
        <h1 className="text-3xl md:text-4xl font-bold mb-4">{blog.title}</h1>
        
        {/* Author and Meta Info */}
        <div className="flex flex-wrap items-center justify-between mb-6 text-gray-600">
          <div className="flex items-center mr-4 mb-2 sm:mb-0">
            <div className="h-10 w-10 bg-gray-300 rounded-full mr-3"></div>
            <div>
              <p className="font-medium">{blog.author.name}</p>
              <p className="text-sm">{formatDate(blog.createdAt)}</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            <span className="text-sm">{calculateReadTime(blog.content)} min read</span>
            <button 
              onClick={handleLikeBlog}
              className="flex items-center gap-1 text-gray-500 hover:text-teal-600"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill={blog.likeCount > 0 ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <span>{blog.likeCount}</span>
            </button>
          </div>
        </div>
      </div>

      {/* Featured Image */}
      <div className="mb-8">
        <img 
          src={blog.image} 
          alt={blog.title}
          className="w-full h-auto rounded-lg shadow-md"
        />
      </div>

      {/* Blog Content */}
      <div className="prose max-w-none">
        {/* Render content with proper formatting */}
        {blog.content.split('\n').map((paragraph, index) => (
          paragraph.trim() ? <p key={index} className="mb-4">{paragraph}</p> : null
        ))}
      </div>

      {/* Tags */}
      {blog.tags.length > 0 && (
        <div className="mt-8 pt-6 border-t border-gray-200">
          <h3 className="text-lg font-medium mb-2">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {blog.tags.map((tag, index) => (
              <span key={index} className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm">
                {tag}
              </span>
            ))}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="mt-10 flex justify-between items-center">
        <button 
          onClick={() => navigate('/blogs')}
          className="px-6 py-2 bg-gray-200 text-gray-800 rounded-md hover:bg-gray-300"
        >
          Back to Blogs
        </button>
        <button 
          onClick={handleLikeBlog}
          className="flex items-center gap-2 px-6 py-2 bg-teal-600 text-white rounded-md hover:bg-teal-700"
        >
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
          </svg>
          Like This Post
        </button>
      </div>
    </motion.div>
  );
}