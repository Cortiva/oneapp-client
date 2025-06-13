"use client";

import Text from "./Text";

interface LabelProps {
  title: string;
  type?: "success" | "error" | "warning" | "info";
}

const Label = ({ title, type = "info" }: LabelProps) => {
  let color = "";

  switch (type) {
    case "success":
      color = "bg-success text-white";
      break;
    case "error":
      color = "bg-error text-white";
      break;
    case "warning":
      color = "bg-warning-300 text-white";
      break;
    case "info":
    default:
      color = "bg-light-bg text-[#545454] dark:text-[#CBD5E1]";
      break;
  }

  return (
    <div
      className={`rounded-full flex justify-center items-center py-1 px-4 text-[13px] lg:text-[14px] ${color}`}
    >
      <Text text={title} />
    </div>
  );
};

export default Label;
