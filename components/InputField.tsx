"use client";

import { forwardRef, useState } from "react";
import { Eye, EyeClosed, Loader2 } from "lucide-react";

export interface InputFieldProps {
  id: string;
  label?: string;
  errorText?: string;
  type?: string;
  value: string;
  onChange: (e: React.ChangeEvent<HTMLInputElement>) => void;
  placeholder?: string;
  showError?: boolean;
  required?: boolean;
  min?: string;
  max?: string;
  step?: string;
  onKeyUp?: React.KeyboardEventHandler<HTMLInputElement>;
  onKeyDown?: React.KeyboardEventHandler<HTMLInputElement>;
  onFocus?: React.FocusEventHandler<HTMLInputElement>;
  onBlur?: React.FocusEventHandler<HTMLInputElement>;
  prefixIcon?: React.ReactNode;
  isDisabled?: boolean;
  isPassword?: boolean;
  hasPrefix?: boolean;
  hasMt?: boolean;
  maxLength?: number;
  hasCounter?: boolean;
  isPhoneInput?: boolean;
  showProcessingIcon?: boolean;
  countryCode?: string;
  background?: string;
}

const InputField = forwardRef<HTMLInputElement, InputFieldProps>(
  (
    {
      id,
      label,
      errorText,
      type = "text",
      value,
      onChange,
      placeholder,
      showError,
      required = false,
      min,
      max,
      step,
      onKeyUp,
      onKeyDown,
      onFocus,
      onBlur,
      prefixIcon,
      isDisabled = false,
      isPassword = false,
      hasPrefix = false,
      hasMt = true,
      maxLength,
      hasCounter = false,
      showProcessingIcon = false,
      background = "bg-light-bg dark:bg-dark-bg",
    },
    ref
  ) => {
    const [showPassword, setShowPassword] = useState(false);
    const togglePasswordVisibility = () => setShowPassword((prev) => !prev);
    const inputType = isPassword ? (showPassword ? "text" : "password") : type;

    const hasError = required && showError && !value;

    return (
      <div className={hasMt ? "mt-2" : ""}>
        {label && (
          <label
            htmlFor={id}
            className="block leading-6 text-[#545454] dark:text-[#CBD5E1] text-[13px]"
          >
            {label}
          </label>
        )}

        <div className="mt-1 relative flex items-center space-x-3">
          <input
            id={id}
            type={inputType}
            placeholder={placeholder}
            value={value}
            onChange={onChange}
            onKeyUp={onKeyUp}
            onKeyDown={onKeyDown}
            onBlur={onBlur}
            onFocus={onFocus}
            ref={ref}
            maxLength={maxLength}
            required
            disabled={isDisabled}
            min={["date", "time"].includes(type) ? min : undefined}
            max={["date", "time"].includes(type) ? max : undefined}
            step={type === "time" ? step : undefined}
            className={`relative p-4 ${
              hasPrefix ? "pl-11" : ""
            } rounded-[14px] w-full text-[14px] md:text-[15px] lg:text-[16px] text-[#545454] dark:text-[#CBD5E1] ${background} drop-shadow-xs transition-all duration-200 ease-in-out focus:drop-shadow-sm focus:border-primary-300 dark:focus:border-primary-50 placeholder:text-slate-300 dark:placeholder:text-slate-600 ${
              showError ? "border border-error dark:border-error-300" : ""
            } ${isDisabled ? "bg-light-bg dark:bg-dark-bg" : ""}`}
          />

          {hasPrefix && <span className="absolute left-4">{prefixIcon}</span>}

          {!showProcessingIcon && isPassword && (
            <span
              className="absolute right-4 cursor-pointer p-2"
              onClick={togglePasswordVisibility}
            >
              {showPassword ? (
                <Eye className="text-[#545454] dark:text-[#CBD5E1]" />
              ) : (
                <EyeClosed className="text-[#545454] dark:text-[#CBD5E1]" />
              )}
            </span>
          )}

          {showProcessingIcon && (
            <span className="absolute right-4">
              <Loader2 className="animate-spin-fast text-primary dark:text-primary-300 text-2xl" />
            </span>
          )}
        </div>

        {hasCounter && value && (
          <div className="mt-3">
            <p className="text-[12px] text-[#545454] dark:text-[#CBD5E1]">
              {value.length} / {maxLength} characters
            </p>
          </div>
        )}

        {hasError && (
          <div className="text-error dark:text-error-300 mt-2 text-[12px]">
            {errorText || `${label} is required`}
          </div>
        )}
      </div>
    );
  }
);

InputField.displayName = "InputField";

export default InputField;
