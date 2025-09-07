"use client";

import { useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useAlert } from "@/hooks/useAlert";
import Warning from "@/components/svg/Warning";
import Close from "@/components/svg/Close";
import Success from "@/components/svg/Success";

const Alert = () => {
  const { alert, hideAlert } = useAlert();
  const { message, isVisible, duration, isSuccess } = alert;

  useEffect(() => {
    if (isVisible && message) {
      const timer = setTimeout(() => {
        hideAlert();
      }, duration * 1000);

      return () => clearTimeout(timer);
    }
  }, [isVisible, message, duration, hideAlert]);


  return (
    <div className="fixed top-4 right-4 z-[60] max-w-sm">
      <AnimatePresence>
        {isVisible && message && (
          <motion.div
            initial={{ opacity: 0, x: 100, scale: 0.8 }}
            animate={{ opacity: 1, x: 0, scale: 1 }}
            exit={{ opacity: 0, x: 100, scale: 0.8 }}
            transition={{
              type: "spring",
              stiffness: 300,
              damping: 30,
              duration: 0.3
            }}
            className={`text-white pl-6 pr-12 py-4 rounded-lg shadow-lg border ${isSuccess ? "bg-green-500" : "bg-red-500"}`}
          >
            <div className="flex items-center justify-between">
              <div className="flex items-center justify-center gap-6">
                <motion.div
                  initial={{ scale: 0, rotate: -180 }}
                  animate={{ scale: 1, rotate: 0 }}
                  transition={{ delay: 0.2, type: "spring", stiffness: 300 }}
                >
                  {isSuccess ? <Success stroke="white" width={20} height={20} /> : <Warning />}
                </motion.div>
                <motion.span
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.1 }}
                  className="text-sm font-medium"
                >
                  {message}
                </motion.span>
              </div>
              <button
                onClick={() => hideAlert()}
              >
                <div className="cursor-pointer absolute top-3 right-3">
                  <Close stroke="white" width={8} height={8} />
                </div>
              </button>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
};

export default Alert;