import { useState } from 'react';
import { Form, Input, Button, Typography, Spin } from 'antd';
import { LockOutlined, MailOutlined, UserAddOutlined, LoadingOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';
import SignupImage from "../../assets/4309857.jpg";
import type { Rule } from 'antd/es/form';

const { Title, Text } = Typography;

interface SignupFormValues {
  name: string;
  email: string;
  password: string;
  confirmPassword: string;
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
    return Promise.resolve();
  }
};

export function Signup(): React.ReactElement {
  const [loading, setLoading] = useState<boolean>(false);
  const [apiError, setApiError] = useState<string | null>(null);
  
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const onFinish = (values: SignupFormValues): void => {
    setLoading(true);
    setApiError(null);
    
    // Simulate account creation process for UI demonstration
    setTimeout(() => {
      setLoading(false);
      // Comment/uncomment to demonstrate error state
      setApiError('This email is already registered. Please use a different email.');
    }, 2000);
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
          <div className="md:w-1/2 p-6 flex flex-col justify-center">
            <div className="w-full max-w-sm mx-auto">
              <Title level={2} className="text-center mb-2">Inventory Management</Title>
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
              >
                <Form.Item
                  name="name"
                  rules={[{ required: true, message: 'Please input your full name!' }]}
                  className="mb-3"
                >
                  <Input 
                    prefix={<UserAddOutlined className="text-gray-400" />} 
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