import React, { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Edit, Trash2, Eye, EyeOff, ThumbsUp, ThumbsDown, Plus } from 'lucide-react';

// Define interface for vlog data
interface VlogPost {
  id: number;
  title: string;
  description: string;
  dateCreated: string;
  likes: number;
  dislikes: number;
  blocked: boolean;
}

const MyVlogsTab: React.FC = () => {
  const [vlogs, setVlogs] = useState<VlogPost[]>([
    { 
      id: 1, 
      title: 'Cooking Tutorial: Italian Pasta', 
      description: 'Learn how to make authentic Italian pasta from scratch',
      dateCreated: '2025-03-15',
      likes: 145, 
      dislikes: 12, 
      blocked: false 
    },
    { 
      id: 2, 
      title: 'Tokyo City Tour', 
      description: 'Experience the bustling streets of Tokyo in this virtual tour',
      dateCreated: '2025-02-28',
      likes: 89, 
      dislikes: 7, 
      blocked: false 
    },
    { 
      id: 3, 
      title: 'Home Workout Routine', 
      description: 'A 30-minute full body workout you can do at home',
      dateCreated: '2025-01-10',
      likes: 212, 
      dislikes: 15, 
      blocked: true 
    }
  ]);

  const handleToggleBlock = (id: number): void => {
    setVlogs(vlogs.map(vlog => 
      vlog.id === id ? {...vlog, blocked: !vlog.blocked} : vlog
    ));
  };

  const handleDelete = (id: number): void => {
    setVlogs(vlogs.filter(vlog => vlog.id !== id));
  };

  return (
    <div className="p-6">
      <div className="flex flex-wrap justify-between items-center mb-6">
        <motion.h2 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-2xl font-semibold text-indigo-800"
        >
          My Vlogs
        </motion.h2>
        
        <motion.button 
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="mt-4 sm:mt-0 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium px-4 py-2 rounded-lg shadow flex items-center"
        >
          <Plus size={18} className="mr-2" />
          Create New Vlog
        </motion.button>
      </div>
      
      {vlogs.length === 0 ? (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="text-center py-16 text-gray-500"
        >
          No vlogs found. Create your first vlog to get started!
        </motion.div>
      ) : (
        <motion.div 
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="grid gap-6"
        >
          <AnimatePresence>
            {vlogs.map((vlog) => (
              <motion.div 
                key={vlog.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, height: 0, overflow: 'hidden' }}
                className={`rounded-lg shadow-md overflow-hidden ${
                  vlog.blocked ? 'bg-red-50 border border-red-200' : 'bg-white'
                }`}
              >
                <div className="p-5">
                  <div className="flex flex-wrap justify-between gap-2">
                    <div>
                      <h3 className="text-lg font-medium text-gray-800">{vlog.title}</h3>
                      <p className="text-gray-600 text-sm mt-1">{vlog.description}</p>
                      <p className="text-gray-500 text-xs mt-2">Created: {vlog.dateCreated}</p>
                    </div>
                    
                    <div className="flex flex-wrap gap-4 items-start">
                      <div className="flex gap-3">
                        <span className="flex items-center text-green-600">
                          <ThumbsUp size={16} className="mr-1" />
                          {vlog.likes}
                        </span>
                        <span className="flex items-center text-red-600">
                          <ThumbsDown size={16} className="mr-1" />
                          {vlog.dislikes}
                        </span>
                      </div>
                      
                      <div className="flex gap-2">
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-2 rounded-full bg-blue-50 text-blue-600 hover:bg-blue-100"
                        >
                          <Edit size={16} />
                        </motion.button>
                        
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className="p-2 rounded-full bg-red-50 text-red-600 hover:bg-red-100"
                          onClick={() => handleDelete(vlog.id)}
                        >
                          <Trash2 size={16} />
                        </motion.button>
                        
                        <motion.button
                          whileHover={{ scale: 1.1 }}
                          whileTap={{ scale: 0.9 }}
                          className={`p-2 rounded-full ${
                            vlog.blocked 
                              ? 'bg-green-50 text-green-600 hover:bg-green-100' 
                              : 'bg-gray-50 text-gray-600 hover:bg-gray-100'
                          }`}
                          onClick={() => handleToggleBlock(vlog.id)}
                        >
                          {vlog.blocked ? <Eye size={16} /> : <EyeOff size={16} />}
                        </motion.button>
                      </div>
                    </div>
                  </div>
                  
                  {vlog.blocked && (
                    <div className="mt-3 p-2 bg-red-100 text-red-800 text-sm rounded">
                      This vlog is currently blocked and not visible to users.
                    </div>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      )}
    </div>
  );
};

export default MyVlogsTab;