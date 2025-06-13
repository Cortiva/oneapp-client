"use client";

import { useEffect, useState } from "react";
import {
  LayoutDashboard,
  Users2,
  Laptop2,
  Users,
  Menu,
  X,
  Expand,
  Minimize,
} from "lucide-react";
import { useRouter, usePathname } from "next/navigation";
import Text from "./Text";
import { decryptData, formatRole } from "@/utils/functions";
import { User } from "@/services/authService";
import ThemeToggle from "./ThemeToggle";
import Avatar from "./Avatar";
import { useTheme } from "next-themes";
import Image from "next/image";

const Header = () => {
  const [isFullScreen, setIsFullScreen] = useState(false);
  const [showMenu, setShowMenu] = useState(false);
  const [user, setUser] = useState<User | null>(null);
  const router = useRouter();
  const pathname = usePathname();
  const { theme } = useTheme();

  useEffect(() => {
    const storedUser = localStorage.getItem("oau");
    if (!storedUser) {
      console.log("No User found");
    } else {
      // Decrypt stored user
      const decryptedUser = decryptData(storedUser);
      console.log("dec user :::::: ", decryptedUser);
      setUser(decryptedUser);
    }
  }, [setUser]);

  const handleFullScreenClicked = () => {
    if (!isFullScreen && typeof document !== "undefined") {
      document.body.requestFullscreen();
    }
  };

  const handleExitFullScreenClicked = () => {
    if (isFullScreen && typeof document !== "undefined") {
      document.exitFullscreen();
    }
  };

  const to = (page: string) => {
    setShowMenu(false);
    router.push(page);
  };

  useEffect(() => {
    const handleFullScreenChange = () => {
      setIsFullScreen(document.fullscreenElement !== null);
    };

    if (typeof document !== "undefined") {
      document.addEventListener("fullscreenchange", handleFullScreenChange);
      return () => {
        document.removeEventListener(
          "fullscreenchange",
          handleFullScreenChange
        );
      };
    }
  }, []);

  const adminMenu = [
    { title: "Dashboard", url: "/", icon: <LayoutDashboard size={18} /> },
    { title: "Employees", url: "/employees", icon: <Users2 size={18} /> },
    { title: "Devices", url: "/devices", icon: <Laptop2 size={18} /> },
    { title: "IT Managers", url: "/promos", icon: <Users size={18} /> },
  ];

  const toggleShowMenu = () => {
    setShowMenu(!showMenu);
  };

  return (
    <>
      {!showMenu && (
        <div className="h-[8%] flex justify-between items-center bg-light-card dark:bg-dark-card pl-5 lg:pl-10 shadow-[0_4px_2px_-2px_rgba(0,0,0,0.1)]">
          <div className="md:hidden cursor-pointer" onClick={toggleShowMenu}>
            <Menu size={20} />
          </div>
          <div></div>

          <div className="h-full flex items-center">
            <div className="flex items-center px-1 cursor-pointer text-[#545454] dark:text-white">
              {!isFullScreen ? (
                <Expand size={20} onClick={handleFullScreenClicked} />
              ) : (
                <Minimize size={20} onClick={handleExitFullScreenClicked} />
              )}
            </div>

            <div className="flex items-center px-1 cursor-pointer text-[#545454] dark:text-white">
              <ThemeToggle />
            </div>

            <div className="relative px-5">
              <div className="cursor-pointer">
                {user && (
                  <div
                    className="flex items-center pr-2"
                    onClick={() => to("/profile")}
                  >
                    <Avatar
                      imageUrl={user.avatar}
                      username={`${user.firstName} ${user.lastName}`}
                    />
                    <div className="flex-col pl-3">
                      <Text
                        text={`${user.firstName} ${user.lastName}`}
                        weight="font-semibold"
                      />
                      <Text text={formatRole(user.role)} size="small" />
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

      {showMenu && (
        <div className="h-screen w-full bg-slate-900 dark:bg-slate-800 flex flex-col shadow-[4px_0_6px_-1px_rgba(0,0,0,0.1)]">
          <div className="h-[8%] flex justify-between items-center px-5">
            <div className="flex items-center text-[37px] text-white font-semibold">
              <Image
                src={theme === "dark" ? "/logodark.png" : "/logolight.png"}
                alt="oneapp"
                width={200}
                height={63}
                className="object-contain"
              />
              <span className="ml-2">staze</span>
            </div>
            <div className="cursor-pointer" onClick={() => setShowMenu(false)}>
              <X color="#FFFFFF" size={33} />
            </div>
          </div>

          <div className="flex-1 overflow-y-auto py-3 border-y border-slate-800">
            {adminMenu.map((menu, i) => (
              <div
                key={i}
                className={`flex items-center space-x-3 px-6 py-4 text-sm text-white cursor-pointer hover:bg-slate-700 hover:border-r-2 hover:border-primary ${
                  pathname === menu.url
                    ? "bg-slate-700 border-r-2 border-primary"
                    : ""
                }`}
                onClick={() => to(menu.url)}
              >
                <span>{menu.icon}</span>
                <span>{menu.title}</span>
              </div>
            ))}
          </div>

          <div className="h-[5%] flex justify-between items-center w-full px-2 shadow-md">
            <Text text={`Version 1.0.1`} size="small" color="text-white" />
          </div>
        </div>
      )}
    </>
  );
};

export default Header;
