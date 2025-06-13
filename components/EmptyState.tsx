import React from "react";
import Text from "./Text";
import { FileSearch } from "lucide-react";

type AppEmptyStateProps = {
  text: string;
  page: string;
  buttonText: string;
  onClick?: () => void;
};

const AppEmptyState: React.FC<AppEmptyStateProps> = ({
  text,
  page,
  buttonText,
  onClick,
}) => {
  return (
    <div className="h-[80%] mt-10 flex flex-col justify-center items-center p-10 bg-light-card dark:bg-dark-card rounded-[14px]">
      <FileSearch
        size={150}
        className="mb-10 text-slate-400 dark:text-dark-bg"
      />

      <Text text={text} weight="font-semibold" mb="mb-2" isTitleText={true} />
      <Text
        text={`Use the Add ${page} button above to create a new record or `}
      />

      <div className="mt-4 cursor-pointer">
        <Text
          text={buttonText}
          hasHover={true}
          weight="font-semibold"
          size="big"
          color="text-primary dark:text-primary-300"
          onClick={onClick}
        />
      </div>
    </div>
  );
};

export default AppEmptyState;
