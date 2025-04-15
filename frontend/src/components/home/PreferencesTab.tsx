import  { useState } from 'react';
import { useDispatch } from 'react-redux';
import useAuth from '../../hooks/useAuth';
import { userInstance } from '../../middleware/axios';
import { updateUserData } from '../../redux/slices/userSlice';

export default function PreferencesTab() {
  const { user } = useAuth();
  const dispatch = useDispatch();
  
  // Initialize state with user preferences or empty array
  const [selectedPreferences, setSelectedPreferences] = useState<string[]>(
    user?.userData?.preferences && Array.isArray(user.userData.preferences) 
      ? user.userData.preferences 
      : []
  );
  
  const [isLoading, setIsLoading] = useState(false);
  const [message, setMessage] = useState({ text: '', type: '' });
  
  // Available categories list
  const availableCategories = [
    'travel', 'food', 'lifestyle', 'fitness', 'technology',
    'gaming', 'fashion', 'education', 'music', 'daily routine',
  ];

  // Toggle preference selection
  const togglePreference = (category: string) => {
    if (selectedPreferences.includes(category)) {
      setSelectedPreferences(selectedPreferences.filter(pref => pref !== category));
    } else {
      setSelectedPreferences([...selectedPreferences, category]);
    }
  };

  // Check if a category is selected
  const isSelected = (category: string) => {
    return selectedPreferences.includes(category);
  };

  // Save preferences to API
  const savePreferences = async () => {
    setIsLoading(true);
    setMessage({ text: '', type: '' });
    
    try {
      await userInstance.post('api/profile/preferences', {
        preferences: selectedPreferences
      });
      
      // Update Redux store
      dispatch(updateUserData({
        userData: {
          ...user.userData,
          preferences: selectedPreferences
        }
      }));
      
      setMessage({ 
        text: 'Preferences saved successfully!', 
        type: 'success' 
      });
      
    } catch (error) {
      console.error('Error saving preferences:', error);
      setMessage({ 
        text: 'Failed to save preferences. Please try again.', 
        type: 'error' 
      });
    } finally {
      setIsLoading(false);
      
      // Clear message after 5 seconds
      setTimeout(() => {
        setMessage({ text: '', type: '' });
      }, 5000);
    }
  };

  return (
    <div className="p-6 max-w-4xl mx-auto">
      <h2 className="text-2xl font-bold mb-6 text-gray-800">Content Preferences</h2>
      
      {/* Status message */}
      {message.text && (
        <div className={`mb-6 p-4 rounded-md ${
          message.type === 'success' ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'
        }`}>
          {message.text}
        </div>
      )}
      
      <div className="mb-8">
        <h3 className="text-lg font-medium mb-3 text-gray-700">Select your interests:</h3>
        <p className="text-gray-600 mb-6">Choose categories that match your content interests.</p>
        
        {/* Categories grid */}
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-4">
          {availableCategories.map(category => (
            <button
              key={category}
              onClick={() => togglePreference(category)}
              className={`px-4 py-3 rounded-lg transition-all duration-200 ${
                isSelected(category)
                  ? 'bg-blue-600 text-white shadow-md'
                  : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
              }`}
            >
              {category}
            </button>
          ))}
        </div>
      </div>
      
      {/* Selected preferences section */}
      <div className="mb-8">
        <h3 className="text-lg font-medium mb-3 text-gray-700">Your selected preferences:</h3>
        
        {selectedPreferences.length > 0 ? (
          <div className="flex flex-wrap gap-2">
            {selectedPreferences.map(pref => (
              <span 
                key={pref} 
                className="bg-blue-100 text-blue-800 px-3 py-1 rounded-full text-sm"
              >
                {pref}
              </span>
            ))}
          </div>
        ) : (
          <p className="text-gray-500 italic">No preferences selected yet.</p>
        )}
      </div>
      
      {/* Save button */}
      <div className="flex justify-center mt-8">
        <button
          onClick={savePreferences}
          disabled={isLoading}
          className={`px-8 py-3 bg-blue-600 text-white rounded-lg font-medium transition-all ${
            isLoading 
              ? 'opacity-70 cursor-not-allowed' 
              : 'hover:bg-blue-700 hover:shadow-lg'
          }`}
        >
          {isLoading ? 'Saving...' : 'Save Preferences'}
        </button>
      </div>
    </div>
  );
}