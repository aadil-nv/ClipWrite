import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface ProfileData {
  fullName: string;
  email: string;
  bio: string;
  phone: string;
}

const ProfileDetailsTab: React.FC = () => {
  const [profileData, setProfileData] = useState<ProfileData>({
    fullName: 'John Doe',
    email: 'john.doe@example.com',
    bio: 'Tech enthusiast and avid traveler. I write about my adventures and technology reviews.',
    phone: '(123) 456-7890'
  });

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    // Implementation for saving profile changes would go here
    console.log('Profile data saved:', profileData);
  };

  return (
    <div className="p-6">
      <motion.h2 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-2xl font-semibold mb-6 text-indigo-800"
      >
        Profile Details
      </motion.h2>
      
      <form onSubmit={handleSubmit}>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          <motion.div 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.1 }}
          >
            <label className="block text-indigo-700 mb-2 font-medium">Full Name</label>
            <input 
              type="text" 
              name="fullName"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500" 
              value={profileData.fullName}
              onChange={handleInputChange}
            />
          </motion.div>
          
          <motion.div 
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <label className="block text-indigo-700 mb-2 font-medium">Email</label>
            <input 
              type="email" 
              name="email"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500" 
              value={profileData.email}
              onChange={handleInputChange}
            />
          </motion.div>
          
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
            className="md:col-span-2"
          >
            <label className="block text-indigo-700 mb-2 font-medium">Bio</label>
            <textarea 
              name="bio"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500" 
              rows={4}
              value={profileData.bio}
              onChange={handleInputChange}
            />
          </motion.div>
          
          <motion.div 
            initial={{ y: 20, opacity: 0 }}
            animate={{ y: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <label className="block text-indigo-700 mb-2 font-medium">Phone</label>
            <input 
              type="text" 
              name="phone"
              className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500" 
              value={profileData.phone}
              onChange={handleInputChange}
            />
          </motion.div>
        </div>
        
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="mt-8 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
          type="submit"
        >
          Save Changes
        </motion.button>
      </form>
    </div>
  );
};

export default ProfileDetailsTab;