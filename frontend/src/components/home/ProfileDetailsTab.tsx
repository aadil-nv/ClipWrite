import React, { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { uploadToCloudinary } from '../../api/cloudinary.api';
import { useSelector, useDispatch } from 'react-redux';
import { updateUserData } from '../../redux/slices/userSlice';
import { userInstance } from '../../middleware/axios';
import toast from 'react-hot-toast'; // Import toast for notifications

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

interface ValidationErrors {
  name?: string;
  email?: string;
  mobile?: string;
  dob?: string;
  image?: string;
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
  const [errors, setErrors] = useState<ValidationErrors>({});
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
    
    // Clear related error when field is modified
    if (errors[name as keyof ValidationErrors]) {
      setErrors(prev => ({
        ...prev,
        [name]: undefined
      }));
    }
  };

  // Validation functions
  const validateName = (name: string): string | undefined => {
    if (!name.trim()) return "Name is required";
    if (name.trim().length < 2) return "Name must be at least 2 characters";
    return undefined;
  };

  const validateEmail = (email: string): string | undefined => {
    if (!email.trim()) return "Email is required";
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) return "Please enter a valid email address";
    return undefined;
  };

  const validateMobile = (mobile: string): string | undefined => {
    if (!mobile.trim()) return "Mobile number is required";
    
    // Check for 10 digits
    if (!/^\d{10}$/.test(mobile)) {
      return "Mobile number must be exactly 10 digits";
    }
    
    // Check for consecutive digits (1234567890)
    if (/01234567890/.test(mobile)) {
      return "Mobile number cannot be sequential digits";
    }
    
    // Check for same consecutive digits (e.g., 1111111111)
    if (/^(\d)\1{9}$/.test(mobile)) {
      return "Mobile number cannot be all same digits";
    }
    
    return undefined;
  };

  const validateDOB = (dob: string): string | undefined => {
    if (!dob) return "Date of birth is required";
    
    const dobDate = new Date(dob);
    const today = new Date();
    
    // Check if DOB is in the future
    if (dobDate > today) {
      return "Date of birth cannot be in the future";
    }
    
    // Check if person is at least 13 years old (common minimum age for many services)
    const thirteenYearsAgo = new Date();
    thirteenYearsAgo.setFullYear(today.getFullYear() - 13);
    if (dobDate > thirteenYearsAgo) {
      return "You must be at least 13 years old";
    }
    
    // Check if DOB is too far in the past (e.g., more than 120 years)
    const maxAge = new Date();
    maxAge.setFullYear(today.getFullYear() - 120);
    if (dobDate < maxAge) {
      return "Please enter a valid date of birth";
    }
    
    return undefined;
  };

  const validateImage = (file: File | null): string | undefined => {
    if (!file && !previewImage) return "Profile image is required";
    if (!file) return undefined;
    
    if (file.size > 5 * 1024 * 1024) {
      return "Image size should be less than 5MB";
    }
    
    const allowedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'];
    if (!allowedTypes.includes(file.type)) {
      return "Please upload a valid image (JPEG, PNG, WEBP)";
    }
    
    return undefined;
  };

  const validateForm = (): boolean => {
    const newErrors: ValidationErrors = {
      name: validateName(profileData.name),
      email: validateEmail(profileData.email),
      mobile: validateMobile(profileData.mobile),
      dob: validateDOB(profileData.dob),
      image: validateImage(profileData.image)
    };
    
    setErrors(newErrors);
    
    // Show first error in toast if any errors exist
    const errorValues = Object.values(newErrors).filter(error => error !== undefined);
    if (errorValues.length > 0) {
      toast.error(errorValues[0]);
      return false;
    }
    
    return true;
  };

  const handleImageChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    // Validate file
    const imageError = validateImage(file);
    if (imageError) {
      setErrors(prev => ({ ...prev, image: imageError }));
      toast.error(imageError);
      return;
    }

    setProfileData(prev => ({ ...prev, image: file }));
    
    // Create URL for preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setPreviewImage(reader.result as string);
    };
    reader.readAsDataURL(file);
    
    setErrors(prev => ({ ...prev, image: undefined }));
    
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
        toast.success('Image uploaded successfully!');
      }, 500);
      
    } catch (error) {
      console.error('Error uploading image:', error);
      toast.error('Failed to upload image. Please try again.');
      setIsUploading(false);
      setUploadProgress(0);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    // Validate all fields before submission
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      // Prepare data for submission
      const profilePayload = {
        name: profileData.name,
        email: profileData.email,
        mobile: profileData.mobile,
        dob: profileData.dob,
        image: profileData.imageUrl || previewImage
      };
      
      console.log("profilePayload", profilePayload);
        
      await userInstance.post("api/profile/profile", profilePayload);
      
      // Update Redux store with updated profile data while preserving preferences
      dispatch(updateUserData({
        userData: {
          ...profilePayload,
          preferences: userData.preferences // Keep existing preferences array
        }
      }));
      
      toast.success('Profile updated successfully!');
    } catch (error) {
      console.error('Error updating profile:', error);
      toast.error('Failed to update profile. Please try again.');
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
            accept="image/jpeg,image/png,image/jpg,image/webp"
            onChange={handleImageChange}
          />
          
          <p className="mt-3 text-gray-500 text-sm">
            Click to upload profile photo
          </p>
          {errors.image && (
            <p className="text-xs text-red-500 mt-1">{errors.image}</p>
          )}
          {profileData.image && !isUploading && !errors.image && (
            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="text-xs text-indigo-600 mt-1"
            >
              {profileData.image.name}
            </motion.p>
          )}
        </motion.div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Name Field */}
          <motion.div 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.2 }}
          >
            <label className="block text-indigo-700 mb-2 font-medium">Full Name</label>
            <input 
              type="text" 
              name="name"
              className={`w-full border ${errors.name ? 'border-red-500' : 'border-gray-300'} rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500`}
              value={profileData.name}
              onChange={handleInputChange}
              placeholder="Enter your full name"
            />
            {errors.name && (
              <p className="text-red-500 text-xs mt-1">{errors.name}</p>
            )}
          </motion.div>

          {/* Email Field */}
          <motion.div 
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.3 }}
          >
            <label className="block text-indigo-700 mb-2 font-medium">Email</label>
            <input 
              type="email" 
              name="email"
              className={`w-full border ${errors.email ? 'border-red-500' : 'border-gray-300'} rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500`}
              value={profileData.email}
              onChange={handleInputChange}
              placeholder="yourname@example.com"
            />
            {errors.email && (
              <p className="text-red-500 text-xs mt-1">{errors.email}</p>
            )}
          </motion.div>

          {/* Mobile Field */}
          <motion.div 
            initial={{ x: -20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.4 }}
          >
            <label className="block text-indigo-700 mb-2 font-medium">Mobile</label>
            <input 
              type="text" 
              name="mobile"
              className={`w-full border ${errors.mobile ? 'border-red-500' : 'border-gray-300'} rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500`}
              value={profileData.mobile}
              onChange={handleInputChange}
              maxLength={10}
              placeholder="10-digit mobile number"
            />
            {errors.mobile && (
              <p className="text-red-500 text-xs mt-1">{errors.mobile}</p>
            )}
          </motion.div>

          {/* Date of Birth Field */}
          <motion.div 
            initial={{ x: 20, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ delay: 0.5 }}
          >
            <label className="block text-indigo-700 mb-2 font-medium">Date of Birth</label>
            <input 
              type="date" 
              name="dob"
              max={new Date().toISOString().split('T')[0]} // Prevents future dates
              className={`w-full border ${errors.dob ? 'border-red-500' : 'border-gray-300'} rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-indigo-500`}
              value={profileData.dob}
              onChange={handleInputChange}
            />
            {errors.dob && (
              <p className="text-red-500 text-xs mt-1">{errors.dob}</p>
            )}
          </motion.div>
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