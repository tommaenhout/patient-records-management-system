"use client";

import { useEffect, useState } from "react";
import { createPortal } from "react-dom";
import { motion, AnimatePresence } from "framer-motion";
import Close from "@/components/svg/Close";

// use the isOpen state in the parent component to control the scroll behavior as overflow is " " when the modal unmounts

interface ModalProps {
  children: React.ReactNode;
  onClose: () => void;
  isOpen: boolean;
}

export const Modal = ({ children, onClose, isOpen  }: ModalProps) => {
  const [mounted, setMounted] = useState<boolean>(false);

  useEffect(() => {
    setMounted(true);

    if (isOpen) {
      document.body.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
    }

    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      setMounted(false);
      document.body.style.overflow = "";
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [onClose, isOpen]);

  if (!mounted) return null;

  const portalRoot = document.getElementById("modal-root");
  if (!portalRoot) return null;

  return createPortal(
    <AnimatePresence>
      {isOpen && (
        <motion.div
          key="backdrop"
          className={`fixed inset-0 z-[100] p-2 flex items-center justify-center bg-black/50`}
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.3 }}
        >
          <div className={`${ 'inset-0 p-2 flex w-full justify-center h-fit max-h-[calc(100vh-10px)]'}`}>
            <AnimatePresence>
              {isOpen && (
                <motion.div
                  key="modal"
                  onClick={(e: React.MouseEvent) => e.stopPropagation()}
                  initial={{ scale: 0.8, y: -20 }}
                  animate={{ scale: 1, y: 0 }}
                  exit={{ scale: 0.8, y: -20 }}
                  transition={{ duration: 0.1 }}
                  className="bg-white border-2 border-gray-100 overflow-y-auto rounded-[8px] p-6 shadow-xl w-full md:w-[630px] relative"
                >
                  <div
                    onClick={onClose}
                    className="absolute hover:scale-110 transition-all top-4 right-4"
                  >
                    <Close stroke="gray" className="w-3 h-3 cursor-pointer" />
                  </div>
                  {children}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        </motion.div>
      )}
    </AnimatePresence>,
    portalRoot
  );
};
