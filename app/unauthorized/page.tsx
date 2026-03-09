'use client'

import Link from 'next/link'
import { ShieldAlert } from 'lucide-react'
import { COLORS, FONTS } from '@/lib/theme'

export default function UnauthorizedPage() {
    return (
        <div 
            className="min-h-screen flex items-center justify-center px-4"
            style={{ 
                background: `linear-gradient(135deg, var(--color-gradient-1), var(--color-gradient-2), var(--color-gradient-3))`,
                fontFamily: FONTS.SANS 
            }}
        >
            <div className="max-w-md w-full bg-white/80 backdrop-blur-lg p-8 rounded-3xl shadow-2xl text-center border border-white/20">
                <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-red-100 mb-6">
                    <ShieldAlert className="w-10 h-10 text-red-500" />
                </div>
                
                <h1 className="text-3xl font-bold mb-4" style={{ color: COLORS.SECONDARY }}>
                    Access Denied
                </h1>
                
                <div 
                    className="w-16 h-1 mx-auto mb-6 rounded-full"
                    style={{ backgroundColor: COLORS.PRIMARY }}
                />
                
                <p className="text-lg mb-8" style={{ color: COLORS.TEXT_GRAY }}>
                    Oops! It looks like you don't have permission to access this area.
                    This section is reserved for administrators only.
                </p>
                
                <Link href="/dashboard">
                    <button
                        className="w-full py-4 px-6 rounded-2xl font-bold text-white transition-all duration-300 transform hover:scale-[1.02] active:scale-[0.98] shadow-lg shadow-[#CA925F]/20"
                        style={{ 
                            backgroundColor: COLORS.PRIMARY,
                        }}
                    >
                        Back to Safety
                    </button>
                </Link>
                
                <p className="mt-6 text-sm opacity-60" style={{ color: COLORS.TEXT_GRAY }}>
                    If you believe this is an error, please contact support.
                </p>
            </div>
        </div>
    )
}
