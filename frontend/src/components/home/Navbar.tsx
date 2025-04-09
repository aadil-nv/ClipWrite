import React, { useState, useEffect } from 'react';
import { motion, AnimatePresence, Variants } from 'framer-motion';

// Define proper TypeScript interfaces
interface MenuItem {
  name: string;
  href: string;
}

interface UserProfile {
  initials: string;
  id: string;
}

interface NavbarProps {
  isLoggedIn?: boolean;
  userProfile?: UserProfile;
  onLoginClick?: () => void;
  onLogoutClick?: () => void;
}

export default function Navbar({
  isLoggedIn = false,
  userProfile = { initials: 'VS', id: 'user1' },
  onLoginClick = () => {},
  onLogoutClick = () => {}
}: NavbarProps): React.ReactElement {
  const [isOpen, setIsOpen] = useState<boolean>(false);
  const [scrolled, setScrolled] = useState<boolean>(false);

  // Handle scroll effect for navbar
  useEffect(() => {
    const handleScroll = (): void => {
      setScrolled(window.scrollY > 50);
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  // Menu items
  const menuItems: MenuItem[] = [
    { name: "Home", href: "#home" },
    { name: "Videos", href: "#videos" },
    { name: "Blog", href: "#blog" },
    { name: "About", href: "#about" },
    { name: "Contact", href: "#contact" }
  ];

  // Animation variants
  const navbarVariants: Variants = {
    hidden: { opacity: 0, y: -20 },
    visible: { 
      opacity: 1, 
      y: 0,
      transition: { 
        type: "spring", 
        stiffness: 100, 
        damping: 15 
      }
    }
  };

  const mobileMenuVariants: Variants = {
    closed: { 
      opacity: 0,
      height: 0,
      transition: {
        staggerChildren: 0.05,
        staggerDirection: -1,
        when: "afterChildren"
      }
    },
    open: { 
      opacity: 1,
      height: "auto",
      transition: {
        staggerChildren: 0.1,
        delayChildren: 0.1
      }
    }
  };

  const itemVariants: Variants = {
    closed: { opacity: 0, x: -50 },
    open: { opacity: 1, x: 0 }
  };

  const logoVariants: Variants = {
    hover: { 
      scale: 1.1,
      rotate: [0, -5, 5, -5, 0],
      transition: { duration: 0.5 }
    }
  };

  const handleLogin = (): void => {
    onLoginClick();
  };

  const handleLogout = (): void => {
    onLogoutClick();
  };

  return (
    <motion.nav 
      className={`fixed w-full z-50 transition-all duration-300 ${
        scrolled ? 'bg-indigo-900/95 shadow-lg' : 'bg-gradient-to-r from-purple-800 to-indigo-900'
      }`}
      initial="hidden"
      animate="visible"
      variants={navbarVariants}
    >
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="flex items-center justify-between h-16">
          {/* Logo */}
          <div className="flex-shrink-0">
            <motion.div 
              className="flex items-center"
              variants={logoVariants}
              whileHover="hover"
            >
              <div className="h-8 w-8 bg-gradient-to-br from-pink-500 to-orange-400 rounded-full flex items-center justify-center mr-2">
                <span className="text-white font-bold">V</span>
              </div>
              <span className="text-white font-bold text-xl">VlogSpace</span>
            </motion.div>
          </div>

          {/* Desktop menu */}
          <div className="hidden md:block">
            <div className="ml-10 flex items-baseline space-x-4">
              {menuItems.map((item) => (
                <motion.a
                  key={item.name}
                  href={item.href}
                  className="text-gray-100 hover:bg-indigo-700 px-3 py-2 rounded-md text-sm font-medium"
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                >
                  {item.name}
                </motion.a>
              ))}
              
              {/* Conditional rendering based on login state */}
              {isLoggedIn ? (
                <motion.div 
                  className="flex items-center ml-3"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                >
                  {/* Create button */}
                  <motion.button
                    whileHover={{ scale: 1.05 }}
                    whileTap={{ scale: 0.95 }}
                    className="bg-pink-500 text-white px-3 py-1 rounded-md font-medium text-sm mr-3"
                  >
                    <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4 inline mr-1" viewBox="0 0 20 20" fill="currentColor">
                      <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                    </svg>
                    New Vlog
                  </motion.button>
                  
                  {/* Profile dropdown */}
                  <motion.div 
                    className="relative"
                    whileHover={{ scale: 1.05 }}
                    onClick={handleLogout}
                  >
                    <div className="bg-indigo-700 p-1 rounded-full border-2 border-pink-300 cursor-pointer">
                      <span className="text-sm font-medium text-white">{userProfile.initials}</span>
                    </div>
                  </motion.div>
                </motion.div>
              ) : (
                <motion.button
                  whileHover={{ scale: 1.05 }}
                  whileTap={{ scale: 0.95 }}
                  className="bg-gradient-to-r from-pink-500 to-orange-400 text-white px-4 py-2 rounded-md font-medium text-sm"
                  onClick={handleLogin}
                >
                  Sign In
                </motion.button>
              )}
            </div>
          </div>

          {/* Mobile menu button */}
          <div className="md:hidden flex items-center">
            {/* Show profile or login on mobile */}
            {isLoggedIn ? (
              <motion.div 
                className="mr-3"
                whileTap={{ scale: 0.95 }}
                onClick={handleLogout}
              >
                <div className="bg-indigo-700 p-1 rounded-full border-2 border-pink-300">
                  <span className="text-sm font-medium text-white">{userProfile.initials}</span>
                </div>
              </motion.div>
            ) : (
              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                className="bg-gradient-to-r from-pink-500 to-orange-400 text-white px-3 py-1 rounded-md font-medium text-sm mr-3"
                onClick={handleLogin}
              >
                Sign In
              </motion.button>
            )}
            
            <motion.button
              onClick={() => setIsOpen(!isOpen)}
              className="inline-flex items-center justify-center p-2 rounded-md text-gray-100 hover:text-white hover:bg-indigo-700 focus:outline-none"
              whileTap={{ scale: 0.95 }}
            >
              <span className="sr-only">Open main menu</span>
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
            className="md:hidden bg-indigo-800"
            variants={mobileMenuVariants}
            initial="closed"
            animate="open"
            exit="closed"
          >
            <div className="px-2 pt-2 pb-3 space-y-1 sm:px-3">
              {menuItems.map((item) => (
                <motion.a
                  key={item.name}
                  href={item.href}
                  className="text-gray-100 hover:bg-indigo-700 block px-3 py-2 rounded-md text-base font-medium"
                  variants={itemVariants}
                  whileTap={{ scale: 0.95 }}
                  onClick={() => setIsOpen(false)}
                >
                  {item.name}
                </motion.a>
              ))}
              
              {/* Only show create button when logged in */}
              {isLoggedIn && (
                <motion.button
                  variants={itemVariants}
                  whileTap={{ scale: 0.95 }}
                  className="w-full text-left bg-pink-500 text-white px-3 py-2 rounded-md font-medium text-base"
                >
                  <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5 inline mr-2" viewBox="0 0 20 20" fill="currentColor">
                    <path fillRule="evenodd" d="M10 3a1 1 0 011 1v5h5a1 1 0 110 2h-5v5a1 1 0 11-2 0v-5H4a1 1 0 110-2h5V4a1 1 0 011-1z" clipRule="evenodd" />
                  </svg>
                  New Vlog
                </motion.button>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.nav>
  );
}