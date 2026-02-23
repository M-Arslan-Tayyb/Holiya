"use client";

import Image from "next/image";
import { useState } from "react";
import { useSession, signOut } from "next-auth/react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Button } from "@/components/ui/button";
import { User, Settings, FileText, LogOut, ChevronDown, ArrowLeft } from "lucide-react";
import { toast } from "sonner";
import { useRouter } from "next/navigation";

export function Header() {
  const { data: session } = useSession();
  const [isOpen, setIsOpen] = useState(false);
  const router = useRouter();

  const handleSignOut = async () => {
    try {
      await signOut({ callbackUrl: `${window.location.origin}/login` });
    } catch (error) {
      toast.error("Failed to sign out");
    }
  };

  const userName = session?.user?.userName || "User";
  const userEmail = session?.user?.email || "";
  const userInitials = userName.slice(0, 2).toUpperCase();

  return (
    <div
      className=" fixed top-0 left-0 right-0 z-50 h-16 md:h-20 
flex items-center justify-between px-4 md:px-8 
 backdrop-blur-md"

    >


      {/* Left Section: Back + Logo */}
      <div className="flex items-center gap-3">
        {/* Back Button */}
        <button
          onClick={() => router.back()}
          className="
    flex items-center justify-center
    p-2
    text-[#545454]
    hover:text-[#CA925F]
    transition-colors duration-200
    relative top-1
    border border-[#755134] rounded-full
    hover:border-[#CA925F]
    hover:bg-[#F7EFE5]/70
  "
        >
          <ArrowLeft className="w-5 h-5" />
        </button>

        {/* Logo */}
        <Image
          src="/holiya-text-logo-with-des.svg"
          alt="Holiya"
          width={140}
          height={36}
          className="h-9 md:h-14 w-auto object-contain cursor-pointer relative top-3"
          onClick={() => router.push("/dashboard")}
        />
      </div>

      {/* User Dropdown */}
      <DropdownMenu open={isOpen} onOpenChange={setIsOpen}>
        <DropdownMenuTrigger asChild>
          <button className="flex items-center gap-2 md:gap-3 outline-none focus:outline-none">
            <Avatar className="h-9 w-9 md:h-10 md:w-10 border-2 border-white/50 shadow-sm">
              <AvatarImage
                src="/holiya-user-image2.jpg"
                alt={userName}
                className="object-cover"
              />
              <AvatarFallback className="bg-primary text-white text-xs font-medium">
                {userInitials}
              </AvatarFallback>
            </Avatar>
            <ChevronDown
              className={`w-4 h-4 text-text-gray/60 transition-transform duration-200 hidden md:block ${isOpen ? "rotate-180" : ""
                }`}
            />
          </button>
        </DropdownMenuTrigger>

        <DropdownMenuContent
          align="end"
          alignOffset={-4}
          sideOffset={8}
          className="
w-72 p-0 
rounded-2xl 
shadow-[0_20px_60px_rgba(117,81,52,0.15)] 
border-0
backdrop-blur-xl 
overflow-hidden
bg-[linear-gradient(150deg,#F6C6A4_0%,#F7EFE5_70%,rgba(255,255,255,0.5)_100%)]
"
        >
          {/* User Info Section */}
          <div className="px-5 py-5 bg-gradient-to-b from-primary/5 to-transparent">
            <div className="flex flex-col items-center">
              <Avatar className="h-16 w-16 border-3 border-white shadow-md mb-3">
                <AvatarImage
                  src="/holiya-user-image2.jpg"
                  alt={userName}
                  className="object-cover"
                />
                <AvatarFallback className="bg-primary text-white text-lg font-medium">
                  {userInitials}
                </AvatarFallback>
              </Avatar>
              <h3 className="font-sans font-semibold text-text-gray text-base">
                {userName}
              </h3>
              <p className="text-xs text-text-gray/60 font-sans mt-0.5">
                {userEmail}
              </p>
            </div>
          </div>

          {/* Menu Items */}
          <div className="p-2">
            <DropdownMenuItem className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer focus:bg-primary/5 focus:text-text-gray transition-colors">
              <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
                <User className="w-4 h-4" />
              </div>
              <span className="text-sm font-sans font-medium text-text-gray">
                Profile
              </span>
            </DropdownMenuItem>

            <DropdownMenuItem className="flex items-center gap-3 px-3 py-2.5 rounded-xl cursor-pointer focus:bg-primary/5 focus:text-text-gray transition-colors">
              <div className="p-1.5 rounded-lg bg-primary/10 text-primary">
                <Settings className="w-4 h-4" />
              </div>
              <span className="text-sm font-sans font-medium text-text-gray">
                Settings
              </span>
            </DropdownMenuItem>
          </div>

          <DropdownMenuSeparator className="bg-text-gray/10 my-1" />

          {/* Sign Out */}
          <div className="p-2">
            <Button
              variant="ghost"
              onClick={handleSignOut}
              className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-red-500 hover:text-red-600 hover:bg-red-50 transition-all justify-start font-sans font-medium"
            >
              <div className="p-1.5 rounded-lg bg-red-100 text-red-500">
                <LogOut className="w-4 h-4" />
              </div>
              <span className="text-sm">Sign out</span>
            </Button>
          </div>
        </DropdownMenuContent>
      </DropdownMenu>
    </div>
  );
}
