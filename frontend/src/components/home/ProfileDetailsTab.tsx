import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { uploadToCloudinary } from '../../api/cloudinary.api';
import { useSelector, useDispatch } from 'react-redux';
import { updateUserData } from '../../redux/slices/userSlice';
import { userInstance } from '../../middleware/axios';

// Define proper types for Redux state
interface RootState {
  user: {
    userData: UserData;
  };
}

interface UserData {
  name: string | null;
  email: string | null;
  mobile: string | null;
  dob: string | null;
  image?: string;
  preferences?: string[]; // Updated to string array
}

interface ProfileData {
  name: string;
  email: string;
  mobile: string;
  dob: string;
  image: File | null;
  imageUrl?: string;
}

const ProfileDetailsTab: React.FC = () => {
  const dispatch = useDispatch();
  const userData = useSelector((state: RootState) => state.user.userData);
  
  const [profileData, setProfileData] = useState<ProfileData>({
    name: '',
    email: '',
    mobile: '',
    dob: '',
    image: null
  });

  const [previewImage, setPreviewImage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [isUploading, setIsUploading] = useState<boolean>(false);
  const [uploadProgress, setUploadProgress] = useState<number>(0);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  // Format ISO date string to YYYY-MM-DD for input[type="date"]
  const formatDateForInput = (dateString: string | null): string => {
    if (!dateString) return '';
    try {
      const date = new Date(dateString);
      return date.toISOString().split('T')[0];
    } catch (error) {
      console.log('Error formatting date:', error);
      
      return '';
    }
  };

  // Populate form with user data when available
  useEffect(() => {
    if (userData) {
      setProfileData({
        name: userData.name || '',
        email: userData.email || '',
        mobile: userData.mobile || '',
        dob: formatDateForInput(userData.dob),
        image: null,
        imageUrl: userData.image
      });
      
      if (userData.image) {
        setPreviewImage(userData.image);
      }
    }
  }, [userData]);

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setProfileData(prev => ({
      ...prev,
      [name]: value
    }));
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Validate file
    if (file.size > 5 * 1024 * 1024) {
      setErrorMessage('Image size should be less than 5MB');
      return;
    }
    
    if (!file.type.includes('image/')) {
      setErrorMessage('Please upload a valid image file');
      return;
    }

    setProfileData(prev => ({ ...prev, image: file }));
    
    // Create URL for preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result as string);
    };
    reader.readAsDataURL(file);
    
    setErrorMessage(null);
    
    // Upload to Cloudinary
    try {
      setIsUploading(true);
      
      // Simulate upload progress
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => prev >= 90 ? 90 : prev + 10);
      }, 300);
      
      const imageUrl = await uploadToCloudinary(file);
      clearInterval(progressInterval);
      setUploadProgress(100);
      
      setProfileData(prev => ({ ...prev, imageUrl }));
      
      setTimeout(() => {
        setIsUploading(false);
        setUploadProgress(0);
      }, 500);
      
    } catch (error) {
      console.error('Error uploading image:', error);
      setErrorMessage('Failed to upload image. Please try again.');
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsLoading(true);
    setErrorMessage(null);
    setSuccessMessage(null);
    
    try {
      // Prepare data for submission
      const profilePayload = {
        name: profileData.name,
        email: profileData.email,
        mobile: profileData.mobile,
        dob: profileData.dob,
        image: profileData.imageUrl || null
      };
      

        console.log("profilePayload",profilePayload);
        
       await userInstance.post("api/profile/profile", profilePayload);
      
      // Update Redux store with updated profile data while preserving preferences
      dispatch(updateUserData({
        userData: {
          ...profilePayload,
          preferences: userData.preferences // Keep existing preferences array
        }
      }));
      
      setSuccessMessage('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      setErrorMessage('Failed to update profile. Please try again.');
    } finally {
      setIsLoading(false);
    }
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
      
      {errorMessage && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 p-3 bg-red-50 text-red-700 rounded-lg border border-red-200"
        >
          {errorMessage}
        </motion.div>
      )}
      
      {successMessage && (
        <motion.div 
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="mb-4 p-3 bg-green-50 text-green-700 rounded-lg border border-green-200"
        >
          {successMessage}
        </motion.div>
      )}
      
      <form onSubmit={handleSubmit}>
        {/* Profile Image Section */}
        <motion.div 
          initial={{ y: -20, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ delay: 0.1 }}
          className="mb-8 flex flex-col items-center"
        >
          <div className="relative">
            <div className="w-32 h-32 rounded-full overflow-hidden bg-gray-200 border-4 border-white shadow-lg">
              {previewImage ? (
                <img 
                  src={previewImage} 
                  alt="Profile Preview" 
                  className="w-full h-full object-cover"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center bg-indigo-100 text-indigo-500">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                  </svg>
                </div>
              )}
              
              {isUploading && (
                <div className="absolute inset-0 bg-black bg-opacity-50 flex items-center justify-center rounded-full">
                  <div className="text-center">
                    <div className="w-16 h-16 relative">
                      <svg className="w-16 h-16 animate-spin text-white" viewBox="0 0 100 100">
                        <circle 
                          className="opacity-25" 
                          cx="50" cy="50" r="45" 
                          stroke="currentColor" 
                          strokeWidth="8" 
                          fill="none"
                        />
                        <circle 
                          className="opacity-75" 
                          cx="50" cy="50" r="45" 
                          stroke="currentColor" 
                          strokeWidth="8" 
                          strokeLinecap="round" 
                          fill="none"
                          strokeDasharray={280}
                          strokeDashoffset={280 - (uploadProgress / 100) * 280}
                          transform="rotate(-90 50 50)"
                        />
                      </svg>
                      <div className="absolute inset-0 flex items-center justify-center">
                        <span className="text-white text-xs font-bold">{uploadProgress}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              )}
            </div>
            
            <button 
              type="button" 
              onClick={() => fileInputRef.current?.click()}
              className="absolute bottom-0 right-0 bg-indigo-600 text-white p-2 rounded-full shadow-md hover:bg-indigo-700 transition-colors"
              disabled={isUploading}
            >
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
              </svg>
            </button>
          </div>
          
          <input
            type="file"
            ref={fileInputRef}
            className="hidden"
            accept="image/*"
            onChange={handleImageChange}
          />
          
          <p className="mt-3 text-gray-500 text-sm">
            Click to upload profile photo
          </p>
          {profileData.image && !isUploading && (
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xs text-indigo-600 mt-1"
            >
              {profileData.imageUrl ? 'Image uploaded successfully!' : profileData.image.name}
            </motion.p>
          )}
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Form Fields */}
          {[
            { label: "Full Name", name: "name", type: "text" },
            { label: "Email", name: "email", type: "email" },
            { label: "Mobile", name: "mobile", type: "text" },
            { label: "Date of Birth", name: "dob", type: "date" }
          ].map((field, index) => (
            <motion.div 
              key={field.name}
              initial={{ x: index % 2 === 0 ? -20 : 20, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              transition={{ delay: 0.2 + (index * 0.1) }}
            >
              <label className="block text-indigo-700 mb-2 font-medium">{field.label}</label>
              <input 
                type={field.type} 
                name={field.name}
                className="w-full border border-gray-300 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500" 
                value={profileData[field.name as keyof ProfileData] as string}
                onChange={handleInputChange}
                required
              />
            </motion.div>
          ))}
        </div>
        
        <motion.button 
          whileHover={{ scale: 1.05 }}
          whileTap={{ scale: 0.95 }}
          className="mt-8 bg-gradient-to-r from-indigo-600 to-purple-600 text-white font-medium px-6 py-3 rounded-lg shadow-lg hover:shadow-xl transition-all duration-300 flex items-center justify-center w-full md:w-auto"
          type="submit"
          disabled={isLoading || isUploading}
        >
          {isLoading ? (
            <motion.div className="flex items-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Updating Profile...
            </motion.div>
          ) : (
            <span>Save Changes</span>
          )}
        </motion.button>
      </form>
    </div>
  );
};

export default ProfileDetailsTab;