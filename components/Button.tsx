import { Loader2 } from "lucide-react";
import React from "react";

type ButtonProps = {
  children: React.ReactNode;
  onClick?: () => void;
  isProcessing?: boolean;
  width?: string;
  height?: string;
  color?: string;
  textColor?: string;
  isFullWidth?: boolean;
  isTextButton?: boolean;
  isDeleteButton?: boolean;
  isDisabled?: boolean;
};

const Button: React.FC<ButtonProps> = ({
  children,
  onClick,
  isProcessing = false,
  width = "10px",
  height = "h-[50px]",
  color = "bg-primary dark:bg-primary-400",
  textColor = "text-white",
  isFullWidth = false,
  isTextButton = false,
  isDeleteButton = false,
  isDisabled = false,
}) => {
  const computedClass = `
    flex flex-wrap whitespace-nowrap justify-center items-center 
    rounded-full capitalize tracking-wider text-[14px] lg:text-[15px] 
    px-5 lg:px-7 cursor-pointer ${height} ${textColor} ${
    isDisabled
      ? "bg-slate-200 text-gray-800"
      : isTextButton
      ? "bg-transparent"
      : isDeleteButton
      ? "bg-red-500"
      : color
  }
  `;

  return (
    <button
      onClick={onClick}
      disabled={isDisabled}
      className={computedClass.trim()}
      style={{
        minWidth: !isFullWidth ? width : "100%",
        width: isFullWidth ? "100%" : "fit-content",
      }}
    >
      {isProcessing ? (
        <Loader2 className="animate-spin-fast mr-3 text-primary-300" />
      ) : (
        children
      )}
    </button>
  );
};

export default Button;
