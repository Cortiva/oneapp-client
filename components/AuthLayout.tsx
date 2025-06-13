import { ReactNode } from "react";
import AnimatedOnView from "./AnimatedOnView";
import Image from "next/image";
import { useTheme } from "next-themes";

export default function AuthLayout({ children }: { children: ReactNode }) {
  const { theme } = useTheme();

  return (
    <section className="h-screen w-full grid grid-cols-2">
      <div
        className="relative col-span-2 md:col-span-1 bg-dark-bg bg-cover bg-center py-24"
        style={{ backgroundImage: `url('/authBanner.png')` }}
      >
        <div className="absolute inset-0 bg-[#00000050] z-10"></div>
        <div className="absolute inset-0 z-20 flex items-center justify-center">
          <div className="flex flex-col justify-between items-center text-white text-center py-16 h-full">
            <div className="flex flex-row justify-between items-center">
              <div className="">
                <AnimatedOnView>
                  <h1 className="text-[13px] md:text-[20px] lg:text-[30px]">
                    Seamless Device
                  </h1>
                  <h2 className="text-[13px] md:text-[20px] lg:text-[30px] font-bold">
                    Management
                  </h2>
                </AnimatedOnView>
              </div>
            </div>
            <div></div>
          </div>
        </div>
      </div>
      <div className="col-span-2 md:col-span-1 flex flex-col justify-center bg-light-bg dark:bg-dark-bg py-[50px] px-[5px] md:px-[20px] lg:px-[40px] xl:px-[60px] 2xl:px-[110px] overflow-y-auto">
        <div className="pt-24">
          <div className="flex flex-col items-center my-5">
            <AnimatedOnView>
              <Image
                src={theme === "dark" ? "/logodark.png" : "/logolight.png"}
                alt="oneapp"
                width={200}
                height={63}
                className="object-contain"
              />
            </AnimatedOnView>
          </div>
          <div className="flex flex-col my-y p-6 rounded-[20px] bg-light-card dark:bg-dark-card border-4 border-light-card dark:border-dark-card">
            {children}
          </div>
        </div>
      </div>
    </section>
  );
}
