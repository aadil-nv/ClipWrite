import { motion } from 'framer-motion';
import { Link } from 'react-router-dom';
import image404 from "../../assets/404.png";

export const Dashboard404 = () => {

  return (
    <div className={`min-h-screen bg-white flex items-center justify-center px-4`}>
      <div className="text-center">
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.2 }}
          className="mb-8"
        >
         
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="w-full max-w-md mx-auto"
          >
            <motion.img 
              src={image404} 
              alt="404 illustration" 
              className="w-full h-auto"
              initial={{ scale: 0.8, opacity: 0 }}
              animate={{ scale: 1, opacity: 1 }}
              transition={{
                duration: 0.8,
                ease: "easeOut",
                delay: 0.6
              }}
              whileHover={{ 
                scale: 1.05,
                transition: { duration: 0.3 }
              }}
            />
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.7 }}
          className="mb-8"
        >
          <h2 className={`text-2xl md:text-4xl font-bold mb-4 text-black`}>
            Oops! Page not found
          </h2>
          <p className={`text-lg md:text-xl max-w-md mx-auto text-black`}>
            The page you're looking for doesn't exist or has been moved.
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.8 }}
        >
          <Link to="/">
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              className={`px-8 py-3 rounded-lg text-lg font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-offset-2 text-black`}
            >
              Return Home
            </motion.button>
          </Link>
        </motion.div>
      </div>
    </div>
  );
};

