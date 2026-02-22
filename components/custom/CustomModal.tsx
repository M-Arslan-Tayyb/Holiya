'use client'

import * as React from "react"
import { X } from "lucide-react"
import {
    Dialog,
    DialogContent,
    DialogOverlay,
} from "@/components/ui/dialog"

interface CustomModalProps {
    open: boolean
    onOpenChange: (open: boolean) => void
    title: string
    children: React.ReactNode
}

export function CustomModal({
    open,
    onOpenChange,
    title,
    children,
}: CustomModalProps) {
    return (
        <Dialog open={open} onOpenChange={onOpenChange}>
            {/* Overlay */}
            <DialogOverlay className="fixed inset-0 z-[999] bg-black/40 backdrop-blur-sm" />

            <DialogContent
                className="
          z-[1000]
          sm:max-w-lg
          p-0
          rounded-2xl
          bg-white
          border border-neutral-200
          shadow-[0_20px_60px_rgba(0,0,0,0.15)]
        "
            >
                {/* Header */}
                <div className="flex items-center justify-between px-6 py-4 border-b border-neutral-200">
                    <h2 className="text-lg font-semibold text-[#545454]">
                        {title}
                    </h2>

                    <button
                        onClick={() => onOpenChange(false)}
                        className="
              rounded-md
              p-1
              hover:bg-neutral-100
              transition
            "
                    >
                        <X className="w-5 h-5 text-neutral-500" />
                    </button>
                </div>

                {/* Body */}
                <div className="px-6 py-5 text-sm text-[#545454] leading-relaxed max-h-[60vh] overflow-y-auto">
                    {children}
                </div>
            </DialogContent>
        </Dialog>
    )
}