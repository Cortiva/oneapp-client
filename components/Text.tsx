import React from "react";

type TextProps = {
  text: React.ReactNode;
  mb?: string;
  size?: "small" | "regular" | "big";
  weight?: string;
  isTitleText?: boolean;
  color?: string;
  titleColor?: string;
  isCapitalize?: boolean;
  isUppercase?: boolean;
  hasHover?: boolean;
  hasUnderline?: boolean;
  hoverColor?: string;
  isClickable?: boolean;
  onClick?: () => void;
};

const Text: React.FC<TextProps> = ({
  text,
  mb = "",
  size = "regular",
  weight = "font-regular",
  isTitleText = false,
  color = "text-[#545454] dark:text-[#CBD5E1]",
  titleColor = "text-[#363636] dark:text-[#F8FAFC]",
  isCapitalize = false,
  isUppercase = false,
  hasHover = false,
  hasUnderline = false,
  hoverColor = "text-primary",
  isClickable = false,
  onClick,
}) => {
  const sizeClasses: Record<string, string> = {
    big: "text-[18px] md:text-[19px] lg:text-[20px]",
    small: "text-[11px] md:text-[12px] lg:text-[13px]",
    regular: "text-[15px] md:text-[16px] lg:text-[17px]",
    title: "text-[19px] md:text-[20px] lg:text-[22px] font-semibold",
  };

  const textColor = isTitleText ? titleColor : color;

  const classes = [
    mb,
    weight,
    sizeClasses[isTitleText ? "title" : size],
    textColor,
    isCapitalize && "capitalize",
    isUppercase && "uppercase",
    hasUnderline && "underline",
    (hasHover || isClickable) && "cursor-pointer",
    hasHover && hoverColor,
  ]
    .filter(Boolean)
    .join(" ");

  return isTitleText ? (
    <h1 className={classes} onClick={onClick}>
      {text}
    </h1>
  ) : (
    <p className={classes} onClick={onClick}>
      {text}
    </p>
  );
};

export default Text;
