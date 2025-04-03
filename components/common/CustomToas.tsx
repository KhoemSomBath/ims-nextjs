import { motion, useAnimation } from 'framer-motion';
import { toast } from 'react-hot-toast';
import { CheckCircleIcon, XCircleIcon } from "lucide-react";
import { useEffect } from 'react';

interface CustomToastProps {
    id: string;
    message: string;
    type: 'success' | 'error';
    duration: number;
}

export const CustomToast = ({ id, message, type, duration }: CustomToastProps) => {
    const controls = useAnimation();

    useEffect(() => {
        controls.start('visible');
    }, [controls]);

    return (
        <motion.div
            variants={{
                hidden: { opacity: 0, y: 20, scale: 0.95 },
                visible: { opacity: 1, y: 0, scale: 1 }
            }}
            initial="hidden"
            animate={controls}
            exit="hidden"
            transition={{ type: 'spring', damping: 25, stiffness: 300 }}
            whileHover={{ scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            role="alert"
            aria-live={type === 'error' ? 'assertive' : 'polite'}
            className={`
        relative flex items-center w-full max-w-md p-6 rounded-xl
        overflow-hidden shadow-2xl  backdrop-blur-[32px]`}
        >
            {/* Animated Icon */}
            <motion.div
                initial={{ scale: 0, rotate: -30 }}
                animate={{ scale: 1, rotate: 0 }}
                transition={{ type: 'spring', delay: 0.1 }}
            >
                {type === 'success' ? (
                    <CheckCircleIcon strokeWidth={3} className="w-8 h-8 mr-4 text-brand-500 dark:text-brand-400" />
                ) : (
                    <XCircleIcon strokeWidth={3} className="w-8 h-8 mr-4 text-error-500 dark:text-error-400" />
                )}
            </motion.div>

            <div className="flex-1">
                <p className="font-bold text-theme-xl dark:text-white">{message}</p>
            </div>

            {/* Close Button */}
            <button
                onClick={() => toast.remove(id)}
                className={`
          ml-4 p-1 rounded-full transition-colors
          ${type === 'success'
                    ? 'hover:bg-brand-100/50 dark:hover:bg-brand-800/30'
                    : 'hover:bg-error-100/50 dark:hover:bg-error-800/30'
                }
        `}
                aria-label="Dismiss notification"
            >
                <XCircleIcon strokeWidth={2} className="w-6 h-6" />
            </button>

            {/* Progress Bar with Perfect Rounded Corners */}
            <div className="absolute bottom-0 left-0 right-0 h-1 overflow-hidden">
                <div className="relative h-full w-full" style={{
                    borderBottomLeftRadius: '0.75rem', // matches rounded-xl
                    borderBottomRightRadius: '0.75rem',
                    overflow: 'hidden'
                }}>
                    <motion.div
                        className={`h-full ${type === 'success'
                            ? 'bg-gradient-to-r from-brand-400 to-brand-500 dark:from-brand-500 dark:to-brand-600'
                            : 'bg-gradient-to-r from-error-400 to-error-500 dark:from-error-500 dark:to-error-600'
                        }`}
                        initial={{ width: '100%' }}
                        animate={{ width: '0%' }}
                        transition={{
                            duration: duration / 1000,
                            ease: [0.43, 0.13, 0.23, 0.96]
                        }}
                        style={{
                            position: 'absolute',
                            bottom: 0,
                            left: 0,
                            right: 0,
                            height: '100%'
                        }}
                        onAnimationComplete={() => toast.remove(id)}
                    />
                </div>
            </div>
        </motion.div>
    );
};