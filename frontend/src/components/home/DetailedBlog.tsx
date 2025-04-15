import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { userInstance } from '../../middleware/axios';
import useAuth from '../../hooks/useAuth';

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
  likedBy: string[];
  dislikedBy: string[];
  createdAt: string;
  updatedAt: string;
}

interface ApiResponse {
  message: string;
  blog: Blog;
}

interface AuthUser {
  userId: string;
}

export default function BlogDetail() {
  const { id } = useParams<{ id: string }>();
  const [blog, setBlog] = useState<Blog | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [isLiked, setIsLiked] = useState<boolean>(false);
  const [isDisliked, setIsDisliked] = useState<boolean>(false);
  const [showBlockConfirmation, setShowBlockConfirmation] = useState<boolean>(false);
  const navigate = useNavigate();
  const { user } = useAuth() as { user: AuthUser };
  const userId = user.userId;

  useEffect(() => {
    const fetchBlogDetail = async () => {
      try {
        setIsLoading(true);
        if (!id) {
          throw new Error("Blog ID is missing");
        }
        const response = await userInstance.get<ApiResponse>(`api/blog/blogs/${id}`);
        const fetchedBlog = response.data.blog;
        setBlog(fetchedBlog);
        
        // Check if user has already liked or disliked based on userId
        if (fetchedBlog.likedBy && fetchedBlog.likedBy.includes(userId)) {
          setIsLiked(true);
        }
        if (fetchedBlog.dislikedBy && fetchedBlog.dislikedBy.includes(userId)) {
          setIsDisliked(true);
        }
        
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching blog details:', error);
        setError('Failed to load blog. Please try again later.');
        setIsLoading(false);
      }
    };

    if (id) {
      fetchBlogDetail();
    } else {
      setError('Blog ID is missing');
      setIsLoading(false);
    }
  }, [id, userId]);

  // Function to like a blog
  const handleLikeBlog = async () => {
    if (!blog) return;
    
    try {
      // Update UI immediately for better UX before API call
      if (isDisliked) {
        setIsDisliked(false);
        setBlog(prev => prev ? {...prev, dislikeCount: Math.max(0, prev.dislikeCount - 1)} : null);
      }
      
      // Toggle like state
      const newLikedState = !isLiked;
      setIsLiked(newLikedState);
      
      // Update like count immediately
      setBlog(prev => {
        if (!prev) return null;
        return {
          ...prev,
          likeCount: newLikedState 
            ? prev.likeCount + 1 
            : Math.max(0, prev.likeCount - 1)
        };
      });
      
      // Make API call
      await userInstance.patch(`api/blog/like/${blog._id}`);
      
    } catch (error) {
      console.error('Error liking blog:', error);
      // Revert UI changes on error
      setIsLiked(!isLiked);
      setBlog(prev => prev ? {...prev} : null);
    }
  };

  // Function to dislike a blog
  const handleDislikeBlog = async () => {
    if (!blog) return;
    
    try {
      // Update UI immediately for better UX
      if (isLiked) {
        setIsLiked(false);
        setBlog(prev => prev ? {...prev, likeCount: Math.max(0, prev.likeCount - 1)} : null);
      }
      
      // Toggle dislike state
      const newDislikedState = !isDisliked;
      setIsDisliked(newDislikedState);
      
      // Update dislike count internally but don't show it
      setBlog(prev => {
        if (!prev) return null;
        return {
          ...prev,
          dislikeCount: newDislikedState 
            ? prev.dislikeCount + 1 
            : Math.max(0, prev.dislikeCount - 1)
        };
      });
      
      // Make API call
      await userInstance.patch(`api/blog/dislike/${blog._id}`);
      
    } catch (error) {
      console.error('Error disliking blog:', error);
      // Revert UI changes on error
      setIsDisliked(!isDisliked);
      setBlog(prev => prev ? {...prev} : null);
    }
  };

  // Function to confirm block action
  const confirmBlockBlog = () => {
    setShowBlockConfirmation(true);
  };

  // Function to block a blog after confirmation
  const handleBlockBlog = async () => {
    if (!blog) return;
    
    try {
      await userInstance.patch(`api/blog/block/${blog._id}`);
      // Navigate away after blocking
      navigate('/blogs');
    } catch (error) {
      console.error('Error blocking blog:', error);
      setShowBlockConfirmation(false);
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
        <motion.div 
          className="rounded-full h-12 w-12 border-b-2 border-teal-500"
          animate={{ rotate: 360 }}
          transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
        />
      </div>
    );
  }

  if (error || !blog) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 md:py-16 text-center">
        <motion.h2 
          className="text-xl md:text-2xl font-bold text-red-600 mb-4"
          initial={{ opacity: 0, y: -20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          Error
        </motion.h2>
        <motion.p 
          className="text-gray-700 mb-6"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {error || 'Blog not found'}
        </motion.p>
        <motion.button 
          onClick={() => navigate('/blogs')}
          className="px-6 py-3 bg-teal-600 text-white rounded-md hover:bg-teal-700 shadow-lg transition-all duration-300"
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          Back to Blogs
        </motion.button>
      </div>
    );
  }

  return (
    <motion.div 
      className="max-w-4xl mx-auto px-4 sm:px-6 py-6 md:py-8"
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
    >
      {/* Back Button */}
      <motion.button 
        onClick={() => navigate('/blogs')}
        className="mb-4 md:mb-6 flex items-center text-teal-600 hover:text-teal-800 bg-teal-50 px-4 py-2 rounded-full shadow-sm transition-all duration-300"
        whileHover={{ x: -5 }}
        whileTap={{ scale: 0.95 }}
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 mr-1" viewBox="0 0 20 20" fill="currentColor">
          <path fillRule="evenodd" d="M9.707 16.707a1 1 0 01-1.414 0l-6-6a1 1 0 010-1.414l6-6a1 1 0 011.414 1.414L5.414 9H17a1 1 0 110 2H5.414l4.293 4.293a1 1 0 010 1.414z" clipRule="evenodd" />
        </svg>
        Back to Blogs
      </motion.button>

      {/* Blog Header - Improved spacing and wrapping */}
      <div className="mb-6">
        {/* Category/Preference Tags with max-width to prevent overflow */}
        <div className="flex flex-wrap gap-2 mb-4">
          {blog.preference.slice(0, 5).map((pref, index) => (
            <motion.span 
              key={index} 
              className="bg-teal-100 text-teal-800 text-xs font-medium px-2 py-1 rounded-md"
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: index * 0.1 }}
            >
              {pref}
            </motion.span>
          ))}
          {blog.preference.length > 5 && (
            <span className="text-xs text-gray-500 self-center">+{blog.preference.length - 5} more</span>
          )}
        </div>
        
        {/* Blog Title with word-break to prevent overflow */}
        <motion.h1 
          className="text-2xl sm:text-3xl md:text-4xl font-bold mb-4 break-words"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
        >
          {blog.title}
        </motion.h1>
        
        {/* Author and Meta Info - Improved for mobile */}
        <div className="flex flex-col md:flex-row md:items-center md:justify-between mb-4 text-gray-600">
          <motion.div 
            className="flex items-center mb-4 md:mb-0"
            initial={{ opacity: 0, x: -20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <div className="h-10 w-10 bg-gray-300 rounded-full mr-3 flex-shrink-0"></div>
            <div>
              <p className="font-medium">{blog.author.name}</p>
              <p className="text-sm">{formatDate(blog.createdAt)}</p>
            </div>
          </motion.div>
          
          <motion.div 
            className="flex items-center gap-4"
            initial={{ opacity: 0, x: 20 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
          >
            <span className="text-sm">{calculateReadTime(blog.content)} min read</span>
            <div className="flex items-center gap-2">
              <motion.button 
                onClick={handleLikeBlog}
                className={`flex items-center gap-1 ${isLiked ? 'text-red-500' : 'text-gray-500'}`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill={isLiked ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                </svg>
                <span>{blog.likeCount}</span>
              </motion.button>
              <motion.button 
                onClick={handleDislikeBlog}
                className={`flex items-center gap-1 ${isDisliked ? 'text-blue-500' : 'text-gray-500'}`}
                whileHover={{ scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
              >
                <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill={isDisliked ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.096c.5 0 .905-.405.905-.904 0-.715.211-1.413.608-2.008L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5" />
                </svg>
              </motion.button>
            </div>
          </motion.div>
        </div>
      </div>

      {/* Featured Image - Added overflow control */}
      <motion.div 
        className="mb-8 overflow-hidden rounded-lg shadow-md"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.3 }}
      >
        <img 
          src={blog.image} 
          alt={blog.title}
          className="w-full h-48 sm:h-64 md:h-80 object-cover object-center"
          onError={(e) => {
            // Fallback for broken images
            e.currentTarget.src = "https://via.placeholder.com/800x400?text=Image+Not+Available";
          }}
        />
      </motion.div>

      {/* Blog Content - Added overflow handling and proper text wrapping */}
      <motion.div 
        className="prose max-w-none overflow-hidden"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ duration: 0.5, delay: 0.4 }}
      >
        <div className="break-words whitespace-pre-wrap">
          {blog.content.split('\n').map((paragraph, index) => (
            paragraph.trim() ? 
              <motion.p 
                key={index} 
                className="mb-4"
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.4 + (index * 0.05) }}
              >
                {paragraph}
              </motion.p> : null
          ))}
        </div>
      </motion.div>

      {/* Tags - Limited display with counter for overflow */}
      {blog.tags.length > 0 && (
        <motion.div 
          className="mt-8 pt-6 border-t border-gray-200"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 0.5, delay: 0.5 }}
        >
          <h3 className="text-lg font-medium mb-2">Tags</h3>
          <div className="flex flex-wrap gap-2">
            {blog.tags.slice(0, 8).map((tag, index) => (
              <motion.span 
                key={index} 
                className="bg-gray-100 text-gray-700 px-3 py-1 rounded-full text-sm"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={{ opacity: 1, scale: 1 }}
                transition={{ duration: 0.3, delay: 0.5 + (index * 0.05) }}
              >
                {tag}
              </motion.span>
            ))}
            {blog.tags.length > 8 && (
              <span className="text-sm text-gray-500 self-center">+{blog.tags.length - 8} more</span>
            )}
          </div>
        </motion.div>
      )}

      {/* Action Buttons - Responsive layout for different screen sizes */}
      <motion.div 
        className="mt-8 flex flex-col sm:flex-row items-center gap-3"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5, delay: 0.6 }}
      >
        <motion.button 
          onClick={() => navigate('/blogs')}
          className="w-full sm:w-auto px-5 py-2 bg-teal-50 text-teal-700 rounded-md border border-teal-200 shadow-sm transition-all duration-300"
          whileHover={{ scale: 1.03 }}
          whileTap={{ scale: 0.97 }}
        >
          Back to Blogs
        </motion.button>

        {/* Action buttons - stacked on mobile, side by side on larger screens */}
        <div className="w-full sm:w-auto flex flex-col sm:flex-row items-center gap-3 mt-3 sm:mt-0 sm:ml-auto">
          <motion.button 
            onClick={confirmBlockBlog}
            className="w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2 bg-gray-800 text-white rounded-md shadow-sm transition-all duration-300"
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M18.364 18.364A9 9 0 005.636 5.636m12.728 12.728A9 9 0 015.636 5.636m12.728 12.728L5.636 5.636" />
            </svg>
            Block
          </motion.button>
          
          <motion.button 
            onClick={handleLikeBlog}
            className={`w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2 rounded-md shadow-sm transition-all duration-300 ${
              isLiked 
                ? 'bg-red-500 text-white hover:bg-red-600' 
                : 'bg-teal-600 text-white hover:bg-teal-700'
            }`}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill={isLiked ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
            </svg>
            {isLiked ? 'Liked' : 'Like'} ({blog.likeCount})
          </motion.button>

          <motion.button 
            onClick={handleDislikeBlog}
            className={`w-full sm:w-auto flex items-center justify-center gap-2 px-5 py-2 rounded-md shadow-sm transition-all duration-300 ${
              isDisliked 
                ? 'bg-blue-500 text-white hover:bg-blue-600' 
                : 'bg-gray-400 text-white hover:bg-gray-500'
            }`}
            whileHover={{ scale: 1.03 }}
            whileTap={{ scale: 0.97 }}
          >
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill={isDisliked ? "currentColor" : "none"} viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 14H5.236a2 2 0 01-1.789-2.894l3.5-7A2 2 0 018.736 3h4.018a2 2 0 01.485.06l3.76.94m-7 10v5a2 2 0 002 2h.096c.5 0 .905-.405.905-.904 0-.715.211-1.413.608-2.008L17 13V4m-7 10h2m5-10h2a2 2 0 012 2v6a2 2 0 01-2 2h-2.5" />
            </svg>
            {isDisliked ? 'Disliked' : 'Dislike'}
          </motion.button>
        </div>
      </motion.div>

      {/* Block Confirmation Modal - Fixed positioning */}
      <AnimatePresence>
        {showBlockConfirmation && (
          <motion.div 
            className="fixed inset-0 backdrop-filter backdrop-blur-sm bg-black bg-opacity-30 flex items-center justify-center z-50 p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.2 }}
          >
            <motion.div 
              className="bg-white rounded-lg p-5 md:p-6 max-w-md w-full mx-auto shadow-xl"
              initial={{ opacity: 0, scale: 0.9, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.9, y: 20 }}
              transition={{ type: "spring", damping: 25, stiffness: 400 }}
            >
              <h3 className="text-lg md:text-xl font-bold mb-4">Confirm Block</h3>
              <p className="mb-6">Are you sure you want to block this blog? This action cannot be undone.</p>
              <div className="flex justify-end gap-3">
                <motion.button 
                  onClick={() => setShowBlockConfirmation(false)}
                  className="px-4 py-2 bg-gray-200 rounded-md hover:bg-gray-300 transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Cancel
                </motion.button>
                <motion.button 
                  onClick={handleBlockBlog}
                  className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 shadow-sm transition-all duration-300"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  Block Blog
                </motion.button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}