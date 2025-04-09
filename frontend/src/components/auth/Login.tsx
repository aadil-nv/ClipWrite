import { useState } from 'react';
import { Form, Input, Button, Typography, Spin } from 'antd';
import { UserOutlined, LockOutlined, LoadingOutlined } from '@ant-design/icons';
import { motion } from 'framer-motion';
import LoginImage from "../../assets/4309857.jpg";

const { Title, Text } = Typography;

interface LoginFormValues {
  email: string;
  password: string;
}

export function Login(): React.ReactElement {
  const [loading, setLoading] = useState<boolean>(false);
  const [error, setError] = useState<string | null>(null);
  
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const onFinish = (values: LoginFormValues): void => {
    setLoading(true);
    // Simulate login process for UI demonstration
    setTimeout(() => {
      setLoading(false);
      setError('Authentication failed. Please check your credentials.');
      // Uncomment the above line to demonstrate error state
    }, 2000);
  };

  return (
    <div className="fixed inset-0 flex items-center justify-center bg-gray-100">
      <motion.div 
        className="w-full max-w-4xl h-96 md:h-120 bg-white rounded-lg shadow-xl flex flex-col md:flex-row overflow-hidden"
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
            
            <Form
              name="login"
              layout="vertical"
              onFinish={onFinish}
              size="large"
              className="space-y-3"
            >
              <Form.Item
                name="email"
                rules={[{ required: true, message: 'Please input your email!' }]}
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
                    'Login'
                  )}
                </Button>
              </Form.Item>

              <div className="text-center mt-2">
                <Text>Don't have an account? <a href="/signup" className="text-blue-500">Sign up now</a></Text>
              </div>
            </Form>
          </div>
        </div>
      </motion.div>
    </div>
  );
}