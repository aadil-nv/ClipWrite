import React, { useState, useEffect, useRef } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import useAuth from '../../hooks/useAuth';
import { Link, useNavigate } from 'react-router-dom';
import { useDispatch } from 'react-redux';
import { logout as userLogout } from '../../redux/slices/userSlice';
import { userInstance } from '../../middleware/axios';

// Define proper TypeScript interfaces
interface UserProfile {
  initials: string;
  id: string;
  userName?: string;
}

interface NavbarProps {
  isLoggedIn?: boolean;
  userProfile?: UserProfile;
  onLoginClick?: () => void;
  onLogoutClick?: () => void;
  onProfileClick?: () => void;
}

export default function Navbar({
  userProfile = { initials: 'VS', id: 'user1' },
  onLoginClick = () => {},
  onLogoutClick = () => {},
  onProfileClick = () => {}
}: NavbarProps): React.ReactElement {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [scrolled, setScrolled] = useState<boolean>(false);
  const [showProfileMenu, setShowProfileMenu] = useState<boolean>(false);
  const [showLogoutModal, setShowLogoutModal] = useState<boolean>(false);
  const { user } = useAuth();
  const isUser = user.isAuthenticated;
  const profileMenuRef = useRef<HTMLDivElement>(null);
  const modalRef = useRef<HTMLDivElement>(null);
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = (): void => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Close profile menu when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent): void => {
      if (profileMenuRef.current && !profileMenuRef.current.contains(event.target as Node)) {
        setShowProfileMenu(false);
      }
    };

    document.addEventListener('mousedown', handleClickOutside);
    return () => {
      document.removeEventListener('mousedown', handleClickOutside);
    };
  }, []);

  // Close modal when ESC key is pressed
  useEffect(() => {
    const handleEscKey = (event: KeyboardEvent): void => {
      if (event.key === 'Escape' && showLogoutModal) {
        setShowLogoutModal(false);
      }
    };

    window.addEventListener('keydown', handleEscKey);
    return () => {
      window.removeEventListener('keydown', handleEscKey);
    };
  }, [showLogoutModal]);

  const handleLogin = (): void => {
    onLoginClick();
  };

  const openLogoutModal = (): void => {
    setShowLogoutModal(true);
    setShowProfileMenu(false);
  };

  const closeLogoutModal = (e: React.MouseEvent): void => {
    if (e.target === e.currentTarget) {
      setShowLogoutModal(false);
    }
  };

  const handleLogout = (): void => {
    onLogoutClick();
    userInstance.post("api/auth/logout");
    dispatch(userLogout());
    navigate("/");
    setShowLogoutModal(false);
  };

  const handleProfileClick = (): void => {
    onProfileClick();
    setShowProfileMenu(false);
    navigate("/user/profile/");
  };

  const toggleProfileMenu = (): void => {
    setShowProfileMenu(!showProfileMenu);
  };

  return (
    <>
      <motion.nav 
        className={`fixed w-full z-40 transition-all duration-300 ${
          scrolled ? 'bg-slate-900/95 shadow-lg' : 'bg-gradient-to-r from-slate-800 to-slate-900'
        }`}
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.5 }}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-16">
            {/* Logo */}
            <div className="flex-shrink-0">
              <Link to="/" className="flex items-center no-underline">
                <motion.div 
                  className="flex items-center"
                  whileHover={{ scale: 1.05 }}
                >
                  <div className="h-8 w-8 bg-gradient-to-br from-emerald-500 to-cyan-400 rounded-md flex items-center justify-center mr-2">
                    <span className="text-white font-bold">C</span>
                  </div>
                  <span className="text-white font-bold text-xl">ClipWrite</span>
                </motion.div>
              </Link>
            </div>

            {/* Search box */}
            <div className="hidden md:block flex-grow max-w-md mx-8">
              <div className="relative">
                <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                  </svg>
                </div>
                <input
                  className="block w-full bg-slate-700 border border-slate-600 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder-gray-400 focus:outline-none focus:bg-slate-600 focus:border-slate-500"
                  type="text"
                  placeholder="Search..."
                />
              </div>
            </div>

            {/* Desktop options */}
            <div className="hidden md:flex items-center">
              {/* Conditional rendering based on login state */}
              {isUser ? (
                <motion.div 
                  className="flex items-center ml-3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {/* Create button */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-1 rounded-lg font-medium text-sm mr-3"
                    onClick={() => navigate("/user/add-blogs")}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    New Clip
                  </motion.button>
                  
                  {/* Profile dropdown */}
                  <div className="relative" ref={profileMenuRef}>
                    <motion.div 
                      className="flex items-center"
                      whileHover={{ scale: 1.05 }}
                      onClick={toggleProfileMenu}
                    >
                      <div className="bg-slate-700 p-1 px-3 rounded-full border-2 border-emerald-400 cursor-pointer flex items-center">
                        <span className="text-sm font-medium text-white mr-1">{user.userData.name || userProfile.initials}</span>
                        <svg className="h-4 w-4 text-gray-300" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                          <path fillRule="evenodd" d="M5.293 7.293a1 1 0 011.414 0L10 10.586l3.293-3.293a1 1 0 111.414 1.414l-4 4a1 1 0 01-1.414 0l-4-4a1 1 0 010-1.414z" clipRule="evenodd" />
                        </svg>
                      </div>
                    </motion.div>
                    
                    {/* Profile dropdown menu */}
                    <AnimatePresence>
                      {showProfileMenu && (
                        <motion.div 
                          className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-10"
                          initial={{ opacity: 0, y: -10, scale: 0.95 }}
                          animate={{ opacity: 1, y: 0, scale: 1 }}
                          exit={{ opacity: 0, y: -10, scale: 0.95 }}
                          transition={{ duration: 0.2 }}
                        >
                          <button 
                            onClick={handleProfileClick}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-slate-100"
                          >
                            Profile
                          </button>
                          <button 
                            onClick={openLogoutModal}
                            className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-slate-100"
                          >
                            Logout
                          </button>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                </motion.div>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-emerald-500 to-cyan-400 text-white px-4 py-2 rounded-lg font-medium text-sm"
                  onClick={handleLogin}
                >
                  Sign In
                </motion.button>
              )}
            </div>

            {/* Mobile menu button and search */}
            <div className="md:hidden flex items-center">
              {/* Search button for mobile */}
              <button className="mr-2 p-1 rounded-md text-gray-100 hover:text-white hover:bg-slate-700 focus:outline-none">
                <svg className="h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                </svg>
              </button>
              
              {/* Show profile or login on mobile */}
              {isUser ? (
                <div className="relative mr-2" ref={profileMenuRef}>
                  <motion.div 
                    whileTap={{ scale: 0.95 }}
                    onClick={toggleProfileMenu}
                  >
                    <div className="bg-slate-700 p-1 rounded-full border-2 border-emerald-400">
                      <span className="text-sm font-medium text-white">{user.userData.name?.[0]?.toUpperCase() || userProfile.initials}</span>
                    </div>
                  </motion.div>
                  
                  {/* Mobile profile menu */}
                  <AnimatePresence>
                    {showProfileMenu && (
                      <motion.div 
                        className="absolute right-0 mt-2 w-48 bg-white rounded-lg shadow-lg py-1 z-10"
                        initial={{ opacity: 0, y: -10, scale: 0.95 }}
                        animate={{ opacity: 1, y: 0, scale: 1 }}
                        exit={{ opacity: 0, y: -10, scale: 0.95 }}
                        transition={{ duration: 0.2 }}
                      >
                        <button 
                          onClick={handleProfileClick}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-slate-100"
                        >
                          Profile
                        </button>
                        <button 
                          onClick={openLogoutModal}
                          className="block w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-slate-100"
                        >
                          Logout
                        </button>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-emerald-500 to-cyan-400 text-white px-3 py-1 rounded-lg font-medium text-sm mr-2"
                  onClick={handleLogin}
                >
                  Sign In
                </motion.button>
              )}
              
              <motion.button
                onClick={() => setIsOpen(!isOpen)}
                className="inline-flex items-center justify-center p-2 rounded-md text-gray-100 hover:text-white hover:bg-slate-700 focus:outline-none"
                whileTap={{ scale: 0.95 }}
              >
                <span className="sr-only">Open menu</span>
                {!isOpen ? (
                  <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M4 6h16M4 12h16M4 18h16" />
                  </svg>
                ) : (
                  <svg className="block h-6 w-6" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke="currentColor" aria-hidden="true">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M6 18L18 6M6 6l12 12" />
                  </svg>
                )}
              </motion.button>
            </div>
          </div>
        </div>

        {/* Mobile menu */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              className="md:hidden"
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              transition={{ duration: 0.3 }}
            >
              {/* Mobile search */}
              <div className="px-2 pt-2 pb-3">
                <div className="relative">
                  <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M8 4a4 4 0 100 8 4 4 0 000-8zM2 8a6 6 0 1110.89 3.476l4.817 4.817a1 1 0 01-1.414 1.414l-4.816-4.816A6 6 0 012 8z" clipRule="evenodd" />
                    </svg>
                  </div>
                  <input
                    className="block w-full bg-slate-700 border border-slate-600 rounded-lg pl-10 pr-4 py-2 text-sm text-white placeholder-gray-400 focus:outline-none focus:bg-slate-600 focus:border-slate-500"
                    type="text"
                    placeholder="Search..."
                  />
                </div>
              </div>
              
              {/* Only show create button when logged in */}
              {isUser && (
                <div className="px-2 pb-3">
                  <motion.button
                    whileTap={{ scale: 0.95 }}
                    className="w-full text-left bg-emerald-500 hover:bg-emerald-600 text-white px-3 py-2 rounded-lg font-medium text-base"
                    onClick={() => navigate("/user/add-blogs")}
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline mr-2" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    New Clip
                  </motion.button>
                </div>
              )}
            </motion.div>
          )}
        </AnimatePresence>
      </motion.nav>

      {/* Custom Logout Modal - No UI libraries */}
      {showLogoutModal && (
        <div 
        className="fixed inset-0 flex items-center justify-center backdrop-blur-sm bg-black/30 z-50"
        onClick={closeLogoutModal}
        aria-modal="true"
        role="dialog"
      >
          <motion.div
            ref={modalRef}
            className="bg-white rounded-lg overflow-hidden shadow-xl w-full max-w-md mx-4"
            initial={{ opacity: 0, y: 20, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            transition={{ duration: 0.2 }}
            onClick={(e) => e.stopPropagation()}
          >
            <div className="border-b border-gray-200">
              <div className="px-6 py-4 flex items-center justify-between">
                <h3 className="text-lg font-medium text-gray-900">Confirm Logout</h3>
                <button
                  className="text-gray-400 hover:text-gray-600 focus:outline-none"
                  onClick={() => setShowLogoutModal(false)}
                >
                  <svg className="h-5 w-5" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z" clipRule="evenodd" />
                  </svg>
                </button>
              </div>
            </div>
            
            <div className="px-6 py-4">
              <p className="text-sm text-gray-600">
                Are you sure you want to log out? You will need to sign in again to access your account.
              </p>
            </div>
            
            <div className="px-6 py-4 bg-gray-50 flex justify-end space-x-3">
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 focus:outline-none"
                onClick={() => setShowLogoutModal(false)}
              >
                Cancel
              </motion.button>
              <motion.button
                whileHover={{ scale: 1.03 }}
                whileTap={{ scale: 0.97 }}
                className="px-4 py-2 text-sm font-medium text-white bg-red-600 border border-transparent rounded-md shadow-sm hover:bg-red-700 focus:outline-none"
                onClick={handleLogout}
              >
                Logout
              </motion.button>
            </div>
          </motion.div>
        </div>
      )}
    </>
  );
}