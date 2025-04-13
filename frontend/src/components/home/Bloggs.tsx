import  { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { userInstance } from '../../middleware/axios';
import { useNavigate } from 'react-router-dom';

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

interface BlogsProps {
  featuredBlog?: Blog;
}

interface ApiResponse {
  message: string;
  blogs: Blog[];
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1
    }
  }
};

const itemVariants = {
  hidden: { y: 20, opacity: 0 },
  visible: {
    y: 0,
    opacity: 1,
    transition: {
      type: "spring",
      stiffness: 100
    }
  }
};

export default function Blogs({ featuredBlog }: BlogsProps) {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const navigate = useNavigate();

  // Extract unique categories from blog preferences
  const getCategories = (blogs: Blog[]): string[] => {
    const allPreferences = blogs.flatMap(blog => blog.preference);
    const uniqueCategories = [...new Set(allPreferences)];
    return ['all', ...uniqueCategories];
  };

  // Fetch blogs from API
  useEffect(() => {
    const fetchBlogs = async () => {
      try {
        setIsLoading(true);
        const response = await userInstance.get<ApiResponse>('api/blog/all-blogs');
        setBlogs(response.data.blogs);
        setIsLoading(false);
      } catch (error) {
        console.error('Error fetching blogs:', error);
        setIsLoading(false);
      }
    };
    
    fetchBlogs();
  }, []);

  // Function to like a blog
  const handleLikeBlog = async (blogId: string) => {
    try {
      await userInstance.post(`api/blog/like/${blogId}`);
      // Refresh blogs to get updated like count
      const response = await userInstance.get<ApiResponse>('api/blog/all-blogs/');
      setBlogs(response.data.blogs);
    } catch (error) {
      console.error('Error liking blog:', error);
    }
  };

  // View single blog detail
  const viewBlogDetail = (blogId: string) => {
    navigate(`/user/blog/${blogId}`);
  };

  // Filter blogs by category
  const filteredBlogs = activeCategory === 'all' 
    ? blogs 
    : blogs.filter(blog => blog.preference.includes(activeCategory));

  // Featured blog (first blog if not provided)
  const displayedFeaturedBlog = featuredBlog || (blogs.length > 0 ? blogs[0] : null);
  
  // Format date to readable format
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  // Calculate read time based on content length (rough estimate)
  const calculateReadTime = (content: string): number => {
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
  };

  return (
    <div className="pt-20 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Hero Section with Featured Blog */}
      {displayedFeaturedBlog && !isLoading && (
        <motion.div 
          className="mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div 
            className="relative rounded-xl overflow-hidden cursor-pointer"
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.3 }}
            onClick={() => viewBlogDetail(displayedFeaturedBlog._id)}
          >
            <div className="aspect-w-16 aspect-h-9">
              <img 
                src={displayedFeaturedBlog.image} 
                alt={displayedFeaturedBlog.title}
                className="w-full h-64 md:h-96 object-cover"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-6">
              <div className="text-white">
                <div className="flex gap-2 mb-2">
                  {displayedFeaturedBlog.preference.slice(0, 3).map((pref, index) => (
                    <span key={index} className="bg-cyan-500 text-xs font-medium uppercase tracking-wider py-1 px-2 rounded-md">
                      {pref}
                    </span>
                  ))}
                </div>
                <h1 className="text-2xl md:text-4xl font-bold mt-2 mb-3">{displayedFeaturedBlog.title}</h1>
                <p className="text-gray-200 mb-4 max-w-2xl">
                  {displayedFeaturedBlog.content.length > 200 
                    ? `${displayedFeaturedBlog.content.substring(0, 200)}...` 
                    : displayedFeaturedBlog.content}
                </p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="h-8 w-8 bg-gray-300 rounded-full mr-3"></div>
                    <div>
                      <p className="text-sm font-medium">{displayedFeaturedBlog.author.name}</p>
                      <p className="text-xs text-gray-300">
                        {formatDate(displayedFeaturedBlog.createdAt)} · {calculateReadTime(displayedFeaturedBlog.content)} min read
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-3">
                    <button 
                      onClick={(e) => {
                        e.stopPropagation();
                        handleLikeBlog(displayedFeaturedBlog._id);
                      }}
                      className="flex items-center gap-1 bg-white/10 hover:bg-white/20 px-3 py-1 rounded-full"
                    >
                      <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                      </svg>
                      <span>{displayedFeaturedBlog.likeCount}</span>
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Category Filter */}
      {!isLoading && (
        <div className="mb-8">
          <div className="flex flex-wrap gap-2">
            {getCategories(blogs).map((category) => (
              <motion.button
                key={category}
                className={`px-4 py-2 rounded-md text-sm font-medium ${
                  activeCategory === category 
                    ? 'bg-teal-600 text-white' 
                    : 'bg-gray-100 text-gray-800 hover:bg-gray-200'
                }`}
                onClick={() => setActiveCategory(category)}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
              >
                {category.charAt(0).toUpperCase() + category.slice(1)}
              </motion.button>
            ))}
          </div>
        </div>
      )}

      {/* Blog Posts Grid */}
      {isLoading ? (
        <div className="flex justify-center items-center h-64">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-500"></div>
        </div>
      ) : (
        <motion.div 
          className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate="visible"
        >
          {filteredBlogs.map((blog) => (
            <BlogCard 
              key={blog._id} 
              blog={blog} 
              onLike={handleLikeBlog} 
              onClick={() => viewBlogDetail(blog._id)} 
              formatDate={formatDate}
              calculateReadTime={calculateReadTime}
            />
          ))}
        </motion.div>
      )}

      {/* No Results */}
      {!isLoading && filteredBlogs.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-xl font-medium text-gray-600">No blogs found in this category</h3>
          <button 
            className="mt-4 px-4 py-2 bg-teal-600 text-white rounded-md font-medium"
            onClick={() => setActiveCategory('all')}
          >
            View all blogs
          </button>
        </div>
      )}
    </div>
  );
}

// BlogCard component for individual blog items
interface BlogCardProps {
  blog: Blog;
  onLike: (blogId: string) => void;
  onClick: () => void;
  formatDate: (date: string) => string;
  calculateReadTime: (content: string) => number;
}

function BlogCard({ blog, onLike, onClick, formatDate, calculateReadTime }: BlogCardProps) {
  const { _id, title, content, author, preference, image, likeCount, createdAt } = blog;
  
  return (
    <motion.div 
      className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer"
      variants={itemVariants} // Now this is accessible since itemVariants is defined outside
      whileHover={{ y: -5 }}
      onClick={onClick}
    >
      <img 
        src={image} 
        alt={title}
        className="h-48 w-full object-cover"
      />
      <div className="p-6">
        <div className="flex justify-between items-center mb-3">
          <div className="flex gap-1 flex-wrap">
            {preference.slice(0, 2).map((pref, index) => (
              <span key={index} className="bg-gray-100 text-teal-800 text-xs font-medium px-2 py-1 rounded-md mr-1">
                {pref}
              </span>
            ))}
            {preference.length > 2 && (
              <span className="bg-gray-100 text-gray-600 text-xs font-medium px-2 py-1 rounded-md">
                +{preference.length - 2}
              </span>
            )}
          </div>
          <span className="text-gray-500 text-xs">{calculateReadTime(content)} min read</span>
        </div>
        <h3 className="text-xl font-bold mb-2">{title}</h3>
        <p className="text-gray-600 mb-4 text-sm">
          {content.length > 100 ? `${content.substring(0, 100)}...` : content}
        </p>
        <div className="flex items-center justify-between">
          <div className="flex items-center">
            <div className="h-6 w-6 bg-gray-300 rounded-full mr-2"></div>
            <span className="text-xs text-gray-600">{author.name}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="text-xs text-gray-500">{formatDate(createdAt)}</span>
            <button 
              onClick={(e) => {
                e.stopPropagation();
                onLike(_id);
              }}
              className="flex items-center gap-1 text-gray-500 hover:text-teal-600"
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
              </svg>
              <span className="text-xs">{likeCount}</span>
            </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}