import React, { useState } from 'react';
import Navbar from './Navbar';
import { Outlet } from 'react-router-dom';

interface UserProfile {
  initials: string;
  id: string;
}

export default function HomeLayout(): React.ReactElement {
  const [isLoggedIn, setIsLoggedIn] = useState<boolean>(false);
  const [userProfile] = useState<UserProfile>({
    initials: 'CW',
    id: 'user1'
  });

  const handleLogin = (): void => {
    setIsLoggedIn(true);
  };

  const handleLogout = (): void => {
    setIsLoggedIn(false);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex flex-col">
      {/* Fixed navbar with z-index to ensure it stays on top */}
      <div className="fixed top-0 left-0 right-0 z-10">
        <Navbar
          isLoggedIn={isLoggedIn}
          userProfile={userProfile}
          onLoginClick={handleLogin}
          onLogoutClick={handleLogout}
        />
      </div>
      
      {/* Main content with padding-top to prevent content from hiding under navbar */}
      <main className="flex-grow pt-16 mt-2">
        {/* Outlet component to render nested routes */}
        <Outlet />
      </main>
      
      <footer className="bg-gray-800 text-white py-8 px-4">
        <div className="max-w-7xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div>
              <h3 className="text-lg font-bold mb-4">Clipwrite</h3>
              <p className="text-gray-300">
                Your platform for creating and sharing amazing video content.
              </p>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Quick Links</h3>
              <ul className="space-y-2">
                <li><a href="#" className="text-gray-300 hover:text-white">Home</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white">Discover</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white">Create</a></li>
                <li><a href="#" className="text-gray-300 hover:text-white">Community</a></li>
              </ul>
            </div>
            <div>
              <h3 className="text-lg font-bold mb-4">Contact</h3>
              <ul className="space-y-2">
                <li className="text-gray-300">support@clipwrite.com</li>
                <li className="text-gray-300">1-800-CLIP-WRITE</li>
              </ul>
            </div>
          </div>
          <div className="mt-8 pt-8 border-t border-gray-700 text-center">
            <p className="text-gray-300">&copy; 2025 Clipwrite. All rights reserved.</p>
          </div>
        </div>
      </footer>
    </div>
  );
}