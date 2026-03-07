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
    const tasks = useMemo(() =>
        items.map(item => {
            let subtitleText = item.subtitle
            let progressLabel = ''

            if (item.category === 'cam_therapy') {
                progressLabel = `${item.completed_sessions ?? 'null'}/${item.total_sessions ?? 'null'} sessions`
            } else if (item.category === 'supplement') {
                progressLabel = `Week ${item.week_start ?? 'null'}/${item.duration_weeks ?? 'null'}`
            } else if (item.duration_weeks) {
                progressLabel = `Week ${item.week_start ?? 'null'}`
            }

            const progressPercentage = item.total_sessions
                ? Math.round((item.completed_sessions / item.total_sessions) * 100)
                : item.duration_weeks && item.week_start ? Math.round((item.week_start / item.duration_weeks) * 100) : 0

            return {
                id: item.item_id,
                title: item.name,
                subtitle: subtitleText,
                progressLabel,
                status: (item.status === 'completed' || (item.total_sessions && item.completed_sessions === item.total_sessions)) ? 'Completed' :
                    (item.completed_sessions > 0 || (item.duration_weeks && item.status !== 'upcoming')) ? 'In Progress' : 'Upcoming',
                progressPercentage,
                category: item.category,
            }
        }), [items]
    )

    if (isLoading) {
        return (
            <Card className="border-none p-4 rounded-3xl w-full bg-[linear-gradient(to_bottom,rgba(255,255,255,0.45)_0%,#F7EFE5_70%,#FBE4D6_100%)]">
                <div className="flex items-center justify-center h-64">
                    <Loader2 className="w-6 h-6 text-[#CA925F] animate-spin" />

                </div>
            </Card>
        )
    }

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
        <Card className="border-none p-5 rounded-3xl w-full lg:w-[105%] mb-2
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

            {/* Timeline steps
            {timelineSteps.length > 0 && (
                <div className="mb-6 flex gap-3 overflow-x-auto pb-2 -mx-2 px-2">
                    {timelineSteps.map((step, index) => (
                        <div key={index} className="flex-shrink-0 flex flex-col items-center gap-2 min-w-[80px]">
                            <div className={`px-3 py-1 text-xs font-medium rounded-full whitespace-nowrap ${
                                step.status === 'Completed' 
                                    ? 'bg-[#DBEAFE] text-[#1E40AF]'
                                    : 'bg-[#FEF3C7] text-[#B45309]'
                            }`}>
                                {step.week}
                            </div>
                            <p className="text-xs text-[#545454] text-center">{step.title}</p>
                        </div>
                    ))}
                </div>
            )} */}

            <div className="space-y-4 bg-white/50 p-4 rounded-2xl">

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
