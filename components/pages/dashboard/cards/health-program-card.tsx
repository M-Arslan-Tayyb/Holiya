'use client'

import { Card } from '@/components/ui/card'
import { BadgeCheck, Apple, Salad, ChevronRight, Loader2 } from 'lucide-react'
import { useState, useMemo } from 'react'
import { useGetHealthPlanQuery } from '@/services/features/dashboard/api'

interface HealthProgramCardProps {
    userId: number
}

interface HealthPlanItem {
    item_id: number
    category: string
    name: string
    subtitle?: string | null
    total_sessions?: number | null
    completed_sessions: number
    duration_weeks?: number | null
    week_start?: number | null
    status: string
}

interface HealthPlanData {
    plan_id: number
    user_id: number
    duration_months: number
    status: string
    items: HealthPlanItem[]
}

export function HealthProgramCard({ userId }: HealthProgramCardProps) {
    const [expandedTaskId, setExpandedTaskId] = useState<number | null>(null)
    const { data, isLoading, error } = useGetHealthPlanQuery({ user_id: userId })

    const healthPlanData = data?.data as HealthPlanData | undefined
    const items = healthPlanData?.items || []


    // All hooks must be called before any conditional returns



    if (error || !healthPlanData || data == null) {
        return (
            <Card className="border-none p-4 rounded-3xl w-full bg-[linear-gradient(to_bottom,rgba(255,255,255,0.45)_0%,#F7EFE5_70%,#FBE4D6_100%)] w-full lg:w-[105%]">
                <div className="flex items-center justify-center h-64">
                    <p className="text-[#545454]">{data?.message || 'No health plan found'}</p>
                </div>
            </Card>
        )
    }

    const planName = 'Health program'
    const duration = `${healthPlanData.duration_months} month plan`

    // Timeline steps - hardcoded to match screenshot (Week 1-12, Initial Assessment completed, Week 6 check-up completed, Week 10 orthopaedist upcoming)

    return (
        <Card className="border-none p-5 rounded-3xl w-full mb-2
                bg-[linear-gradient(to_bottom,rgba(255,255,255,0.45)_0%,#F7EFE5_50%,#FBE4D6_100%)]">

            {/* Header */}
            <div className=" flex items-center justify-between">
                <h3 className="text-lg font-semibold text-[#545454] mb-1">
                    {planName}
                </h3>

                <p className="text-base font-semibold text-[#545454] bg-white/70 px-3 py-1 rounded-full">
                    {duration}
                </p>
            </div>

            {/* Timeline steps */}
            <div className="">
                <div className="flex gap-4 pb-4 justify-center">
                    {[
                        { title: 'Initial Assessment', status: 'Completed', week: 'Week 6', color: 'bg-[#BEE3F8]', textColor: 'text-[#2B6CB0]' },
                        { title: 'Check-up', status: 'Completed', week: 'Week 1', color: 'bg-[#BEE3F8]', textColor: 'text-[#2B6CB0]' },
                        { title: 'Orthopaedist appt', status: 'Upcoming', week: 'Week 12', color: 'bg-[#FEEBC8]', textColor: 'text-[#C05621]' },
                    ].map((step, idx) => (
                        <div key={idx} className="flex-shrink-0 w-64 bg-white/70 backdrop-blur-sm p-2 rounded-2xl shadow-sm border border-white/40">
                            <div className="flex justify-between items-start mb-3">
                                <span className={`px-3 py-1 rounded-full text-[11px] font-bold tracking-tight ${step.color} ${step.textColor}`}>
                                    {step.status}
                                </span>
                                <span className="text-[11px] font-semibold text-[#545454]/60">{step.week}</span>
                            </div>
                            <h4 className="text-[15px] font-bold text-[#4A4A4A]">{step.title}</h4>
                        </div>
                    ))}
                </div>

                {/* Timeline Progress Bar */}
                <div className="relative mt-2 px-10">
                    <div className="absolute top-1/2 left-0 w-full h-[1px] bg-white/90 -translate-y-1/2 rounded-full" />
                    <div className="flex justify-between relative">
                        <div className="w-3 h-3 rounded-full bg-white shadow-sm border border-white/20" />
                        <div className="w-3 h-3 rounded-full bg-white shadow-sm border border-white/20" />
                        <div className="w-3 h-3 rounded-full bg-[#1A1A1A] border-2 border-white/80 shadow-md z-10" />
                    </div>
                </div>
            </div>

            <div className="space-y-4 bg-white/50 p-4 rounded-2xl mb-8">

                {/* Scroll container */}
                <div className="max-h-[210px] overflow-y-auto space-y-3">

                    {items.map((task) => {
                        const total = task.total_sessions || 0;
                        const completed = task.completed_sessions || 0;

                        const progressPercentage =
                            total > 0 ? Math.min((completed / total) * 100, 100) : 0;

                        const isCompleted = total > 0 && completed === total;

                        return (
                            <div
                                key={task.item_id}
                                className="flex items-center justify-between py-1 px-3 rounded-lg hover:bg-gray-200/25 transition-colors duration-200 cursor-pointer"
                            >

                                {/* LEFT */}
                                <div className="flex flex-col">
                                    <p className="text-[15px] font-medium text-[#4A4A4A]">
                                        {task.name}
                                    </p>

                                    {task.category && (
                                        <p className="text-xs text-[#8E8E8E]">
                                            {task.category}
                                        </p>
                                    )}
                                </div>

                                {/* RIGHT */}
                                <div className="flex flex-col items-end gap-1 w-40">
                                    {isCompleted ? (
                                        <span className="px-3 py-[3px] bg-[#BEE3F8] text-[#3182CE] text-xs font-medium rounded-full">
                                            Completed
                                        </span>
                                    ) : (
                                        <div className="flex gap-2 items-center group">

                                            <div className="flex flex-col gap-1 w-40">
                                                <span className="text-sm text-text-gray font-medium">
                                                    {completed}/{total} sessions
                                                </span>

                                                <div className="w-full h-[7px] bg-[#E4E4E4] rounded-full overflow-hidden">
                                                    <div
                                                        className="h-full bg-[#FBD38D] rounded-full"
                                                        style={{ width: `${progressPercentage}%` }}
                                                    />
                                                </div>
                                            </div>

                                            <ChevronRight className="relative top-1 w-7 h-7 text-black/40 group-hover:text-black/60 transition-colors" />

                                        </div>
                                    )}
                                </div>

                            </div>
                        );
                    })}

                </div>
            </div>
        </Card>
    )
}
