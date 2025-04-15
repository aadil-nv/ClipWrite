import { useState, useEffect, ChangeEvent, FormEvent, ReactElement } from 'react';
import { 
  PenTool, 
  Image as ImageIcon, 
  FileText, 
  Tag, 
  Plus, 
  X, 
  Save, 
  Upload
} from 'lucide-react';

// Import services
import { uploadToCloudinary } from '../../api/cloudinary.api';
import { updateBlog, getBlogById } from '../../api/blog.api';
import { useParams, useNavigate } from 'react-router-dom';

interface BlogFormData {
  title: string;
  content: string;
  author: string;
  image: string;
  tags: string[];
  preference: string[];
  isPublished: boolean;
}

// Predefined preferences list based on validation requirements
const predefinedPreferences = [
  'travel', 'food', 'lifestyle', 'fitness', 'technology', 
  'gaming', 'fashion', 'education', 'music', 'daily routine'
];

export default function EditBlog(): ReactElement {
  const { id } = useParams<{ id: string }>();
  console.log("Blog ID: from edit blog", id);
  
  const navigate = useNavigate();
  
  const [formData, setFormData] = useState<BlogFormData>({
    title: '',
    content: '',
    author: '',
    image: '',
    tags: [],
    preference: [],
    isPublished: false,
  });
  
  const [newTag, setNewTag] = useState<string>('');
  const [previewImage, setPreviewImage] = useState<string>('');
  const [isSubmitting, setIsSubmitting] = useState<boolean>(false);
  const [isDragging, setIsDragging] = useState<boolean>(false);
  const [imageFile, setImageFile] = useState<File | null>(null);
  const [uploadingImage, setUploadingImage] = useState<boolean>(false);
  const [submitSuccess, setSubmitSuccess] = useState<boolean>(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(true);
  const [imageChanged, setImageChanged] = useState<boolean>(false); // Track if image has been changed

  // Fetch blog data when component mounts
  useEffect(() => {
    const fetchBlogData = async () => {
      if (!id) return;
      
      try {
        setIsLoading(true);
        const blogData = await getBlogById(id);
        
        // Populate form with existing blog data
        setFormData({
          title: blogData.title || '',
          content: blogData.content || '',
          author: blogData.author._id || '',
          image: blogData.image || '',
          tags: blogData.tags || [],
          preference: blogData.preference || [],
          isPublished: blogData.isPublished || false,
        });
        
        // Set preview image if one exists
        if (blogData.image) {
          setPreviewImage(blogData.image);
        }
        
      } catch (error) {
        console.error('Error fetching blog data:', error);
        setErrorMessage('Failed to load blog data. Please try again.');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchBlogData();
  }, [id]);

  // Add fadeIn animation via useEffect
  useEffect(() => {
    const styleSheet = document.createElement("style");
    styleSheet.textContent = `
      @keyframes fadeIn {
        from { opacity: 0; transform: translateY(10px); }
        to { opacity: 1; transform: translateY(0); }
      }
      .animate-fadeIn {
        animation: fadeIn 0.3s ease-in-out;
      }
    `;
    document.head.appendChild(styleSheet);
    
    return () => {
      document.head.removeChild(styleSheet);
    };
  }, []);

  const handleInputChange = (e: ChangeEvent<HTMLInputElement | HTMLTextAreaElement>): void => {
    const { name, value } = e.target;
    setFormData({
      ...formData,
      [name]: value,
    });
  };

  const handlePreferenceChange = (preference: string): void => {
    // If preference is already selected, remove it, otherwise add it
    if (formData.preference.includes(preference)) {
      setFormData({
        ...formData,
        preference: formData.preference.filter(pref => pref !== preference),
      });
    } else {
      setFormData({
        ...formData,
        preference: [...formData.preference, preference],
      });
    }
  };

  const handlePublishChange = (e: ChangeEvent<HTMLInputElement>): void => {
    setFormData({
      ...formData,
      isPublished: e.target.checked,
    });
  };

  const handleImageChange = (e: ChangeEvent<HTMLInputElement>): void => {
    const file = e.target.files?.[0];
    if (file) {
      processImageFile(file);
    }
  };

  const processImageFile = (file: File): void => {
    setImageFile(file);
    setImageChanged(true); // Mark image as changed
    const reader = new FileReader();
    reader.onload = (event) => {
      const result = event.target?.result as string;
      setPreviewImage(result);
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>): void => {
    e.preventDefault();
    setIsDragging(false);
    
    const files = e.dataTransfer.files;
    if (files.length > 0 && files[0].type.startsWith('image/')) {
      processImageFile(files[0]);
    }
  };

  const addNewTag = (): void => {
    if (newTag.trim() !== '' && !formData.tags.includes(newTag.trim())) {
      setFormData({
        ...formData,
        tags: [...formData.tags, newTag.trim()],
      });
      setNewTag('');
    }
  };

  const handleTagKeyPress = (e: React.KeyboardEvent): void => {
    if (e.key === 'Enter') {
      e.preventDefault();
      addNewTag();
    }
  };

  const removeTag = (tagToRemove: string): void => {
    setFormData({
      ...formData,
      tags: formData.tags.filter(tag => tag !== tagToRemove),
    });
  };

  const uploadImage = async (): Promise<string | null> => {
    if (!imageFile) return null;
    
    setUploadingImage(true);
    setErrorMessage(null);
    try {
      console.log("Starting image upload with file:", imageFile.name);
      const imageUrl = await uploadToCloudinary(imageFile);
      console.log("Image uploaded successfully, URL:", imageUrl);
      return imageUrl;
    } catch (error) {
      console.error('Error uploading image to Cloudinary:', error);
      setErrorMessage("Failed to upload image. Please check your Cloudinary credentials.");
      return null;
    } finally {
      setUploadingImage(false);
    }
  };

  const handleRemoveImage = (e: React.MouseEvent): void => {
    e.stopPropagation();
    setPreviewImage('');
    setImageFile(null);
    setImageChanged(true); // Mark image as changed (removed)
    setFormData({
      ...formData,
      image: ''
    });
  };

  const handleCancel = (): void => {
    navigate('/blogs'); // Navigate back to blogs list
  };

  const handleSubmit = async (e: FormEvent): Promise<void> => {
    e.preventDefault();
    
    // Validation
    if (formData.preference.length === 0) {
      setErrorMessage("Please select at least one preference category");
      return;
    }
    
    if (!id) {
      setErrorMessage("Blog ID is missing");
      return;
    }
    
    setIsSubmitting(true);
    setErrorMessage(null);
    
    try {
      // Only upload image to Cloudinary if a new one was selected or the image was changed
      let finalImageUrl = formData.image;
      
      if (imageChanged) {
        if (imageFile) {
          console.log("Image file detected, starting upload process");
          const cloudinaryUrl = await uploadImage();
          if (cloudinaryUrl) {
            finalImageUrl = cloudinaryUrl;
            console.log("Setting image URL in form data:", cloudinaryUrl);
          } else {
            // If image upload failed, alert user and stop submission
            throw new Error('Image upload failed');
          }
        } else {
          // If image was removed, set to empty string
          finalImageUrl = '';
        }
      }
      
      // Prepare final form data with cloudinary image URL
      const finalFormData = {
        ...formData,
        image: finalImageUrl,
      };
      
      // Send the updated blog data to the API
      const response = await updateBlog(id, finalFormData);
      console.log('Blog post updated:', response);
      
      setSubmitSuccess(true);
      alert('Blog post updated successfully!');
      
      // Navigate back to blog list or view after short delay
      setTimeout(() => {
        navigate('/blogs');
      }, 1500);
      
    } catch (error) {
      console.error('Error updating blog post:', error);
      setErrorMessage("Failed to update blog post. Please check your inputs and try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  if (isLoading) {
    return (
      <div className="max-w-4xl mx-auto p-6 flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-blue-500"></div>
        <p className="ml-3 text-gray-600">Loading blog data...</p>
      </div>
    );
  }

  return (
    <div className="max-w-4xl mx-auto p-6 bg-white rounded-lg shadow-lg">
      <div className="flex items-center mb-8">
        <PenTool className="text-blue-600 mr-3" size={24} />
        <h1 className="text-3xl font-bold text-gray-800">Edit Blog Post</h1>
      </div>
      
      {errorMessage && (
        <div className="bg-red-50 border-l-4 border-red-500 p-4 mb-6 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-red-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zM8.707 7.293a1 1 0 00-1.414 1.414L8.586 10l-1.293 1.293a1 1 0 101.414 1.414L10 11.414l1.293 1.293a1 1 0 001.414-1.414L11.414 10l1.293-1.293a1 1 0 00-1.414-1.414L10 8.586 8.707 7.293z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-red-700">{errorMessage}</p>
            </div>
          </div>
        </div>
      )}
      
      {submitSuccess ? (
        <div className="bg-green-50 border-l-4 border-green-500 p-4 mb-6 rounded-md">
          <div className="flex">
            <div className="flex-shrink-0">
              <svg className="h-5 w-5 text-green-400" viewBox="0 0 20 20" fill="currentColor">
                <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
              </svg>
            </div>
            <div className="ml-3">
              <p className="text-sm text-green-700">Blog post updated successfully! Redirecting...</p>
            </div>
          </div>
        </div>
      ) : (
        <form onSubmit={handleSubmit} className="space-y-8">
          {/* Title */}
          <div className="transition-all duration-300 hover:shadow-md p-4 rounded-lg border border-gray-200">
            <label htmlFor="title" className="flex items-center text-sm font-medium text-gray-700 mb-2">
              <FileText className="mr-2" size={18} />
              Title
            </label>
            <input
              type="text"
              id="title"
              name="title"
              value={formData.title}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              placeholder="Enter your blog post title"
            />
          </div>
          
          {/* Image Upload */}
          <div className="transition-all duration-300 hover:shadow-md p-4 rounded-lg border border-gray-200">
            <label htmlFor="image" className="flex items-center text-sm font-medium text-gray-700 mb-2">
              <ImageIcon className="mr-2" size={18} />
              Featured Image
            </label>
            
            <div 
              className={`relative border-2 border-dashed rounded-lg p-6 text-center cursor-pointer transition-all duration-300 ${
                isDragging 
                  ? 'border-blue-500 bg-blue-50' 
                  : 'border-gray-300 hover:border-blue-400 hover:bg-gray-50'
              }`}
              onDragOver={handleDragOver}
              onDragLeave={handleDragLeave}
              onDrop={handleDrop}
              onClick={() => document.getElementById('image')?.click()}
            >
              <input
                type="file"
                id="image"
                accept="image/*"
                onChange={handleImageChange}
                className="hidden"
              />
              
              {!previewImage ? (
                <div className="flex flex-col items-center">
                  <Upload className="text-gray-400 mb-2" size={32} />
                  <p className="text-sm text-gray-500">
                    Drag and drop an image here, or click to select
                  </p>
                  <p className="text-xs text-gray-400 mt-1">
                    Supports JPG, PNG, GIF up to 5MB
                  </p>
                </div>
              ) : (
                <div className="relative group">
                  <img 
                    src={previewImage} 
                    alt="Preview" 
                    className="h-48 mx-auto object-contain rounded-md transition-all duration-300 group-hover:opacity-75"
                  />
                  <button 
                    type="button"
                    onClick={handleRemoveImage}
                    className="absolute top-2 right-2 bg-red-500 text-white rounded-full p-1 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
                  >
                    <X size={16} />
                  </button>
                  <div className="absolute bottom-2 left-1/2 transform -translate-x-1/2 bg-black bg-opacity-50 text-white px-3 py-1 rounded-full text-xs opacity-0 group-hover:opacity-100 transition-opacity duration-300">
                    Change image
                  </div>
                </div>
              )}
            </div>
            {/* Show indicator if image has been changed */}
            {imageChanged && (
              <p className="text-xs text-blue-600 mt-2 italic">
                Image has been changed and will be uploaded when you update the blog post
              </p>
            )}
          </div>
          
          {/* Content */}
          <div className="transition-all duration-300 hover:shadow-md p-4 rounded-lg border border-gray-200">
            <label htmlFor="content" className="flex items-center text-sm font-medium text-gray-700 mb-2">
              <FileText className="mr-2" size={18} />
              Content
            </label>
            <textarea
              id="content"
              name="content"
              rows={8}
              value={formData.content}
              onChange={handleInputChange}
              required
              className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
              placeholder="Write your blog post content here..."
            />
          </div>
          
          {/* Multiple Preference Category Selection */}
          <div className="transition-all duration-300 hover:shadow-md p-4 rounded-lg border border-gray-200">
            <h3 className="flex items-center text-lg font-medium text-gray-800 mb-4">
              <Tag className="mr-2" size={18} />
              Preference Categories
            </h3>
            
            <div className="grid grid-cols-2 md:grid-cols-5 gap-2">
              {predefinedPreferences.map((pref) => (
                <button
                  key={pref}
                  type="button"
                  onClick={() => handlePreferenceChange(pref)}
                  className={`px-3 py-2 rounded-md text-center transition-all duration-200 ${
                    formData.preference.includes(pref) 
                      ? 'bg-blue-500 text-white font-medium' 
                      : 'bg-gray-100 text-gray-700 hover:bg-blue-100 hover:text-blue-700'
                  }`}
                >
                  {pref}
                </button>
              ))}
            </div>
            <p className="text-sm text-gray-500 mt-2">
              Selected: {formData.preference.length > 0 ? formData.preference.join(', ') : 'None'}
            </p>
            {formData.preference.length === 0 && (
              <p className="text-sm text-red-500 mt-1">* Please select at least one preference category</p>
            )}
          </div>
          
          {/* Publication Setting */}
          <div className="transition-all duration-300 hover:shadow-md p-4 rounded-lg border border-gray-200">
            <div className="flex items-center p-2 hover:bg-gray-50 rounded-md transition-colors duration-200">
              <input
                type="checkbox"
                id="isPublished"
                name="isPublished"
                checked={formData.isPublished}
                onChange={handlePublishChange}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded transition-all duration-200"
              />
              <label htmlFor="isPublished" className="ml-2 flex items-center text-gray-700">
                Publish immediately
              </label>
            </div>
          </div>
          
          {/* Tags */}
          <div className="transition-all duration-300 hover:shadow-md p-4 rounded-lg border border-gray-200">
            <h3 className="flex items-center text-lg font-medium text-gray-800 mb-4">
              <Tag className="mr-2" size={18} />
              Tags
            </h3>
            <div className="flex items-center space-x-2">
              <input
                type="text"
                value={newTag}
                onChange={(e) => setNewTag(e.target.value)}
                onKeyPress={handleTagKeyPress}
                className="flex-1 px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                placeholder="Add a new tag"
              />
              <button
                type="button"
                onClick={addNewTag}
                className="px-4 py-2 bg-blue-500 text-white rounded-md hover:bg-blue-600 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-all duration-200 flex items-center"
              >
                <Plus size={16} className="mr-1" /> Add Tag
              </button>
            </div>
            
            {/* Display Tags */}
            <div className="flex flex-wrap gap-2 mt-4">
              {formData.tags.map((tag) => (
                <div 
                  key={tag}
                  className="flex items-center bg-blue-100 text-blue-800 px-3 py-1 rounded-full transition-all duration-200 hover:bg-blue-200 animate-fadeIn"
                >
                  <span>{tag}</span>
                  <button
                    type="button"
                    onClick={() => removeTag(tag)}
                    className="ml-2 text-blue-600 hover:text-blue-800 focus:outline-none transition-colors duration-200"
                  >
                    <X size={14} />
                  </button>
                </div>
              ))}
              {formData.tags.length === 0 && (
                <p className="text-sm text-gray-500 italic">No tags added yet</p>
              )}
            </div>
          </div>
          
          {/* Submit Buttons */}
          <div className="pt-4 flex justify-between gap-4">
            <button
              type="button"
              onClick={handleCancel}
              className="w-1/3 px-6 py-3 bg-gray-200 text-gray-800 font-medium rounded-md hover:bg-gray-300 focus:outline-none focus:ring-2 focus:ring-gray-500 focus:ring-offset-2 transition-all duration-200"
            >
              Cancel
            </button>
            
            <button
              type="submit"
              disabled={isSubmitting || uploadingImage}
              className="w-2/3 px-6 py-3 bg-blue-600 text-white font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 disabled:bg-blue-300 disabled:cursor-not-allowed transition-all duration-200 flex items-center justify-center"
            >
              {isSubmitting || uploadingImage ? (
                <>
                  <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                  </svg>
                  {uploadingImage ? 'Uploading Image...' : 'Updating...'}
                </>
              ) : (
                <>
                  <Save className="mr-2" size={18} /> Update Blog Post
                </>
              )}
            </button>
          </div>
        </form>
      )}
    </div>
  );
}