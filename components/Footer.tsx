import React from "react";

const Footer: React.FC = () => {
  return (
    <div className="h-[5%] flex items-center justify-center px-2 text-[13px] text-[#545454] dark:text-[#CBD5E1]">
      &copy; {new Date().getFullYear()} oneapp by &nbsp;
      <span className="text-primary">Ooodles</span>. All rights reserved.
    </div>
  );
};

export default Footer;
