import React from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import Text from "./Text";
import Button from "./Button";

type ModalSideProps = {
  isOpen: boolean;
  onClose: () => void;
  children: React.ReactNode;
  title?: string;
  onClick?: () => void;
  isProcessing?: boolean;
  buttonText?: string;
  isSingleButton?: boolean;
};

const ModalSide = ({
  isOpen,
  onClose,
  children,
  title,
  onClick,
  isProcessing,
  buttonText,
  isSingleButton = false,
}: ModalSideProps) => {
  return (
    <AnimatePresence>
      {isOpen && (
        <>
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.5 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 bg-slate-950/20 dark:bg-gray-400/20 backdrop-blur-sm"
            onClick={onClose}
          />

          <motion.div
            initial={{ x: "100%" }}
            animate={{ x: 0 }}
            exit={{ x: "100%" }}
            transition={{ type: "tween", duration: 0.3 }}
            className="fixed top-0 right-0 w-full sm:w-[90%] md:w-[70%] lg:w-[60%] h-full bg-light-card dark:bg-dark-card z-50 shadow-lg"
          >
            <div className="flex items-center justify-between p-[17px] shadow-[0_4px_2px_-2px_rgba(0,0,0,0.1)]">
              <Text text={title} isTitleText={true} />
              <button
                onClick={onClose}
                className="text-[#545454] dark:text-[#CBD5E1]"
              >
                <X size={20} />
              </button>
            </div>

            <div className="p-5 h-[92%] overflow-y-auto flex flex-col justify-between">
              <div className="">{children}</div>
              <div className="flex flex-row space-x-5 justify-end items-center">
                <Button
                  isTextButton={true}
                  textColor="text-[#363636] dark:text-[#F8FAFC]"
                  onClick={onClose}
                >
                  Close
                </Button>
                {!isSingleButton && (
                  <Button
                    isProcessing={isProcessing}
                    isDisabled={isProcessing}
                    onClick={onClick}
                  >
                    {buttonText}
                  </Button>
                )}
              </div>
            </div>
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
};

export default ModalSide;
