"use client";

import { Plane, CircleUserIcon, ChevronDown } from "lucide-react";
import { usePathname, useRouter } from "next/navigation";
import Link from "next/link";
import { useState } from "react";
import { useLogout } from "@/hooks/useLogout";

export default function Layout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const router = useRouter();
  const [isOpenProfile, setIsOpenProfile] = useState(false);

  const navMenu = [
    { label: "Search Flight", href: "/flight" },
    { label: "My Tickets", href: "/ticket" },
    { label: "Search History", href: "/history" },
  ];

  const { mutate, isPending, error } = useLogout();

  function onHandleLogout() {
    mutate(undefined, {
      onSuccess: () => {
        setIsOpenProfile(false);
        router.push("/login");
      },
    });
  }

  return (
    <div className="min-h-screen flex flex-col bg-slate-50">
      <nav className="sticky top-0 z-50 bg-white border-b border-slate-200 shadow-sm">
        <div className="px-6 h-20 flex items-center justify-between">
          <div className="flex items-center gap-2 text-blue-700">
            <Plane size={28} />
            <span className="text-2xl font-bold tracking-tight">Flybook</span>
          </div>

          <div className="hidden md:flex gap-10 text-slate-500">
            {navMenu.map((item) => {
              const isActive = pathname === item.href;

              return (
                <Link
                  key={item.href}
                  href={item.href}
                  className={`text-base transition-colors duration-200 pb-1 ${
                    isActive
                      ? "text-blue-700 font-bold border-b-2 border-blue-700"
                      : "hover:text-blue-700"
                  }`}
                >
                  {item.label}
                </Link>
              );
            })}
          </div>

          <div className="relative">
            <button
              onClick={() => setIsOpenProfile(!isOpenProfile)}
              className="flex gap-2 text-slate-500 items-center cursor-pointer hover:text-blue-700 transition-colors duration-200 focus:outline-none"
            >
              <CircleUserIcon size={26} />
              <span className="hidden sm:inline text-base font-medium">
                Flybook
              </span>
              <ChevronDown
                size={16}
                className={`transition-transform duration-200 ${isOpenProfile ? "rotate-180" : ""}`}
              />
            </button>
            {isOpenProfile && (
              <div className="absolute right-0 mt-2 w-40 bg-white border border-slate-200 rounded-lg shadow-lg py-2 z-10">
                <a
                  href="/profile"
                  className="block px-4 py-2 text-slate-700 hover:bg-slate-100 text-sm transition-colors"
                >
                  Profile Saya
                </a>
                <button
                  onClick={onHandleLogout}
                  disabled={isPending}
                  className="w-full text-left px-4 py-2 text-red-600 hover:bg-slate-100 text-sm transition-colors disabled:opacity-60 disabled:cursor-not-allowed"
                >
                  {isPending ? "Logging out..." : "Logout"}
                </button>
                {error && (
                  <p className="px-4 pt-1 text-xs text-red-600">
                    {error.message}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </nav>

      <main className="flex-1">{children}</main>
    </div>
  );
}
