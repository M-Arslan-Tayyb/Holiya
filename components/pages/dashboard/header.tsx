'use client'

import { Button } from '@/components/ui/button'
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar'
import { Bell, Briefcase, Menu, UserPlus } from 'lucide-react'
import { useState } from 'react'

interface HeaderProps {
    onMenuClick?: () => void
}

export function Header({ onMenuClick }: HeaderProps) {
    const [isOpen, setIsOpen] = useState(false)

    const handleMenuClick = () => {
        setIsOpen(!isOpen)
        onMenuClick?.()
    }

    return (
        <header className="sticky top-0 z-30 px-3 py-4 w-full backdrop-blur-sm">
            <div className="flex items-center justify-between mt-4">
                {/* Left section */}
                <div className="flex items-center gap-6">
                    {/* Hamburger menu for mobile */}
                    <button
                        onClick={handleMenuClick}
                        className="lg:hidden fixed top-4 left-4 z-50 bg-white/60 backdrop-blur-sm p-2 rounded-lg shadow-md border border-gray-200 hover:bg-white/80 transition-all"
                    >
                        <Menu className="w-5 h-5 text-[#545454]" />
                    </button>

                    {/* User section */}
                    <div className="flex items-center gap-4">
                        {/* Avatar */}
                        <Avatar className="hidden sm:flex h-20 w-20">
                            <AvatarImage src="/holiya-user-image2.jpg" alt="Emma" />
                            <AvatarFallback className="bg-[#F7EFE5] text-[#545454] font-semibold text-sm">
                                EM
                            </AvatarFallback>
                        </Avatar>

                        {/* Text */}
                        <div className="hidden sm:flex flex-col justify-center gap-1">
                            <p className="text-2xl font-medium text-text-gray">Emma</p>
                            <p className="text-md text-text-gray">Civil Engineer</p>
                        </div>
                    </div>
                </div>

                {/* Right section */}
                <div className="flex items-center gap-16">
                    {/* Industry Selector - Matching Screenshot */}
                    <div className="flex items-center gap-4 rounded-2xl p-2 pr-4">
                        {/* Icon Box - Peach/Orange Background */}
                        <div className="w-14 h-14 bg-[#F6C6A4] rounded-2xl flex items-center justify-center flex-shrink-0">
                            <Briefcase className="w-5 h-5 text-[#545454]" />
                        </div>

                        {/* Text Content */}
                        <div className="flex flex-col">
                            <span className="text-sm text-gray-400 font-medium">Industry</span>
                            <span className="text-lg font-semibold text-[#545454] leading-tight">Construction</span>
                        </div>
                    </div>

                    {/* Bell Icon - Border Style with Notification Dot */}
                    <button className="w-14 h-14 border mr-2 border-gray-200 rounded-2xl flex items-center justify-center relative hover:border-gray-300 transition-colors flex-shrink-0 hover:bg-white">
                        <Bell className="w-5 h-5 text-[#545454]" />
                        <span className="absolute top-2.5 right-2.5 w-2 h-2 bg-red-500 rounded-full"></span>
                    </button>
                </div>
            </div>
        </header>
    )
}