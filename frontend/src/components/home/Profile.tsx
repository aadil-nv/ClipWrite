import React, { useState } from 'react';
import { motion } from 'framer-motion';
import ProfileDetailsTab from './ProfileDetailsTab';
import PasswordChangeTab from './PasswordChangeTab';
import MyBlogsTab from './MyBlogsTab';
import PreferencesTab from './PreferencesTab';

// Define the available tab types
type TabType = 'details' | 'password' | 'blogs' | 'preferences';

// The main dashboard component
const ProfileDashboard: React.FC = () => {
  const [activeTab, setActiveTab] = useState<TabType>('details');

  // Animation variants for tab transitions
  const tabVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.5 } }
  };

  return (
    <div className="max-w-6xl mx-auto p-6 bg-gray-50">
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="mb-8 text-center"
      >
        <h1 className="text-4xl font-bold text-indigo-800">Dashboard</h1>
        <p className="text-gray-600">Manage your content and settings</p>
      </motion.div>

      {/* Tab Navigation */}
      <div className="mb-6 bg-white rounded-lg shadow-md">
        <nav className="flex overflow-x-auto">
          <TabButton 
            active={activeTab === 'details'} 
            onClick={() => setActiveTab('details')}
            label="Profile Details"
          />
          <TabButton 
            active={activeTab === 'password'} 
            onClick={() => setActiveTab('password')}
            label="Change Password"
          />
          <TabButton 
            active={activeTab === 'blogs'} 
            onClick={() => setActiveTab('blogs')}
            label="My Blogs"
          />
          <TabButton 
            active={activeTab === 'preferences'} 
            onClick={() => setActiveTab('preferences')}
            label="Preferences"
          />
        </nav>
      </div>

      {/* Tab Content */}
      <motion.div
        key={activeTab}
        initial="hidden"
        animate="visible"
        variants={tabVariants}
        className="bg-white rounded-lg shadow-md"
      >
        {activeTab === 'details' && <ProfileDetailsTab />}
        {activeTab === 'password' && <PasswordChangeTab />}
        {activeTab === 'blogs' && <MyBlogsTab />}
        {activeTab === 'preferences' && <PreferencesTab />}
      </motion.div>
    </div>
  );
};

// Tab button component with animation
interface TabButtonProps {
  active: boolean;
  onClick: () => void;
  label: string;
}

const TabButton: React.FC<TabButtonProps> = ({ active, onClick, label }) => {
  return (
    <button 
      className={`px-6 py-4 font-medium relative ${
        active ? 'text-indigo-600' : 'text-gray-500 hover:text-indigo-400'
      }`}
      onClick={onClick}
    >
      {label}
      {active && (
        <motion.div 
          layoutId="activeTab"
          className="absolute bottom-0 left-0 right-0 h-1 bg-indigo-600"
        />
      )}
    </button>
  );
};

export default ProfileDashboard;