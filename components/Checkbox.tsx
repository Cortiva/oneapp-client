"use client";
import { Check } from "lucide-react";
import { FC } from "react";
import Text from "./Text";

interface CheckboxProps {
  label: string;
  isChecked: boolean;
  labelColor?: string;
  onClick: () => void;
  hasText?: boolean;
}

const Checkbox: FC<CheckboxProps> = ({
  label,
  isChecked,
  labelColor,
  onClick,
  hasText = true,
}) => {
  return (
    <div className="flex justify-start items-center space-x-3">
      <div
        className={`w-[22px] h-[22px] rounded-[4px] cursor-pointer flex justify-center items-center border-2 ${
          isChecked
            ? "border-primary-100 bg-primary-400 text-white"
            : "border-gray-300"
        }`}
        onClick={onClick}
      >
        {isChecked && <Check size={12} />}
      </div>

      {hasText && (
        <Text text={label} size="small" isCapitalize color={labelColor} />
      )}
    </div>
  );
};

export default Checkbox;
