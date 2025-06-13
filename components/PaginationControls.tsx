"use client";

import { ChevronLeft, ChevronRight } from "lucide-react";
import Text from "./Text";

type Props = {
  type: any;
  currentPage: number;
  totalPages: number;
  handlePreviousClick: (type: any) => void;
  handleNextClick: (type: any) => void;
  renderPages: (
    type: any,
    currentPage: number,
    totalPages: number
  ) => React.ReactNode;
};

const PaginationControls = ({
  type,
  currentPage,
  totalPages,
  handlePreviousClick,
  handleNextClick,
  renderPages,
}: Props) => {
  const isPrevDisabled = currentPage === 1 || totalPages < 2;
  const isNextDisabled = currentPage === totalPages || totalPages <= 1;

  return (
    <div className="my-5 flex flex-row items-center justify-center space-x-6 text-[17px]">
      <div
        onClick={() => !isPrevDisabled && handlePreviousClick(type)}
        className={`flex flex-row items-center mx-2 ${
          isPrevDisabled ? "" : "text-primary cursor-pointer"
        }`}
      >
        <ChevronLeft />
        <Text text="Previous" color={isPrevDisabled ? "" : "text-primary"} />
      </div>

      {renderPages(type, currentPage, totalPages)}

      <div
        onClick={() => !isNextDisabled && handleNextClick(type)}
        className={`flex flex-row items-center mx-2 ${
          isNextDisabled ? "" : "text-primary cursor-pointer"
        }`}
      >
        <Text text="Next" color={isNextDisabled ? "" : "text-primary"} />
        <ChevronRight />
      </div>
    </div>
  );
};

export default PaginationControls;
