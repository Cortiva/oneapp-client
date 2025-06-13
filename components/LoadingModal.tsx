import Image from "next/image";

interface LoadingModalProps {
  isOpen: boolean;
}

export default function LoadingModal({ isOpen }: LoadingModalProps) {
  return (
    <>
      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center overflow-x-hidden overflow-y-auto outline-none">
          <div className="fixed inset-0 transition-opacity bg-light-bg/30 dark:bg-dark-bg/30 backdrop-blur-sm"></div>
          <div className="relative z-50 w-[120px] h-[120px] p-3 mx-auto bg-light-bg dark:bg-dark-bg rounded-full shadow-lg backdrop-filter backdrop-blur-lg bg-opacity-10">
            <div className="flex flex-col justify-center items-center text-center">
              <div className="relative flex justify-center items-center">
                <div className="absolute animate-spin rounded-full h-30 w-30 border-t-2 border-b-2 border-primary"></div>
                <Image
                  src={"/icon.png"}
                  alt="O"
                  width={100}
                  height={100}
                  className="object-contain"
                />
              </div>
            </div>
          </div>
        </div>
      )}
    </>
  );
}
