'use client'

import Image from 'next/image'
import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { SIDEBAR_MENU } from '@/data/sidebar-menu'
import { HoliyaLogo } from '@/components/custom/HoliyaLogo'
import { Button } from '@/components/ui/button'
import { LogOut, X } from 'lucide-react'
import { signOut } from 'next-auth/react'
import { toast } from 'sonner'

interface SidebarProps {
    isOpen?: boolean
    onClose?: () => void
}

export function Sidebar({ isOpen = true, onClose }: SidebarProps) {
    const pathname = usePathname()

    const handleLogout = async () => {
        try {
            await signOut({ callbackUrl: `${window.location.origin}/login` });
        } catch (error) {
            toast.error("Failed to sign out");
        }
    };

    return (
        <>
            <aside
                className={`fixed inset-y-0 left-0 z-40  w-64 lg:w-62 h-screen 
  bg-gradient-to-b from-[#F6C6A4] to-[#F7EFE5]
  lg:bg-none lg:bg-transparent
  flex flex-col transition-transform duration-300 ease-in-out
  ${isOpen ? "translate-x-0" : "-translate-x-full"} 
  lg:translate-x-0`}
            >
                {/* Close button for mobile */}
                {/* <button
                    onClick={onClose}
                    className="lg:hidden absolute top-4 right-4 p-1 hover:bg-white/30 rounded-lg transition-colors"
                >
                    <X className="w-6 h-6 text-[#545454]" />
                </button> */}

                {/* Top section - Logo and Menu */}
                <div className="flex-none pt-8 px-6 lg:pt-6 lg:px-6">
                    {/* Logo */}
                    <div className="mb-8 flex justify-start lg:mb-4">
                        <Image
                            src="/holiya-text-logo.svg"
                            alt="Holiya"
                            width={160}
                            height={80}
                            className="w-auto h-14 lg:h-16"
                        />
                    </div>

                    {/* Menu Items */}
                    <nav className="flex flex-col gap-2 lg:gap-1">
                        {SIDEBAR_MENU.map((item) => {
                            const isActive =
                                pathname === item.href || pathname.startsWith(item.href + "/");
                            const Icon = item.icon;

                            return (
                                <Link key={item.id} href={item.href}>
                                    <button
                                        className={`relative w-full flex items-center gap-3 px-4 py-2 rounded-full text-base font-medium transition-colors
                ${isActive
                                                ? "bg-white/70 text-[#CA925F] z-10"
                                                : "text-[#545454] hover:bg-white/50"}
                lg:px-2 lg:py-2.5 lg:text-sm`}
                                    >
                                        <Icon className="w-5 h-5 flex-shrink-0" />
                                        <span className="truncate">{item.label}</span>
                                    </button>
                                </Link>
                            );
                        })}
                    </nav>
                </div>

                {/* Bottom section - User profile and Logo */}
                <div className="mt-auto p-6 lg:p-2 space-y-4 lg:space-y-4 mt-4">
                    {/* User Profile */}
                    <Link href="/dashboard">
                        <button className="w-full flex items-center gap-3 p-3 rounded-lg hover:bg-white/30 transition-colors">
                            <div className="w-6 h-6 rounded-full bg-white flex-shrink-0 overflow-hidden">
                                <Image
                                    src="/holiya-user-image2.jpg"
                                    alt="Emma Smith"
                                    width={20}
                                    height={20}
                                    className="w-6 h-6 object-cover"
                                    unoptimized
                                />
                            </div>
                            <div className="text-left">
                                <p className="text-sm font-bold text-[#545454]">Emma Smith</p>
                            </div>
                        </button>
                    </Link>

                    {/* Log Out Button */}
                    <Button
                        variant="ghost"
                        onClick={handleLogout}
                        className="w-full justify-start gap-2 text-[#545454] hover:bg-white/30 lg:border-t lg:border-gray-300 lg:mt-1"
                    >
                        <LogOut className="w-4 h-4" />
                        <span>Log out</span>
                    </Button>

                    {/* Holiya Logo */}
                    <div className="flex justify-center pt-2 lg:mt-24 lg:mb-4">
                        <HoliyaLogo size="xs2" isSimple={true} />
                    </div>
                </div>
            </aside>
        </>
    )
}