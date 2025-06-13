import { ReactNode, useEffect, useState } from "react";
import Footer from "./Footer";
import Sidebar from "./Sidebar";
import Header from "./Header";

export default function MainLayout({ children }: { children: ReactNode }) {
  const [isShrunk, setIsShrunk] = useState(false);
  const [isMobileView, setIsMobileView] = useState(false);

  useEffect(() => {
    const handleResize = () => {
      if (window.innerWidth <= 768) {
        setIsMobileView(true);
      } else {
        setIsMobileView(false);
      }
    };

    handleResize();

    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);

  return (
    <section className="h-screen flex flex-row w-full">
      {!isMobileView && (
        <Sidebar isShrunk={isShrunk} setIsShrunk={setIsShrunk} />
      )}
      <div
        className={`h-screen flex flex-col justify-between ${
          isMobileView ? "w-[100%]" : isShrunk ? "w-[96%]" : "w-[86%]"
        } bg-light-bg dark:bg-dark-bg`}
      >
        <Header />
        <div className="flex-1 overflow-y-auto p-5 lg:p-7 border-b-2 border-light-card dark:border-dark-card">
          {children}
        </div>
        <Footer />
      </div>
    </section>
  );
}
