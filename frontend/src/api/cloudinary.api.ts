import axios from 'axios';

export const uploadToCloudinary = async (file: File): Promise<string> => {
  try {
    // Hard-code these values for testing or ensure environment variables are properly set
    const cloudName = import.meta.env.VITE_CLOUDINARY_CLOUD_NAME || "your_cloud_name";
    const uploadPreset = import.meta.env.VITE_CLOUDINARY_UPLOAD_PRESET || "your_upload_preset";
    
    console.log("Uploading to Cloudinary with:", { cloudName, uploadPreset });
    
    // Create FormData
    const formData = new FormData();
    formData.append('file', file);
    formData.append('upload_preset', uploadPreset);
    formData.append('resource_type', 'auto');
    
    console.log("Form data prepared with file:", file.name, file.type, file.size);
    
    // Send request to Cloudinary
    const response = await axios.post(
      `https://api.cloudinary.com/v1_1/${cloudName}/upload`,
      formData
    );
    
    console.log("Cloudinary response:", response.data);
    return response.data.secure_url;
  } catch (error) {
    // Improved error logging to help debug the issue
    if (axios.isAxiosError(error) && error.response) {
      console.error('Cloudinary error details:', error.response.data);
    }
    console.error('Error uploading to Cloudinary:', error);
    throw new Error('Failed to upload image');
  }
};
