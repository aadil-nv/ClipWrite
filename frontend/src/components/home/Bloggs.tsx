import React, { useState, useEffect } from 'react';
import { motion } from 'framer-motion';

// Define proper TypeScript interfaces
interface BlogPost {
  id: string;
  title: string;
  excerpt: string;
  content: string;
  author: {
    name: string;
    avatarUrl: string;
  };
  publishDate: string;
  category: string;
  tags: string[];
  imageUrl: string;
  readTime: number;
}

interface BlogsProps {
  featuredPost?: BlogPost;
  initialPosts?: BlogPost[];
  loading?: boolean;
}

export default function Blogs({
  featuredPost,
  initialPosts = [],
  loading = false
}: BlogsProps) {
  const [posts, setPosts] = useState<BlogPost[]>(initialPosts);
  const [isLoading, setIsLoading] = useState<boolean>(loading);
  const [activeCategory, setActiveCategory] = useState<string>('all');

  // Example categories for filtering
  const categories: string[] = ['all', 'tutorials', 'reviews', 'inspiration', 'tech'];

  // Animation variants
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

  // Demo blog posts
  const samplePosts: BlogPost[] = [
    {
      id: '1',
      title: 'How to Create Engaging Video Content in 2025',
      excerpt: 'Learn the top strategies for creating videos that stand out in todays crowded digital landscape.',
      content: 'Long form content goes here...',
      author: {
        name: 'Alex Johnson',
        avatarUrl: '/avatars/alex.jpg'
      },
      publishDate: 'April 5, 2025',
      category: 'tutorials',
      tags: ['video editing', 'content creation', 'engagement'],
      imageUrl: '/api/placeholder/800/400',
      readTime: 8
    },
    {
      id: '2',
      title: 'Best Video Editing Software for Beginners',
      excerpt: 'A comprehensive comparison of the most user-friendly video editing tools available today.',
      content: 'Long form content goes here...',
      author: {
        name: 'Samantha Lee',
        avatarUrl: '/avatars/samantha.jpg'
      },
      publishDate: 'March 25, 2025',
      category: 'reviews',
      tags: ['software', 'beginner', 'video editing'],
      imageUrl: '/api/placeholder/800/400',
      readTime: 6
    },
    {
      id: '3',
      title: '5 Lighting Techniques That Will Transform Your Videos',
      excerpt: 'Discover how proper lighting can dramatically improve the quality of your video production.',
      content: 'Long form content goes here...',
      author: {
        name: 'Michael Torres',
        avatarUrl: '/avatars/michael.jpg'
      },
      publishDate: 'March 18, 2025',
      category: 'tutorials',
      tags: ['lighting', 'production', 'cinematography'],
      imageUrl: '/api/placeholder/800/400',
      readTime: 10
    },
    {
      id: '4',
      title: 'Content Monetization Strategies for 2025',
      excerpt: 'Explore the latest methods for turning your video content into a sustainable income stream.',
      content: 'Long form content goes here...',
      author: {
        name: 'Priya Sharma',
        avatarUrl: '/avatars/priya.jpg'
      },
      publishDate: 'March 10, 2025',
      category: 'inspiration',
      tags: ['monetization', 'business', 'strategy'],
      imageUrl: '/api/placeholder/800/400',
      readTime: 12
    },
    {
      id: '5',
      title: 'AI Tools Revolutionizing Video Creation',
      excerpt: 'See how artificial intelligence is changing the way creators produce and edit video content.',
      content: 'Long form content goes here...',
      author: {
        name: 'David Chen',
        avatarUrl: '/avatars/david.jpg'
      },
      publishDate: 'March 3, 2025',
      category: 'tech',
      tags: ['AI', 'technology', 'future'],
      imageUrl: '/api/placeholder/800/400',
      readTime: 9
    },
    {
      id: '6',
      title: 'Building Your Personal Brand Through Video',
      excerpt: 'Learn how to create a consistent and memorable brand identity with your video content.',
      content: 'Long form content goes here...',
      author: {
        name: 'Jordan Williams',
        avatarUrl: '/avatars/jordan.jpg'
      },
      publishDate: 'February 25, 2025',
      category: 'inspiration',
      tags: ['branding', 'personal development', 'marketing'],
      imageUrl: '/api/placeholder/800/400',
      readTime: 7
    }
  ];

  // Use effect to simulate data fetching
  useEffect(() => {
    setIsLoading(true);
    
    // Simulate API call
    const fetchPosts = () => {
      setTimeout(() => {
        setPosts(samplePosts);
        setIsLoading(false);
      }, 1000);
    };
    
    fetchPosts();
  }, []);

  // Filter posts by category
  const filteredPosts = activeCategory === 'all' 
    ? posts 
    : posts.filter(post => post.category === activeCategory);

  // Featured post (first post if not provided)
  const displayedFeaturedPost = featuredPost || (posts.length > 0 ? posts[0] : null);
  
  return (
    <div className="pt-20 pb-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto">
      {/* Hero Section with Featured Post */}
      {displayedFeaturedPost && !isLoading && (
        <motion.div 
          className="mb-16"
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
        >
          <motion.div 
            className="relative rounded-xl overflow-hidden"
            whileHover={{ scale: 1.01 }}
            transition={{ duration: 0.3 }}
          >
            <div className="aspect-w-16 aspect-h-9">
              <img 
                src={displayedFeaturedPost.imageUrl} 
                alt={displayedFeaturedPost.title}
                className="w-full h-64 md:h-96 object-cover"
              />
            </div>
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 to-transparent flex flex-col justify-end p-6">
              <div className="text-white">
                <span className="bg-cyan-500 text-xs font-medium uppercase tracking-wider py-1 px-2 rounded-md">
                  {displayedFeaturedPost.category}
                </span>
                <h1 className="text-2xl md:text-4xl font-bold mt-2 mb-3">{displayedFeaturedPost.title}</h1>
                <p className="text-gray-200 mb-4 max-w-2xl">{displayedFeaturedPost.excerpt}</p>
                <div className="flex items-center">
                  <div className="h-8 w-8 bg-gray-300 rounded-full mr-3"></div>
                  <div>
                    <p className="text-sm font-medium">{displayedFeaturedPost.author.name}</p>
                    <p className="text-xs text-gray-300">
                      {displayedFeaturedPost.publishDate} · {displayedFeaturedPost.readTime} min read
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </motion.div>
      )}

      {/* Category Filter */}
      <div className="mb-8">
        <div className="flex flex-wrap gap-2">
          {categories.map((category) => (
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
          {filteredPosts.map((post) => (
            <motion.div 
              key={post.id}
              className="bg-white rounded-xl overflow-hidden shadow-md hover:shadow-lg transition-shadow duration-300"
              variants={itemVariants}
              whileHover={{ y: -5 }}
            >
              <img 
                src={post.imageUrl} 
                alt={post.title}
                className="h-48 w-full object-cover"
              />
              <div className="p-6">
                <div className="flex justify-between items-center mb-3">
                  <span className="bg-gray-100 text-teal-800 text-xs font-medium px-2 py-1 rounded-md">
                    {post.category}
                  </span>
                  <span className="text-gray-500 text-xs">{post.readTime} min read</span>
                </div>
                <h3 className="text-xl font-bold mb-2">{post.title}</h3>
                <p className="text-gray-600 mb-4 text-sm">{post.excerpt}</p>
                <div className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div className="h-6 w-6 bg-gray-300 rounded-full mr-2"></div>
                    <span className="text-xs text-gray-600">{post.author.name}</span>
                  </div>
                  <span className="text-xs text-gray-500">{post.publishDate}</span>
                </div>
              </div>
            </motion.div>
          ))}
        </motion.div>
      )}

      {/* No Results */}
      {!isLoading && filteredPosts.length === 0 && (
        <div className="text-center py-12">
          <h3 className="text-xl font-medium text-gray-600">No posts found in this category</h3>
          <button 
            className="mt-4 px-4 py-2 bg-teal-600 text-white rounded-md font-medium"
            onClick={() => setActiveCategory('all')}
          >
            View all posts
          </button>
        </div>
      )}
    </div>
  );
}