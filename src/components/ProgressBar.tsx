import { motion } from 'framer-motion';

interface ProgressBarProps {
  current: number;
  total: number;
  label?: string;
}

export default function ProgressBar({ current, total, label }: ProgressBarProps) {
  const percentage = total > 0 ? (current / total) * 100 : 0;  return (
    <motion.div 
      className="w-full max-w-xl sm:max-w-2xl mx-auto mb-6 sm:mb-8 px-4 sm:px-0"
      initial={{ opacity: 0, y: -20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5 }}
    >
      {label && (
        <motion.div 
          className="flex justify-between items-center mb-2"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.2 }}
        >          <span className="text-xs sm:text-sm font-medium text-gray-700 dark:text-gray-300">
            {label}
          </span>
          <motion.span 
            className="text-xs sm:text-sm text-gray-500 dark:text-gray-400"
            key={`${current}-${total}`}
            initial={{ scale: 1.2, color: "#3b82f6" }}
            animate={{ scale: 1, color: "#6b7280" }}
            transition={{ duration: 0.3 }}
          >
            {current} / {total}
          </motion.span>
        </motion.div>
      )}
        <div className="w-full bg-gray-200 dark:bg-gray-700 rounded-full h-2 sm:h-3 overflow-hidden">
        <motion.div
          className="bg-gradient-to-r from-blue-500 to-purple-600 h-2 sm:h-3 rounded-full"
          initial={{ width: 0 }}
          animate={{ width: `${percentage}%` }}
          transition={{ 
            duration: 0.8, 
            ease: "easeOut",
            type: "spring",
            stiffness: 100
          }}
        />
      </div>
      
      {/* <motion.div 
        className="text-center mt-2 text-xs text-gray-500 dark:text-gray-400"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.5 }}
        key={percentage}
      >
        <motion.span
          initial={{ scale: 1.1 }}
          animate={{ scale: 1 }}
          transition={{ duration: 0.2 }}
        >
          {percentage.toFixed(1)}% Complete
        </motion.span>
      </motion.div> */}
    </motion.div>
  );
}
