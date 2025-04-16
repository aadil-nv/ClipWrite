import { useState } from 'react';
import { Form, Input, Button, Typography, Spin, Tabs, message } from 'antd';
import { UserOutlined, LockOutlined, MobileOutlined, LoadingOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';
import { useNavigate } from 'react-router-dom';
import LoginImage from "../../assets/4309857.jpg";
import { AxiosError } from 'axios';
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
      const { data } = await userInstance.post('api/auth/login-email', values, { withCredentials: true });

      console.log("Login response:", data);
      
      message.success('Login successful!');
      dispatch(login({ userData:data.user, userId: data.id }));
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
      dispatch(login({ userData: data.user, userId: data.id }));
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

  // Container animation variants
  const containerVariants = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: {
        staggerChildren: 0.3
      }
    }
  };

  // Item animation variants
  const itemVariants = {
    hidden: { opacity: 0, y: 20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { duration: 0.6 }
    }
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gradient-to-br from-slate-900 to-slate-900 p-4 overflow-y-auto">
      <motion.div 
        className="w-full max-w-6xl bg-white rounded-2xl shadow-2xl flex flex-col md:flex-row overflow-hidden my-4"
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.7 }}
        role="main"
        aria-labelledby="login-title"
      >
        {/* Left Panel with Image and Animated Texts */}
        <div className="w-full md:w-5/12 bg-gradient-to-br from-blue-600 to-cyan-400 text-white p-6 md:p-8 flex flex-col">
          <div className="flex-1 flex flex-col">
            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.2, duration: 0.8 }}
              className="text-center mb-6 md:mb-8"
            >
              <Title level={2} className="text-white m-0" id="login-title">Clip Write</Title>
              <Text className="text-blue-100 text-base md:text-lg">Your writing journey starts here</Text>
            </motion.div>

            <div className="flex-1 flex items-center justify-center mb-6 md:mb-8">
              <motion.img 
                src={LoginImage} 
                alt="Writers collaborating on content" 
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
                <div className="bg-white bg-opacity-20 rounded-full p-2 mr-3 md:mr-4 flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15.232 5.232l3.536 3.536m-2.036-5.036a2.5 2.5 0 113.536 3.536L6.5 21.036H3v-3.572L16.732 3.732z" />
                  </svg>
                </div>
                <p className="text-base md:text-lg font-medium">Create engaging content with ease</p>
              </motion.div>
              
              <motion.div variants={itemVariants} className="flex items-center">
                <div className="bg-white bg-opacity-20 rounded-full p-2 mr-3 md:mr-4 flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 5H7a2 2 0 00-2 2v12a2 2 0 002 2h10a2 2 0 002-2V7a2 2 0 00-2-2h-2M9 5a2 2 0 002 2h2a2 2 0 002-2M9 5a2 2 0 012-2h2a2 2 0 012 2" />
                  </svg>
                </div>
                <p className="text-base md:text-lg font-medium">Organize your ideas efficiently</p>
              </motion.div>
              
              <motion.div variants={itemVariants} className="flex items-center">
                <div className="bg-white bg-opacity-20 rounded-full p-2 mr-3 md:mr-4 flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z" />
                  </svg>
                </div>
                <p className="text-base md:text-lg font-medium">Share your writing with the world</p>
              </motion.div>

              <motion.div variants={itemVariants} className="flex items-center">
                <div className="bg-white bg-opacity-20 rounded-full p-2 mr-3 md:mr-4 flex-shrink-0">
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 md:h-6 md:w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
                  </svg>
                </div>
                <p className="text-base md:text-lg font-medium">All your thoughts in one place</p>
              </motion.div>
            </motion.div>
          </div>
        </div>

        {/* Right Panel with Login Form */}
        <div className="w-full md:w-7/12 p-6 sm:p-8 md:p-10 flex flex-col justify-center">
          <div className="w-full max-w-md mx-auto">
            <Title level={2} className="text-center mb-1 md:mb-2 text-xl md:text-2xl">Welcome Back</Title>
            <Title level={4} className="text-center mb-6 md:mb-8 text-gray-500 font-normal text-base md:text-lg">Sign in to continue your writing journey</Title>
            
            {error && (
              <motion.div 
                initial={{ opacity: 0, y: -10 }}
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 p-3 md:p-4 text-red-600 bg-red-50 border border-red-200 rounded-lg"
                role="alert"
              >
                {error}
              </motion.div>
            )}
            
            <Tabs defaultActiveKey="email" centered className="mb-6" aria-label="Login options">
              <TabPane tab="Email Login" key="email">
                <Form
                  name="email-login"
                  layout="vertical"
                  onFinish={onEmailLogin}
                  size="large"
                  className="space-y-4 md:space-y-5"
                >
                  <Form.Item
                    name="email"
                    label={<span className="sr-only">Email</span>}
                    rules={[
                      { required: true, message: 'Please input your email!' },
                      { type: 'email', message: 'Please enter a valid email address!' }
                    ]}
                    className="mb-4 md:mb-5"
                  >
                    <Input 
                      prefix={<UserOutlined className="text-gray-400" aria-hidden="true" />} 
                      placeholder="Email" 
                      className="rounded-lg py-2"
                      aria-required="true"
                      autoComplete="email"
                    />
                  </Form.Item>

                  <Form.Item
                    name="password"
                    label={<span className="sr-only">Password</span>}
                    rules={[{ required: true, message: 'Please input your password!' }]}
                    className="mb-4 md:mb-5"
                  >
                    <Input.Password
                      prefix={<LockOutlined className="text-gray-400" aria-hidden="true" />}
                      placeholder="Password"
                      className="rounded-lg py-2"
                      aria-required="true"
                      autoComplete="current-password"
                    />
                  </Form.Item>

                  <Form.Item className="mb-4">
                    <Button 
                      type="primary" 
                      htmlType="submit" 
                      className="w-full h-10 md:h-12 flex items-center justify-center text-base rounded-lg"
                      disabled={loading}
                      aria-label={loading ? "Logging in, please wait" : "Login with Email"}
                    >
                      {loading ? (
                        <>
                          <Spin indicator={<LoadingOutlined style={{ fontSize: 16, color: 'white' }} spin />} className="mr-2" aria-hidden="true" />
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
                  className="space-y-4 md:space-y-5"
                >
                  <Form.Item
                    name="mobile"
                    label={<span className="sr-only">Mobile Number</span>}
                    rules={[
                      { required: true, message: 'Please input your mobile number!' },
                      { 
                        pattern: /^\d{10}$/, 
                        message: 'Mobile number must be exactly 10 digits!' 
                      }
                    ]}
                    className="mb-4 md:mb-5"
                  >
                    <Input 
                      prefix={<MobileOutlined className="text-gray-400" aria-hidden="true" />} 
                      placeholder="Mobile Number (10 digits)" 
                      maxLength={10}
                      className="rounded-lg py-2"
                      aria-required="true"
                      autoComplete="tel"
                      type="tel"
                      inputMode="numeric"
                    />
                  </Form.Item>

                  <Form.Item
                    name="password"
                    label={<span className="sr-only">Password</span>}
                    rules={[{ required: true, message: 'Please input your password!' }]}
                    className="mb-4 md:mb-5"
                  >
                    <Input.Password
                      prefix={<LockOutlined className="text-gray-400" aria-hidden="true" />}
                      placeholder="Password"
                      className="rounded-lg py-2"
                      aria-required="true"
                      autoComplete="current-password"
                    />
                  </Form.Item>

                  <Form.Item className="mb-4">
                    <Button 
                      type="primary" 
                      htmlType="submit" 
                      className="w-full h-10 md:h-12 flex items-center justify-center text-base rounded-lg"
                      disabled={loading}
                      aria-label={loading ? "Logging in, please wait" : "Login with Mobile"}
                    >
                      {loading ? (
                        <>
                          <Spin indicator={<LoadingOutlined style={{ fontSize: 16, color: 'white' }} spin />} className="mr-2" aria-hidden="true" />
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

            <div className="text-center mt-4 md:mt-6">
              <Text className="text-sm md:text-base">Don't have an account? <a href="/signup" className="text-blue-600 font-medium hover:text-blue-800 transition-colors">Sign up now</a></Text>
            </div>

            <div className="text-center mt-4">
              <a href="/forgot-password" className="text-sm md:text-base text-gray-600 hover:text-gray-800 transition-colors">Forgot your password?</a>
            </div>
          </div>
        </div>
      </motion.div>
    </div>
  );
}