import { useState, } from 'react';
import { Form, Input, Button, Typography, Spin, DatePicker, Select, message } from 'antd';
import { LockOutlined, MailOutlined, UserOutlined, MobileOutlined, CalendarOutlined, LoadingOutlined } from '@ant-design/icons';
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
      console.log("response===>",response);
      
      // Handle successful signup
      message.success('Account created successfully!');
      
      // Dispatch login action to Redux store and navigate to blogs page
      dispatch(login({ userName: response.data.user.name }));
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

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-100">
      {/* Main Box containing both image and form */}
      <motion.div 
        className="w-full max-w-4xl bg-white rounded-lg shadow-xl overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="flex flex-col md:flex-row">
          {/* Left side - Image */}
          <div className="md:w-1/2 flex items-center justify-center p-6">
            <motion.img 
              src={SignupImage} 
              alt="Inventory Management" 
              className="w-4/5 object-contain max-h-full"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6 }}
            />
          </div>

          {/* Right side - Signup form */}
          <div className="md:w-1/2 p-6 flex flex-col justify-center overflow-y-auto max-h-screen">
            <div className="w-full max-w-sm mx-auto">
              <Title level={2} className="text-center mb-2">Clip Write</Title>
              <Title level={4} className="text-center mb-4 text-gray-500">Create your account</Title>
              
              {apiError && (
                <div className="mb-4 p-2 text-red-600 bg-red-50 border border-red-200 rounded">
                  {apiError}
                </div>
              )}
              
              <Form
                name="signup"
                layout="vertical"
                onFinish={onFinish}
                size="large"
                className="space-y-3"
                initialValues={{ preferences: ['technology'] }} // Set default preference
              >
                <Form.Item
                  name="name"
                  rules={[{ required: true, message: 'Please input your full name!' }]}
                  className="mb-3"
                >
                  <Input 
                    prefix={<UserOutlined className="text-gray-400" />} 
                    placeholder="Full Name" 
                  />
                </Form.Item>

                <Form.Item
                  name="email"
                  rules={[
                    { required: true, message: 'Please input your email!' },
                    { type: 'email', message: 'Please enter a valid email address!' }
                  ]}
                  className="mb-3"
                >
                  <Input 
                    prefix={<MailOutlined className="text-gray-400" />} 
                    placeholder="Email" 
                  />
                </Form.Item>

                <Form.Item
                  name="mobile"
                  rules={[
                    { required: true, message: 'Please input your mobile number!' },
                    { pattern: /^\d{10}$/, message: 'Please enter a valid 10-digit mobile number!' }
                  ]}
                  className="mb-3"
                >
                  <Input 
                    prefix={<MobileOutlined className="text-gray-400" />} 
                    placeholder="Mobile Number (10 digits)" 
                  />
                </Form.Item>

                <Form.Item
                  name="dob"
                  rules={[{ required: true, message: 'Please select your date of birth!' }]}
                  className="mb-3"
                >
                  <DatePicker 
                    className="w-full" 
                    placeholder="Date of Birth"
                    format="YYYY-MM-DD"
                    prefix={<CalendarOutlined className="text-gray-400" />}
                  />
                </Form.Item>

                <Form.Item
                  name="preferences"
                  label="Interests"
                  rules={[{ required: true, message: 'Please select at least one preference!' }]}
                  className="mb-3"
                >
                  <Select
                    mode="multiple"
                    placeholder="Select your interests"
                    className="w-full"
                    maxTagCount={3}
                  >
                    {availablePreferences.map(pref => (
                      <Option key={pref} value={pref}>
                        {pref.charAt(0).toUpperCase() + pref.slice(1)}
                      </Option>
                    ))}
                  </Select>
                </Form.Item>

                <Form.Item
                  name="password"
                  rules={[
                    { required: true, message: 'Please input your password!' },
                    passwordValidator
                  ]}
                  className="mb-3"
                >
                  <Input.Password
                    prefix={<LockOutlined className="text-gray-400" />}
                    placeholder="Password"
                  />
                </Form.Item>

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
                  className="mb-3"
                >
                  <Input.Password
                    prefix={<LockOutlined className="text-gray-400" />}
                    placeholder="Confirm Password"
                  />
                </Form.Item>

                <Form.Item className="mb-2">
                  <Button 
                    type="primary" 
                    htmlType="submit" 
                    className="w-full h-10 flex items-center justify-center"
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

                <div className="text-center mt-2">
                  <Text>Already have an account? <a href="/" className="text-blue-500">Login now</a></Text>
                </div>
              </Form>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}