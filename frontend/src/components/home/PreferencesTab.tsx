import React, { useState } from 'react';
import { motion } from 'framer-motion';

interface UserPreferences {
  darkMode: boolean;
  notifications: boolean;
  emailUpdates: boolean;
  contentCategories: string[];
  privacySettings: {
    profileVisibility: 'public' | 'friends' | 'private';
    showOnlineStatus: boolean;
  };
}

const PreferencesTab: React.FC = () => {
  const [preferences, setPreferences] = useState<UserPreferences>({
    darkMode: true,
    notifications: true,
    emailUpdates: false,
    contentCategories: ['Technology', 'Travel', 'Food'],
    privacySettings: {
      profileVisibility: 'public',
      showOnlineStatus: true
    }
  });

  // Available content categories
  const availableCategories = [
    'Technology', 'Travel', 'Food', 'Fashion', 'Sports', 
    'Health', 'Education', 'Entertainment', 'Business', 'Art'
  ];

  const toggleCategory = (category: string): void => {
    if (preferences.contentCategories.includes(category)) {
      setPreferences({
        ...preferences,
        contentCategories: preferences.contentCategories.filter(c => c !== category)
      });
    } else {
      setPreferences({
        ...preferences,
        contentCategories: [...preferences.contentCategories, category]
      });
    }
  };

  const handleCheckboxChange = (e: React.ChangeEvent<HTMLInputElement>): void => {
    const { name, checked } = e.target;
    setPreferences(prev => ({
      ...prev,
      [name]: checked
    }));
  };

  const handlePrivacyChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>): void => {
    const { name, value, type } = e.target;
    const checked = type === 'checkbox' ? (e.target as HTMLInputElement).checked : undefined;
    
    setPreferences(prev => ({
      ...prev,
      privacySettings: {
        ...prev.privacySettings,
        [name]: checked !== undefined ? checked : value
      }
    }));
  };

  const handleSave = () => {
    // Save preferences logic would go here
    console.log('Preferences saved:', preferences);
  };

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
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className="p-6">
      <motion.h2 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="text-2xl font-semibold mb-6 text-indigo-800"
      >
        Preferences
      </motion.h2>
      
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate="visible"
        className="space-y-8"
      >
        {/* App Settings Section */}
        <motion.div variants={itemVariants} className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-medium mb-4 text-indigo-700">App Settings</h3>
          <div className="space-y-3">
            <div className="flex items-center">
              <input 
                type="checkbox" 
                id="darkMode" 
                name="darkMode"
                className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" 
                checked={preferences.darkMode}
                onChange={handleCheckboxChange}
              />
              <label htmlFor="darkMode" className="ml-3 text-gray-700">Dark Mode</label>
            </div>
            
            <div className="flex items-center">
              <input 
                type="checkbox" 
                id="notifications" 
                name="notifications"
                className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" 
                checked={preferences.notifications}
                onChange={handleCheckboxChange}
              />
              <label htmlFor="notifications" className="ml-3 text-gray-700">Push Notifications</label>
            </div>
            
            <div className="flex items-center">
              <input 
                type="checkbox" 
                id="emailUpdates" 
                name="emailUpdates"
                className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" 
                checked={preferences.emailUpdates}
                onChange={handleCheckboxChange}
              />
              <label htmlFor="emailUpdates" className="ml-3 text-gray-700">Email Updates</label>
            </div>
          </div>
        </motion.div>
        
        {/* Content Preferences Section */}
        <motion.div variants={itemVariants} className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-medium mb-4 text-indigo-700">Content Preferences</h3>
          <p className="text-gray-600 mb-4">Select categories you're interested in:</p>
          
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-3">
            {availableCategories.map(category => (
              <motion.div 
                key={category}
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className={`px-4 py-2 rounded-full cursor-pointer transition-colors duration-200 text-center ${
                  preferences.contentCategories.includes(category)
                    ? 'bg-indigo-600 text-white'
                    : 'bg-gray-200 text-gray-700 hover:bg-gray-300'
                }`}
                onClick={() => toggleCategory(category)}
              >
                {category}
              </motion.div>
            ))}
          </div>
        </motion.div>
        
        {/* Privacy Settings Section */}
        <motion.div variants={itemVariants} className="bg-gray-50 p-6 rounded-lg">
          <h3 className="text-lg font-medium mb-4 text-indigo-700">Privacy Settings</h3>
          
          <div className="space-y-4">
            <div>
              <label htmlFor="profileVisibility" className="block text-gray-700 mb-2">
                Profile Visibility
              </label>
              <select
                id="profileVisibility"
                name="profileVisibility"
                className="w-full border border-gray-300 rounded-lg px-4 py-2 focus:outline-none focus:ring-2 focus:ring-indigo-500"
                value={preferences.privacySettings.profileVisibility}
                onChange={handlePrivacyChange}
              >
                <option value="public">Public (Everyone can see)</option>
                <option value="friends">Friends Only</option>
                <option value="private">Private (Only me)</option>
              </select>
            </div>
            
            <div className="flex items-center">
              <input 
                type="checkbox" 
                id="showOnlineStatus" 
                name="showOnlineStatus"
                className="h-5 w-5 text-indigo-600 focus:ring-indigo-500 border-gray-300 rounded" 
                checked={preferences.privacySettings.showOnlineStatus}
                onChange={handlePrivacyChange}
              />
              <label htmlFor="showOnlineStatus" className="ml-3 text-gray-700">
                Show Online Status
              </label>
            </div>
          </div>
        </motion.div>
        
        {/* Save Button */}
        <motion.div 
          variants={itemVariants}
          className="flex justify-center"
        >
          <motion.button 
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className="bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium px-8 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300"
            onClick={handleSave}
          >
            Save Preferences
          </motion.button>
        </motion.div>
      </motion.div>
    </div>
  );
};

export default PreferencesTab;