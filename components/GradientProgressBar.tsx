import React from "react";

interface GradientProgressBarProps {
  progress: number; // 0 to 100
}

const GradientProgressBar: React.FC<GradientProgressBarProps> = ({
  progress,
}) => {
  return (
    <div className="w-full h-[10px] bg-gray-200 rounded-full overflow-hidden">
      <div
        className="h-full rounded-full transition-all duration-500"
        style={{
          width: `${progress}%`,
          backgroundImage:
            "linear-gradient(to right, #ff6b6b, #f7b733, #45d0ec, #9b59b6, #2ecc71)",
        }}
      />
    </div>
  );
};

export default GradientProgressBar;
