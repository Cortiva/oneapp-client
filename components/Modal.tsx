"use client";

import { ReactNode, MouseEvent } from "react";
import Button from "./Button";
import Text from "./Text";
import { X } from "lucide-react";

interface ModalProps {
  title?: string;
  isOpen: boolean;
  onClose: () => void;
  children: ReactNode;
  isBottomModal?: boolean;
  size?: "small" | "medium" | "big" | string;
  onClick?: () => void;
  isProcessing?: boolean;
  isSingleButton?: boolean;
  buttonText?: string;
  hasButton?: boolean;
  abc?: boolean;
}

const Modal: React.FC<ModalProps> = ({
  title = "",
  isOpen,
  onClose,
  children,
  isBottomModal = false,
  size = "medium",
  onClick,
  isProcessing = false,
  isSingleButton = false,
  buttonText = "Submit",
  hasButton = true,
  abc = false,
}) => {
  if (!isOpen) return null;

  const handleOutsideClick = (e: MouseEvent<HTMLDivElement>) => {
    if (e.target === e.currentTarget) {
      onClose();
    }
  };

  const renderButtons = () => {
    if (!hasButton) return null;

    if (abc) {
      return (
        <Button
          width="w-full"
          isProcessing={isProcessing}
          isDisabled={isProcessing}
          onClick={onClick}
          isFullWidth
          isDeleteButton={buttonText.toLowerCase().includes("delete")}
        >
          {buttonText}
        </Button>
      );
    }

    if (isSingleButton) {
      return (
        <Button
          isProcessing={isProcessing}
          isDisabled={isProcessing}
          onClick={onClick}
          isFullWidth
        >
          {buttonText}
        </Button>
      );
    }

    return (
      <>
        <Button isTextButton textColor="text-primary" onClick={onClose}>
          Cancel
        </Button>
        <Button
          isProcessing={isProcessing}
          isDisabled={isProcessing}
          isDeleteButton={buttonText.toLowerCase().includes("delete")}
          onClick={onClick}
        >
          {buttonText}
        </Button>
      </>
    );
  };

  const modalSizes = {
    small: "max-w-[530px]",
    medium: "max-w-3xl",
    big: "max-w-6xl",
  };

  if (isBottomModal) {
    return (
      <div
        className="fixed inset-0 transition-opacity bg-light-bg/30 dark:bg-dark-bg/30 backdrop-blur-sm"
        style={{ height: "93vh", marginBottom: "auto" }}
        onClick={handleOutsideClick}
      >
        <div className="bg-white rounded-tr-[20px] rounded-tl-[20px] md:shadow-lg w-full p-4">
          <div className="flex justify-between items-center">
            <Text
              text={title}
              color="text-primary"
              weight="font-semibold"
              isCapitalize
            />
            <button
              onClick={onClose}
              className="text-gray-600 hover:text-gray-800 text-[30px]"
            >
              <X />
            </button>
          </div>

          <div className="mt-2 max-h-[800px] overflow-y-auto">{children}</div>

          {hasButton && (
            <div className="flex justify-end space-x-5 pt-5">
              {renderButtons()}
            </div>
          )}
        </div>
      </div>
    );
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center transition-opacity bg-light-bg/30 dark:bg-dark-bg/30 backdrop-blur-sm"
      onClick={handleOutsideClick}
    >
      <div
        className={`bg-white rounded-lg shadow-lg w-full ${
          modalSizes[size as keyof typeof modalSizes] || "max-w-xl"
        } mx-auto p-7`}
      >
        <div className="flex justify-between items-center">
          <Text
            text={title}
            color="text-primary"
            weight="font-semibold"
            isCapitalize
          />
          <button onClick={onClose} className="text-primary text-[30px]">
            <X />
          </button>
        </div>

        <div className="flex flex-col justify-between">
          <div className="max-h-[600px] overflow-y-auto py-12">{children}</div>

          {hasButton && (
            <div className="flex justify-end space-x-5">{renderButtons()}</div>
          )}
        </div>
      </div>
    </div>
  );
};

export default Modal;
