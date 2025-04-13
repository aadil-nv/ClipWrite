import { useState } from 'react';
import { Form, Input, Button, Typography, Spin, Tabs, message } from 'antd';
import { UserOutlined, LockOutlined, MobileOutlined, LoadingOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import LoginImage from "../../assets/4309857.jpg";
import  { AxiosError } from 'axios';
import { userInstance } from '../../middleware/axios';
import { useDispatch } from 'react-redux';
import { login } from '../../redux/slices/userSlice';


const { Title, Text } = Typography;
const { TabPane } = Tabs;

// types/auth.ts
export interface EmailLoginValues {
  email: string;
  password: string;
}

export interface MobileLoginValues {
  mobile: string;
  password: string;
}

export interface LoginResponse {
  message: string;
  name?: string;
}

export interface ErrorResponse {
  message: string;
  errors?: { msg: string; param: string; location: string }[];
}

export function Login(): React.ReactElement {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();
  
  const onEmailLogin = async (values: EmailLoginValues): Promise<void> => {
    setLoading(true);
    setError(null);
  
    try {
      const { data } = await userInstance.post('api/auth/login-email', values);
      message.success('Login successful!');
      dispatch(login({ userName: data.name  }));
      navigate('/user/blogs');
    } catch (err) {
      const error = err as AxiosError<ErrorResponse>;
      if (error.response) {
        setError(error.response.data.message || 'Authentication failed.');
      } else {
        setError('Failed to connect to server. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };
  
  const onMobileLogin = async (values: MobileLoginValues): Promise<void> => {
    setLoading(true);
    setError(null);
  
    try {
       const { data } = await userInstance.post('api/auth/login-mobile', values);
      message.success('Login successful!');
      dispatch(login({ userName: data.name  }));
      navigate('/user/blogs');
    } catch (err) {
      const error = err as AxiosError<ErrorResponse>;
      if (error.response) {
        setError(error.response.data.message || 'Authentication failed.');
      } else {
        setError('Failed to connect to server. Please try again later.');
      }
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-100">
      <motion.div 
        className="w-full max-w-4xl h-auto md:h-120 bg-white rounded-lg shadow-xl flex flex-col md:flex-row overflow-hidden"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="w-full md:w-1/2 flex items-center justify-center p-6">
          <motion.img 
            src={LoginImage} 
            alt="Inventory Management" 
            className="w-4/5 object-contain max-h-full"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.6 }}
          />
        </div>

        <div className="w-full md:w-1/2 p-6 flex flex-col justify-center">
          <div className="w-full max-w-sm mx-auto">
            <Title level={2} className="text-center mb-2">Inventory Management</Title>
            <Title level={4} className="text-center mb-4 text-gray-500">Sign in to your account</Title>
            
            {error && (
              <div className="mb-4 p-2 text-red-600 bg-red-50 border border-red-200 rounded">
                {error}
              </div>
            )}
            
            <Tabs defaultActiveKey="email" centered className="mb-4">
              <TabPane tab="Email Login" key="email">
                <Form
                  name="email-login"
                  layout="vertical"
                  onFinish={onEmailLogin}
                  size="large"
                  className="space-y-3"
                >
                  <Form.Item
                    name="email"
                    rules={[
                      { required: true, message: 'Please input your email!' },
                      { type: 'email', message: 'Please enter a valid email address!' }
                    ]}
                    className="mb-3"
                  >
                    <Input 
                      prefix={<UserOutlined className="text-gray-400" />} 
                      placeholder="Email" 
                    />
                  </Form.Item>

                  <Form.Item
                    name="password"
                    rules={[{ required: true, message: 'Please input your password!' }]}
                    className="mb-3"
                  >
                    <Input.Password
                      prefix={<LockOutlined className="text-gray-400" />}
                      placeholder="Password"
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
                          <span>Logging in...</span>
                        </>
                      ) : (
                        'Login with Email'
                      )}
                    </Button>
                  </Form.Item>
                </Form>
              </TabPane>
              
              <TabPane tab="Mobile Login" key="mobile">
                <Form
                  name="mobile-login"
                  layout="vertical"
                  onFinish={onMobileLogin}
                  size="large"
                  className="space-y-3"
                >
                  <Form.Item
                    name="mobile"
                    rules={[
                      { required: true, message: 'Please input your mobile number!' },
                      { 
                        pattern: /^\d{10}$/, 
                        message: 'Mobile number must be exactly 10 digits!' 
                      }
                    ]}
                    className="mb-3"
                  >
                    <Input 
                      prefix={<MobileOutlined className="text-gray-400" />} 
                      placeholder="Mobile Number (10 digits)" 
                      maxLength={10}
                    />
                  </Form.Item>

                  <Form.Item
                    name="password"
                    rules={[{ required: true, message: 'Please input your password!' }]}
                    className="mb-3"
                  >
                    <Input.Password
                      prefix={<LockOutlined className="text-gray-400" />}
                      placeholder="Password"
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
                          <span>Logging in...</span>
                        </>
                      ) : (
                        'Login with Mobile'
                      )}
                    </Button>
                  </Form.Item>
                </Form>
              </TabPane>
            </Tabs>

            <div className="text-center mt-2">
              <Text>Don't have an account? <a href="/signup" className="text-blue-500">Sign up now</a></Text>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}