import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { userInstance } from '../../middleware/axios';
import { useNavigate } from 'react-router-dom';
import { fetchAllBlogs } from '../../api/blog.api';
import { ApiResponse, Blog, BlogCardProps, BlogsProps } from '../../interfaces/blog.interface';
import { containerVariants, itemVariants } from '../../utils/variants';




export default function Blogs({ featuredBlog }: BlogsProps) {
  const [blogs, setBlogs] = useState<Blog[]>([]);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [activeCategory, setActiveCategory] = useState<string>('all');
  const navigate = useNavigate();

  const [currentPage, setCurrentPage] = useState<number>(1);
  const [blogsPerPage] = useState<number>(6);
    const getCategories = (blogs: Blog[]): string[] => {
    const allPreferences = blogs.flatMap(blog => blog.preference);
    const uniqueCategories = [...new Set(allPreferences)];
    return ['all', ...uniqueCategories];
  };

  useEffect(() => {
    const getBlogs = async () => {
      try {
        setIsLoading(true);
        const blogsData = await fetchAllBlogs();
        setBlogs(blogsData);
      } catch (error) {
        console.error('Error fetching blogs:', error);
      } finally {
        setIsLoading(false);
      }
    };

    getBlogs();
  }, []);

  const handleLikeBlog = async (blogId: string) => {
    try {
      await userInstance.patch(`api/blog/like/${blogId}`);
      const response = await userInstance.get<ApiResponse>('api/blog/all-blogs/');
      setBlogs(response.data.blogs);
    } catch (error) {
      console.error('Error liking blog:', error);
    }
  };

  const viewBlogDetail = (blogId: string) => {
    navigate(`/user/blog/${blogId}`);
  };

  const filteredBlogs = activeCategory === 'all' 
    ? blogs 
    : blogs.filter(blog => blog.preference.includes(activeCategory));
  
  useEffect(() => {
    setCurrentPage(1);
  }, [activeCategory]);

  const indexOfLastBlog = currentPage * blogsPerPage;
  const indexOfFirstBlog = indexOfLastBlog - blogsPerPage;
  const currentBlogs = filteredBlogs.slice(indexOfFirstBlog, indexOfLastBlog);

  const totalPages = Math.ceil(filteredBlogs.length / blogsPerPage);

  const paginate = (pageNumber: number) => setCurrentPage(pageNumber);

  const displayedFeaturedBlog = featuredBlog || (blogs.length > 0 ? blogs[0] : null);
  
  const formatDate = (dateString: string): string => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' });
  };

  const calculateReadTime = (content: string): number => {
    const wordsPerMinute = 200;
    const wordCount = content.split(/\s+/).length;
    return Math.max(1, Math.ceil(wordCount / wordsPerMinute));
  };

  return (
    <div className="pt-20 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
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
                    <div className="h-8 w-8 bg-gray-300 rounded-full mr-3">
                      <img 
                        src={displayedFeaturedBlog.author.image} 
                        alt={displayedFeaturedBlog.author.name}
                        className="w-full h-full object-cover rounded-full"
                      />
                    </div>
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
          {currentBlogs.map((blog) => (
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

      {/* Pagination */}
      {!isLoading && filteredBlogs.length > 0 && (
        <div className="mt-12 flex justify-center">
          <nav className="flex items-center">
            <button 
              onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
              disabled={currentPage === 1}
              className={`mx-1 px-3 py-2 rounded-md ${
                currentPage === 1 
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M12.707 5.293a1 1 0 010 1.414L9.414 10l3.293 3.293a1 1 0 01-1.414 1.414l-4-4a1 1 0 010-1.414l4-4a1 1 0 011.414 0z" clipRule="evenodd" />
              </svg>
            </button>
            
            {/* Page Numbers */}
            <div className="flex">
              {[...Array(totalPages)].map((_, index) => {
                const pageNumber = index + 1;
                
                // Show first page, current page, last page, and one page before and after current
                const isFirstPage = pageNumber === 1;
                const isLastPage = pageNumber === totalPages;
                const isCurrentPage = pageNumber === currentPage;
                const isAdjacentToCurrent = Math.abs(pageNumber - currentPage) === 1;
                
                // Only render the page numbers we want to show
                if (isFirstPage || isLastPage || isCurrentPage || isAdjacentToCurrent) {
                  return (
                    <motion.button
                      key={pageNumber}
                      onClick={() => paginate(pageNumber)}
                      whileHover={{ scale: 1.05 }}
                      whileTap={{ scale: 0.95 }}
                      className={`mx-1 w-10 h-10 flex items-center justify-center rounded-md ${
                        isCurrentPage 
                          ? 'bg-teal-600 text-white' 
                          : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                      }`}
                    >
                      {pageNumber}
                    </motion.button>
                  );
                }
                
                // Show ellipsis for gaps
                if ((pageNumber === 2 && currentPage > 3) || 
                    (pageNumber === totalPages - 1 && currentPage < totalPages - 2)) {
                  return (
                    <span key={`ellipsis-${pageNumber}`} className="mx-1 px-3 py-2">
                      ...
                    </span>
                  );
                }
                
                // Don't render this page number
                return null;
              })}
            </div>
            
            <button 
              onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
              disabled={currentPage === totalPages}
              className={`mx-1 px-3 py-2 rounded-md ${
                currentPage === totalPages 
                  ? 'bg-gray-100 text-gray-400 cursor-not-allowed' 
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M7.293 14.707a1 1 0 010-1.414L10.586 10 7.293 6.707a1 1 0 011.414-1.414l4 4a1 1 0 010 1.414l-4 4a1 1 0 01-1.414 0z" clipRule="evenodd" />
              </svg>
            </button>
          </nav>
        </div>
      )}
      
      {/* Page Info Text */}
      {!isLoading && filteredBlogs.length > 0 && (
        <div className="mt-4 text-center text-sm text-gray-500">
          Showing {indexOfFirstBlog + 1} to {Math.min(indexOfLastBlog, filteredBlogs.length)} of {filteredBlogs.length} blogs
        </div>
      )}
    </div>
  );
}


function BlogCard({ blog, onLike, onClick, formatDate, calculateReadTime }: BlogCardProps) {
  const { _id, title, content, author, preference, image, likeCount, createdAt } = blog;
  
  return (
    <motion.div 
      className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300 cursor-pointer"
      variants={itemVariants}
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
            <div className="h-6 w-6 bg-gray-300 rounded-full mr-2">
              <img 
                src={author.image} 
                alt={author.name}
                className="h-full w-full object-cover"
              />
            </div>
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