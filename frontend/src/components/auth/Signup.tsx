import { useState } from 'react';
import { Form, Input, Button, Typography, Spin, DatePicker, Select, message } from 'antd';
import { LockOutlined, MailOutlined, UserOutlined, MobileOutlined, LoadingOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';
import SignupImage from "../../assets/4309857.jpg";
import type { Rule } from 'antd/es/form';
import axios from 'axios';
import { useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { login } from '../../redux/slices/userSlice'; // Adjust the import path as needed
import { userInstance } from '../../middleware/axios';

const { Title, Text } = Typography;
const { Option } = Select;

// Define all available preferences
const availablePreferences = [
  'travel',
  'food',
  'lifestyle',
  'fitness',
  'technology',
  'gaming',
  'fashion',
  'education',
  'music',
  'daily routine'
];

interface SignupFormValues {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
  mobile: string;
  dob: string;
  preferences: string[];
}

// Create a proper Rule for password validation
const passwordValidator: Rule = {
  validator: (_rule, value) => {
    if (!value) {
      return Promise.resolve();
    }
    if (value.length < 8) {
      return Promise.reject(new Error('Password must be at least 8 characters'));
    }
    if (!/[A-Z]/.test(value)) {
      return Promise.reject(new Error('Password must contain at least one uppercase letter'));
    }
    if (!/[a-z]/.test(value)) {
      return Promise.reject(new Error('Password must contain at least one lowercase letter'));
    }
    if (!/[0-9]/.test(value)) {
      return Promise.reject(new Error('Password must contain at least one number'));
    }
    if (!/[!@#$%^&*()_+\-={};':"\\|,.<>/?]/.test(value)) {
      return Promise.reject(new Error('Password must contain at least one special character'));
    }
    return Promise.resolve();
  }
};

export function Signup(): React.ReactElement {
  const [loading, setLoading] = useState<boolean>(false);
  const [apiError, setApiError] = useState<string | null>(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const onFinish = async (values: SignupFormValues): Promise<void> => {
    setLoading(true);
    setApiError(null);
    
    // Format the date to YYYY-MM-DD
    const formattedDob = values.dob ? values.dob : null;
    
    // Prepare payload for API
    const payload = {
      name: values.name,
      email: values.email,
      password: values.password,
      mobile: values.mobile,
      dob: formattedDob,
      preferences: values.preferences || ['technology'] // Default to technology if none selected
    };
    
    try {
      // Replace with your actual API endpoint
      const response = await userInstance.post('/api/auth/register', payload);
      console.log("response===>", response);
      
      // Handle successful signup
      message.success('Account created successfully!');
      
      // Dispatch login action to Redux store and navigate to blogs page
      dispatch(login({ userData: response.data.user, userId: response.data.id }));
      navigate('/user/blogs');
      
    } catch (error) {
      if (axios.isAxiosError(error) && error.response) {
        // Handle API error response
        setApiError(error.response.data.message || 'Failed to create account. Please try again.');
      } else {
        // Handle unexpected errors
        setApiError('An unexpected error occurred. Please try again later.');
      }
      console.error('Signup failed:', error);
    } finally {
      setLoading(false);
    }
  };

  // Container animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.2
      }
    }
  };

  // Item animation variants
  const itemVariants = {
    hidden: { opacity: 0, y: 10 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.4 }
    }
  };

  return (
    <div className="min-h-screen w-full flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-900 p-4 sm:p-6 md:p-8">
      {/* Main Box containing both image and form */}
      <motion.div 
        className="w-full max-w-6xl bg-white rounded-2xl shadow-2xl overflow-hidden flex flex-col lg:flex-row"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7 }}
      >
        {/* Left side - Image and Text (hidden on smaller screens) */}
        <div className="w-full lg:w-5/12 bg-gradient-to-br from-blue-600 to-cyan-400 text-white p-4 sm:p-6 md:p-8 hidden sm:flex flex-col">
          <div className="flex-1 flex flex-col">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-center mb-4 md:mb-8"
            >
              <Title level={2} className="text-white m-0">Clip Write</Title>
              <Text className="text-blue-100 text-lg">Start your writing journey today</Text>
            </motion.div>

            <div className="flex-1 flex items-center justify-center mb-4 md:mb-8">
              <motion.img 
                src={SignupImage} 
                alt="Clip Write" 
                className="w-4/5 object-contain rounded-lg shadow-lg"
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                transition={{ duration: 0.8 }}
              />
            </div>

            <motion.div
              variants={containerVariants}
              initial="hidden"
              animate="visible"
              className="space-y-3 md:space-y-4"
            >
              <motion.div variants={itemVariants} className="flex items-center">
                <div className="bg-white bg-opacity-20 rounded-full p-1.5 md:p-2 mr-3 md:mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M11 5H6a2 2 0 00-2 2v11a2 2 0 002 2h11a2 2 0 002-2v-5m-1.414-9.414a2 2 0 112.828 2.828L11.828 15H9v-2.828l8.586-8.586z" />
                  </svg>
                </div>
                <p className="text-base md:text-lg font-medium">Express your thoughts freely</p>
              </motion.div>
              
              <motion.div variants={itemVariants} className="flex items-center">
                <div className="bg-white bg-opacity-20 rounded-full p-1.5 md:p-2 mr-3 md:mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4.354a4 4 0 110 5.292M15 21H3v-1a6 6 0 0112 0v1zm0 0h6v-1a6 6 0 00-9-5.197M13 7a4 4 0 11-8 0 4 4 0 018 0z" />
                  </svg>
                </div>
                <p className="text-base md:text-lg font-medium">Join a community of writers</p>
              </motion.div>
              
              <motion.div variants={itemVariants} className="flex items-center">
                <div className="bg-white bg-opacity-20 rounded-full p-1.5 md:p-2 mr-3 md:mr-4">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                  </svg>
                </div>
                <p className="text-base md:text-lg font-medium">Get inspired daily</p>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Additional top section for mobile only */}
        <div className="sm:hidden w-full bg-gradient-to-br from-blue-600 to-cyan-400 text-white p-4 text-center">
          <Title level={3} className="text-white m-0">Clip Write</Title>
          <Text className="text-blue-100">Start your writing journey</Text>
        </div>

        {/* Right side - Signup form */}
        <div className="w-full lg:w-7/12 p-4 sm:p-6 md:p-8 flex flex-col justify-center overflow-y-auto max-h-screen">
          <div className="w-full max-w-md mx-auto">
            <Title level={2} className="text-center mb-1 md:mb-2 text-2xl md:text-3xl">Get Started</Title>
            <Title level={4} className="text-center mb-3 md:mb-4 text-gray-500 font-normal text-base md:text-lg">Create your account</Title>
            
            {apiError && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-4 p-3 text-red-600 bg-red-50 border border-red-200 rounded-lg text-sm"
              >
                {apiError}
              </motion.div>
            )}
            
            <Form
              name="signup"
              layout="vertical"
              onFinish={onFinish}
              size="large"
              className="space-y-2 md:space-y-4"
              initialValues={{ preferences: ['technology'] }} // Set default preference
            >
              <motion.div 
                variants={containerVariants}
                initial="hidden"
                animate="visible"
                className="space-y-2 md:space-y-4"
              >
                <motion.div variants={itemVariants}>
                  <Form.Item
                    name="name"
                    rules={[{ required: true, message: 'Please input your full name!' }]}
                    className="mb-2 md:mb-3"
                  >
                    <Input 
                      prefix={<UserOutlined className="text-gray-400" />} 
                      placeholder="Full Name"
                      className="rounded-lg py-1.5 md:py-2" 
                    />
                  </Form.Item>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <Form.Item
                    name="email"
                    rules={[
                      { required: true, message: 'Please input your email!' },
                      { type: 'email', message: 'Please enter a valid email address!' }
                    ]}
                    className="mb-2 md:mb-3"
                  >
                    <Input 
                      prefix={<MailOutlined className="text-gray-400" />} 
                      placeholder="Email"
                      className="rounded-lg py-1.5 md:py-2" 
                    />
                  </Form.Item>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <Form.Item
                    name="mobile"
                    rules={[
                      { required: true, message: 'Please input your mobile number!' },
                      { pattern: /^\d{10}$/, message: 'Please enter a valid 10-digit mobile number!' }
                    ]}
                    className="mb-2 md:mb-3"
                  >
                    <Input 
                      prefix={<MobileOutlined className="text-gray-400" />} 
                      placeholder="Mobile Number (10 digits)"
                      className="rounded-lg py-1.5 md:py-2" 
                    />
                  </Form.Item>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <Form.Item
                    name="dob"
                    rules={[{ required: true, message: 'Please select your date of birth!' }]}
                    className="mb-2 md:mb-3"
                  >
                    <DatePicker 
                      className="w-full rounded-lg py-1.5 md:py-2" 
                      placeholder="Date of Birth"
                      format="YYYY-MM-DD"
                    />
                  </Form.Item>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <Form.Item
                    name="preferences"
                    label={<span className="text-sm md:text-base">Interests</span>}
                    rules={[{ required: true, message: 'Please select at least one preference!' }]}
                    className="mb-2 md:mb-3"
                  >
                    <Select
                      mode="multiple"
                      placeholder="Select your interests"
                      className="w-full rounded-lg"
                      maxTagCount={2}
                      dropdownMatchSelectWidth={false}
                    >
                      {availablePreferences.map(pref => (
                        <Option key={pref} value={pref}>
                          {pref.charAt(0).toUpperCase() + pref.slice(1)}
                        </Option>
                      ))}
                    </Select>
                  </Form.Item>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <Form.Item
                    name="password"
                    rules={[
                      { required: true, message: 'Please input your password!' },
                      passwordValidator
                    ]}
                    className="mb-2 md:mb-3"
                  >
                    <Input.Password
                      prefix={<LockOutlined className="text-gray-400" />}
                      placeholder="Password"
                      className="rounded-lg py-1.5 md:py-2"
                    />
                  </Form.Item>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <Form.Item
                    name="confirmPassword"
                    dependencies={['password']}
                    rules={[
                      { required: true, message: 'Please confirm your password!' },
                      ({ getFieldValue }) => ({
                        validator(_, value) {
                          if (!value || getFieldValue('password') === value) {
                            return Promise.resolve();
                          }
                          return Promise.reject(new Error('The two passwords do not match!'));
                        },
                      }),
                    ]}
                    className="mb-2 md:mb-3"
                  >
                    <Input.Password
                      prefix={<LockOutlined className="text-gray-400" />}
                      placeholder="Confirm Password"
                      className="rounded-lg py-1.5 md:py-2"
                    />
                  </Form.Item>
                </motion.div>

                <motion.div variants={itemVariants}>
                  <Form.Item className="mb-2">
                    <Button 
                      type="primary" 
                      htmlType="submit" 
                      className="w-full h-10 sm:h-11 md:h-12 flex items-center justify-center text-sm md:text-base rounded-lg"
                      disabled={loading}
                    >
                      {loading ? (
                        <>
                          <Spin indicator={<LoadingOutlined style={{ fontSize: 16, color: 'white' }} spin />} className="mr-2" />
                          <span>Creating account...</span>
                        </>
                      ) : (
                        'Sign Up'
                      )}
                    </Button>
                  </Form.Item>
                </motion.div>
              </motion.div>

              <div className="text-center mt-2 md:mt-4">
                <Text className="text-sm md:text-base">Already have an account? <a href="/" className="text-blue-600 font-medium hover:text-blue-800 transition-colors">Login now</a></Text>
              </div>
            </Form>
          </div>
        </div>
      </motion.div>
    </div>
  );
}