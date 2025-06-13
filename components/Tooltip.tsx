"use client";

import { ReactNode } from "react";

interface TooltipProps {
  title: ReactNode;
  content: ReactNode;
}

const Tooltip = ({ title, content }: TooltipProps) => {
  return (
    <div className="relative group inline-block">
      {title}

      <div className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 bg-slate-900 dark:bg-gray-50 text-white dark:text-slate-800 text-[12px] px-3 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-300 whitespace-nowrap z-10">
        {content}
        <div className="absolute -bottom-1 left-1/2 -translate-x-1/2 w-2 h-2 bg-slate-900 dark:bg-gray-50 rotate-45" />
      </div>
    </div>
  );
};

export default Tooltip;
