import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit, Trash2, Eye, EyeOff, ThumbsUp, ThumbsDown, Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import {userInstance} from '../../middleware/axios'; // Adjust path as needed

// Define interface for blog data
interface Author {
  _id: string;
  name: string;
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

// Confirmation Modal Component
const ConfirmationModal = ({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message 
}: { 
  isOpen: boolean; 
  onClose: () => void; 
  onConfirm: () => void; 
  title: string; 
  message: string 
}) => {
  if (!isOpen) return null;
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
      <motion.div 
        initial={{ opacity: 0, scale: 0.9 }}
        animate={{ opacity: 1, scale: 1 }}
        className="bg-white rounded-lg p-6 max-w-md w-full shadow-xl"
      >
        <h3 className="text-lg font-semibold text-gray-800 mb-2">{title}</h3>
        <p className="text-gray-600 mb-6">{message}</p>
        <div className="flex justify-end gap-3">
          <button 
            onClick={onClose}
            className="px-4 py-2 rounded-md text-gray-600 bg-gray-100 hover:bg-gray-200"
          >
            Cancel
          </button>
          <button 
            onClick={() => {
              onConfirm();
              onClose();
            }}
            className="px-4 py-2 rounded-md text-white bg-red-600 hover:bg-red-700"
          >
            Confirm
          </button>
        </div>
      </motion.div>
    </div>
  );
};

const MyBlogsTab: React.FC = () => {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [modal, setModal] = useState<{
    isOpen: boolean;
    title: string;
    message: string;
    onConfirm: () => void;
  }>({
    isOpen: false,
    title: "",
    message: "",
    onConfirm: () => {},
  });
  
  const navigate = useNavigate();

  useEffect(() => {
    fetchBlogs();
  }, []);

  const fetchBlogs = async () => {
    try {
      setLoading(true);
      const response = await userInstance.get("api/my-blogs/all-blogs");
      console.log("API response data:", response.data);
      
      // Check if response.data is an array before setting state
      if (Array.isArray(response.data)) {
        setBlogs(response.data);
      } else if (response.data && Array.isArray(response.data.blogs)) {
        // If blogs are nested in the response
        setBlogs(response.data.blogs);
      } else if (response.data && typeof response.data === 'object') {
        // Try to find an array property in the response
        const possibleBlogsArray = Object.values(response.data).find(val => Array.isArray(val));
        if (possibleBlogsArray) {
          setBlogs(possibleBlogsArray as Blog[]);
        } else {
          setBlogs([]);
          setError("Could not find blogs data in the server response.");
          console.error("API did not return blogs in expected format:", response.data);
        }
      } else {
        // If response.data is not an array or doesn't contain blogs array
        setBlogs([]);
        setError("Received invalid data format from server.");
        console.error("API did not return an array:", response.data);
      }
    } catch (err) {
      setBlogs([]); // Initialize with empty array on error
      setError("Failed to fetch blogs. Please try again later.");
      console.error("Error fetching blogs:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleTogglePublish = async (blog: Blog) => {
    setModal({
      isOpen: true,
      title: blog.isPublished ? "Unpublish Blog" : "Publish Blog",
      message: blog.isPublished 
        ? "Are you sure you want to unpublish this blog? It will no longer be visible to other users."
        : "Are you sure you want to publish this blog? It will be visible to other users.",
      onConfirm: async () => {
        try {
          await userInstance.patch("api/my-blogs/publish-status", {
            blogId: blog._id,
            isPublished: !blog.isPublished
          });
          // Update local state after successful API call
          setBlogs(prevBlogs => 
            prevBlogs.map(b => 
              b._id === blog._id ? {...b, isPublished: !b.isPublished} : b
            )
          );
        } catch (err) {
          console.error("Error updating publish status:", err);
          setError("Failed to update publish status. Please try again.");
        }
      }
    });
  };

  const handleDelete = (blog: Blog) => {
    setModal({
      isOpen: true,
      title: "Delete Blog",
      message: `Are you sure you want to delete "${blog.title}"? This action cannot be undone.`,
      onConfirm: async () => {
        try {
          await userInstance.delete(`api/my-blogs/blog/${blog._id}`);
          // Remove the blog from local state after successful deletion
          setBlogs(prevBlogs => prevBlogs.filter(b => b._id !== blog._id));
        } catch (err) {
          console.error("Error deleting blog:", err);
          setError("Failed to delete blog. Please try again.");
        }
      }
    });
  };

  const handleEdit = (blogId: string) => {
    console.log("Editing blog with ID:", blogId);
    
    navigate(`/user/edit-blog/${blogId}`);
  };

  const handleCreateNew = () => {
    navigate('/create-blog');
  };

  return (
    <div className="p-6">
      <div className="flex flex-wrap justify-between items-center mb-6">
        <motion.h2 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-2xl font-semibold text-indigo-800"
        >
          My Blogs
        </motion.h2>
        
        <motion.button 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="mt-4 sm:mt-0 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium px-4 py-2 rounded-lg shadow flex items-center"
          onClick={handleCreateNew}
        >
          <Plus size={18} className="mr-2" />
          Create New Blog
        </motion.button>
      </div>
      
      {/* Error Message */}
      {error && (
        <div className="mb-6 p-4 bg-red-50 border border-red-200 text-red-700 rounded-lg">
          {error}
        </div>
      )}
      
      {/* Loading State */}
      {loading ? (
        <div className="text-center py-16">
          <div className="inline-block h-8 w-8 animate-spin rounded-full border-4 border-solid border-indigo-600 border-r-transparent"></div>
          <p className="mt-4 text-gray-600">Loading your blogs...</p>
        </div>
      ) : Array.isArray(blogs) && blogs.length > 0 ? (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid gap-6"
        >
          <AnimatePresence>
            {blogs.map((blog) => (
              <motion.div 
                key={blog._id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0, overflow: 'hidden' }}
                className={`rounded-lg shadow-md overflow-hidden ${
                  !blog.isPublished ? 'bg-red-50 border border-red-200' : 'bg-white'
                }`}
              >
                <div className="p-5">
                  <div className="flex flex-wrap justify-between gap-2">
                    <div>
                      <h3 className="text-lg font-medium text-gray-800">{blog.title}</h3>
                      <p className="text-gray-600 text-sm mt-1">
                        {blog.content.length > 100 
                          ? `${blog.content.substring(0, 100)}...` 
                          : blog.content}
                      </p>
                      <div className="flex flex-wrap gap-2 mt-2">
                        {blog.tags && Array.isArray(blog.tags) && blog.tags.map((tag, index) => (
                          <span key={index} className="inline-block px-2 py-1 text-xs bg-indigo-100 text-indigo-800 rounded-full">
                            {tag}
                          </span>
                        ))}
                      </div>
                      <p className="text-gray-500 text-xs mt-2">
                        Created: {new Date(blog.createdAt).toLocaleDateString()}
                        {blog.createdAt !== blog.updatedAt && 
                          ` • Updated: ${new Date(blog.updatedAt).toLocaleDateString()}`}
                      </p>
                    </div>
                    
                    <div className="flex flex-wrap gap-4 items-start">
                      <div className="flex gap-3">
                        <span className="flex items-center text-green-600">
                          <ThumbsUp size={16} className="mr-1" />
                          {blog.likeCount}
                        </span>
                        <span className="flex items-center text-red-600">
                          <ThumbsDown size={16} className="mr-1" />
                          {blog.dislikeCount}
                        </span>
                      </div>
                      
                      <div className="flex gap-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-2 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100"
                          onClick={() => handleEdit(blog._id)}
                        >
                          <Edit size={16} />
                        </motion.button>
                        
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-2 rounded-full bg-red-50 text-red-600 hover:bg-red-100"
                          onClick={() => handleDelete(blog)}
                        >
                          <Trash2 size={16} />
                        </motion.button>
                        
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className={`p-2 rounded-full ${
                            !blog.isPublished 
                              ? 'bg-green-50 text-green-600 hover:bg-green-100' 
                              : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                          }`}
                          onClick={() => handleTogglePublish(blog)}
                        >
                          {!blog.isPublished ? <Eye size={16} /> : <EyeOff size={16} />}
                        </motion.button>
                      </div>
                    </div>
                  </div>
                  
                  {!blog.isPublished && (
                    <div className="mt-3 p-2 bg-red-100 text-red-800 text-sm rounded">
                      This blog is currently unpublished and not visible to users.
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      ) : (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16 text-gray-500"
        >
          No blogs found. Create your first blog to get started!
        </motion.div>
      )}
      
      {/* Confirmation Modal */}
      <ConfirmationModal
        isOpen={modal.isOpen}
        onClose={() => setModal({...modal, isOpen: false})}
        onConfirm={modal.onConfirm}
        title={modal.title}
        message={modal.message}
      />
    </div>
  );
};

export default MyBlogsTab;