"use client";

import { usePathname } from "next/navigation";
import Image from "next/image";
import Tooltip from "./Tooltip";
import Text from "./Text";
import {
  ArrowLeft,
  ArrowRight,
  Laptop2,
  LayoutDashboard,
  LogOut,
  Users,
  Users2,
} from "lucide-react";
import { useTheme } from "next-themes";
import Modal from "./Modal";
import { toast } from "react-toastify";
import Cookies from "js-cookie";
import authService from "@/services/authService";
import { useEffect, useState } from "react";
import { useRouter } from "next/router";

type SidebarProps = {
  isShrunk: boolean;
  setIsShrunk: (val: boolean) => void;
};

const Sidebar = ({ isShrunk, setIsShrunk }: SidebarProps) => {
  const pathname = usePathname();
  const router = useRouter();
  const { theme } = useTheme();
  const [initiateLogout, setInitiateLogout] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  const to = (page: string) => {
    router.push(page);
  };

  const adminMenu = [
    { title: "Dashboard", url: "/", icon: <LayoutDashboard size={18} /> },
    { title: "Employees", url: "/employees", icon: <Users2 size={18} /> },
    { title: "Devices", url: "/devices", icon: <Laptop2 size={18} /> },
    // { title: "IT Managers", url: "/promos", icon: <Users size={18} /> },
  ];

  const handleLogout = async () => {
    localStorage.removeItem("oau");
    Cookies.remove("token");
    toast.success("You have successfully signed out");
    router.replace("/login");

    setIsProcessing(true);

    try {
      const response = await authService.signOut();
      console.log(response);
      if (response.status === 201) {
        localStorage.removeItem("oau");
        Cookies.remove("token");
        toast.success("You have successfully signed out");
        router.replace("/login");
      } else {
        // toast.error(response.message);
      }
    } catch (error: any) {
      console.log("error :::: ", error);
      toast.error(error.message || "Failed to check email");
    } finally {
      setIsProcessing(false);
    }
  };

  if (!mounted) {
    return (
      <div className="w-[150px] h-[46px] bg-gray-200 dark:bg-gray-700 animate-pulse" />
    );
  }

  return (
    <div
      className={`h-screen ${
        isShrunk ? "w-[4%]" : "w-[14%]"
      } bg-light-card dark:bg-dark-card flex flex-col shadow-[4px_0_6px_-1px_rgba(0,0,0,0.1)]`}
    >
      <div className="h-[8%] flex items-center px-5">
        {isShrunk ? (
          <Image
            src={"/icon.png"}
            alt="O"
            width={75}
            height={75}
            className="object-contain"
          />
        ) : (
          <div className="flex flex-row items-center text-[37px] text-white font-semibold ">
            <Image
              src={theme === "dark" ? "/logodark.png" : "/logolight.png"}
              alt="oneapp"
              width={150}
              height={46}
              className="object-contain"
            />
          </div>
        )}
      </div>

      <div className="flex-1 overflow-y-auto py-3 px-3">
        {adminMenu.map((menu, index) => (
          <div
            key={index}
            className={`flex flex-row items-center space-x-3 px-6 py-4 mt-2 text-[13px] xl:text-[14px] 2xl:text-[15px] cursor-pointer rounded-[10px] transition-all duration-200 ${
              pathname === menu.url
                ? "bg-slate-900 text-white dark:bg-dark-bg"
                : "bg-transparent text-[#545454] dark:text-[#CBD5E1] hover:bg-slate-900 hover:text-white"
            }`}
            onClick={() => to(menu.url)}
          >
            <span>{menu.icon}</span>
            {!isShrunk && <span>{menu.title}</span>}
          </div>
        ))}
      </div>

      <div className="h-[5%] flex flex-row justify-between items-center w-full px-2 shadow-md">
        <div
          className="flex flex-row items-center space-x-2 cursor-pointer text-secondary"
          onClick={() => setInitiateLogout(true)}
        >
          <LogOut />
          Sign Out
        </div>
        <div
          onClick={() => setIsShrunk(!isShrunk)}
          className="flex justify-center items-center cursor-pointer"
        >
          <Tooltip
            title={
              !isShrunk ? <ArrowLeft size={20} /> : <ArrowRight size={20} />
            }
            content={!isShrunk ? "Shrink" : "Expand"}
          />
        </div>
      </div>

      <Modal
        title="Sign Out"
        isOpen={initiateLogout}
        onClose={() => setInitiateLogout(false)}
        onClick={handleLogout}
        buttonText="Yes, Sign Out"
        size="small"
        isSingleButton={false}
        isProcessing={isProcessing}
        isBottomModal={false}
        hasButton={true}
      >
        <Text text="Are you sure you want to sign out?" />
      </Modal>
    </div>
  );
};

export default Sidebar;
