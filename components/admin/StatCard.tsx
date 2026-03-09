'use client'

import { Card } from "@/components/ui/card"
import { LucideIcon } from "lucide-react"
import { COLORS } from "@/lib/theme"

interface StatCardProps {
    label: string
    value: string | number
    icon: LucideIcon
    iconClassName?: string
}

export function StatCard({ label, value, icon: Icon, iconClassName }: StatCardProps) {
    return (
        <Card className="flex flex-row justify-between p-8 bg-white/60 backdrop-blur-md border border-white/20 shadow-lg rounded-2xl gap-4 transition-all hover:shadow-xl hover:translate-y-[-2px]">

            <div>
                <p className="text-sm font-medium text-[#545454] opacity-80">{label}</p>
                <h3 className="text-2xl font-bold mt-1" style={{ color: COLORS.SECONDARY }}>{value}</h3>
            </div>
            <div className="flex items-center justify-between">
                <div className="flex items-center justify-center w-12 h-12 rounded-xl bg-[#FAE5D6] text-[#CA925F]">
                    <Icon className={`w-6 h-6 ${iconClassName}`} />
                </div>
            </div>
        </Card>
    )
}
