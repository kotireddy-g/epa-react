import { useEffect } from 'react';
import { motion } from 'framer-motion';
import { Lightbulb, ArrowRight, FileText, TrendingUp } from 'lucide-react';

interface IntroVideoPageProps {
  onComplete: () => void;
}

export function IntroVideoPage({ onComplete }: IntroVideoPageProps) {
  useEffect(() => {
    // Auto redirect after 10 seconds
    const timer = setTimeout(() => {
      onComplete();
    }, 10000);

    return () => clearTimeout(timer);
  }, [onComplete]);

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-600 via-indigo-600 to-purple-700 flex items-center justify-center overflow-hidden">
      <div className="text-center">
        {/* Animated sequence */}
        <div className="flex items-center justify-center gap-8 mb-8">
          {/* Idea */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 0 }}
            className="relative"
          >
            <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center shadow-2xl">
              <Lightbulb className="w-16 h-16 text-yellow-500" />
            </div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
              className="text-white mt-4"
            >
              IDEA
            </motion.p>
          </motion.div>

          {/* Arrow 1 */}
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 1 }}
          >
            <ArrowRight className="w-12 h-12 text-white" />
          </motion.div>

          {/* Business Plan */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 1.5 }}
            className="relative"
          >
            <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center shadow-2xl">
              <FileText className="w-16 h-16 text-blue-600" />
            </div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 2 }}
              className="text-white mt-4"
            >
              BUSINESS PLAN
            </motion.p>
          </motion.div>

          {/* Arrow 2 */}
          <motion.div
            initial={{ x: -50, opacity: 0 }}
            animate={{ x: 0, opacity: 1 }}
            transition={{ duration: 0.5, delay: 2.5 }}
          >
            <ArrowRight className="w-12 h-12 text-white" />
          </motion.div>

          {/* Success */}
          <motion.div
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ duration: 0.5, delay: 3 }}
            className="relative"
          >
            <div className="w-32 h-32 bg-white rounded-full flex items-center justify-center shadow-2xl">
              <TrendingUp className="w-16 h-16 text-green-600" />
            </div>
            <motion.p
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 3.5 }}
              className="text-white mt-4"
            >
              SUCCESS
            </motion.p>
          </motion.div>
        </div>

        {/* Main Title */}
        <motion.div
          initial={{ y: 50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          transition={{ duration: 0.8, delay: 4 }}
          className="mt-12"
        >
          <h1 className="text-5xl text-white mb-4">IDEA to Business</h1>
          <p className="text-xl text-white/90">Transform your ideas into reality</p>
        </motion.div>

        {/* Loading indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 4.5 }}
          className="mt-8"
        >
          <div className="w-48 h-1 bg-white/30 rounded-full mx-auto overflow-hidden">
            <motion.div
              initial={{ width: 0 }}
              animate={{ width: '100%' }}
              transition={{ duration: 10, ease: 'linear' }}
              className="h-full bg-white rounded-full"
            />
          </div>
        </motion.div>
      </div>
    </div>
  );
}
