'use client'

import { Card } from '@/components/ui/card'
import { BadgeCheck, Apple, Salad, ChevronRight, Loader2, Stethoscope, Pill, Activity, HeartPulse, Thermometer } from 'lucide-react'
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
            <Card className="border-none p-4 rounded-3xl w-full bg-[linear-gradient(to_bottom,rgba(255,255,255,0.45)_0%,#F7EFE5_70%,#FBE4D6_100%)] w-full">
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
                <h3 className="text-lg font-semibold text-text-gray font-sans">
                    {planName}
                </h3>

                <p className="text-base font-semibold text-[#545454] bg-white/70 px-3 py-1 rounded-full">
                    {duration}
                </p>
            </div>

            {/* Timeline steps */}
            <div className="mt-4">
                {/* Desktop/Tablet Horizontal Layout */}
                <div className="hidden md:block">
                    <div className="flex gap-4 pb-4 justify-center">
                        {[
                            { title: 'Initial Assessment', status: 'Not Started', week: 'Week 1', color: 'bg-[#FEEBC8]', textColor: 'text-[#C05621]' },
                            { title: 'Check-up', status: 'Not Started', week: 'Week 6', color: 'bg-[#FEEBC8]', textColor: 'text-[#C05621]' },
                            { title: 'Gynaecologist appt', status: 'Not Started', week: 'Week 12', color: 'bg-[#FEEBC8]', textColor: 'text-[#C05621]' },
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
                            <div className="w-3 h-3 rounded-full bg-[#1A1A1A] border-2 border-white/80 shadow-md z-10" />
                            <div className="w-3 h-3 rounded-full bg-white shadow-sm border border-white/20" />
                            <div className="w-3 h-3 rounded-full bg-white shadow-sm border border-white/20" />
                        </div>
                    </div>
                </div>

                {/* Mobile Vertical Layout (Vertical Scroll) */}
                <div className="md:hidden mb-4">
                    <div className="flex flex-col gap-3 max-h-[250px] overflow-y-auto pr-2 relative filter drop-shadow-sm scrollbar-hide">
                        {/* Vertical timeline line */}
                        <div className="absolute left-[14px] top-6 bottom-4 w-[2px] bg-white/90 rounded-full z-0 -translate-x-1/2" />

                        {[
                            { title: 'Initial Assessment', status: 'Not Started', week: 'Week 1', color: 'bg-[#FEEBC8]', textColor: 'text-[#C05621]' },
                            { title: 'Check-up', status: 'Not Started', week: 'Week 6', color: 'bg-[#FEEBC8]', textColor: 'text-[#C05621]' },
                            { title: 'Gynaecologist appt', status: 'Not Started', week: 'Week 12', color: 'bg-[#FEEBC8]', textColor: 'text-[#C05621]' },
                        ].map((step, idx) => (
                            <div key={idx} className="relative pl-10 pt-1">
                                {/* Timeline Dot */}
                                <div className={`absolute left-[14px] top-[24px] w-3 h-3 rounded-full ${idx === 0 ? 'bg-[#1A1A1A] border-2 border-white/80 shadow-md z-10' : 'bg-white shadow-sm border border-white/50 z-10'} -translate-x-1/2 -translate-y-1/2`} />

                                <div className="w-full bg-white/70 backdrop-blur-sm p-3 rounded-2xl shadow-sm border border-white/60">
                                    <div className="flex justify-between items-start mb-2">
                                        <span className={`px-2 py-0.5 rounded-full text-[10px] font-bold tracking-tight ${step.color} ${step.textColor}`}>
                                            {step.status}
                                        </span>
                                        <span className="text-[11px] font-semibold text-[#545454]/60">{step.week}</span>
                                    </div>
                                    <h4 className="text-[14px] font-bold text-[#4A4A4A]">{step.title}</h4>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </div>

            <div className="space-y-4 bg-white/50 p-4 rounded-2xl mb-8">

                {/* Scroll container */}
                <div className="max-h-[210px] overflow-y-auto space-y-3">

                    {items.map((task, index) => {
                        const medicalIcons = [Stethoscope, Pill, Activity, HeartPulse, Thermometer];
                        const Icon = medicalIcons[index % medicalIcons.length];

                        const total = task.total_sessions || 0;
                        const completed = task.completed_sessions || 0;

                        const progressPercentage =
                            total > 0 ? Math.min((completed / total) * 100, 100) : 0;

                        const isCompleted = total > 0 && completed === total;

                        const isExpanded = expandedTaskId === task.item_id;

                        return (
                            <div
                                key={task.item_id}
                                className="flex flex-col py-2 px-3 rounded-xl hover:bg-gray-200/25 transition-all duration-200 cursor-pointer group"
                                onClick={() => setExpandedTaskId(isExpanded ? null : task.item_id)}
                            >
                                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 sm:gap-0">
                                    {/* LEFT */}
                                    <div className="flex items-center gap-3 overflow-hidden">
                                        <div className="p-2 bg-[#F7F7F7] rounded-xl group-hover:bg-white/80 transition-all duration-300 shadow-sm border border-black/5 shrink-0">
                                            <Icon className="w-5 h-5 text-[#4A4A4A] group-hover:text-black transition-colors" />
                                        </div>
                                        <div className="flex flex-col min-w-0">
                                            <p className="text-[15px] font-medium text-[#4A4A4A] truncate">
                                                {task.name}
                                            </p>

                                            {task.category && (
                                                <p className="text-xs text-[#8E8E8E] truncate">
                                                    {task.category}
                                                </p>
                                            )}
                                        </div>
                                    </div>

                                    {/* RIGHT */}
                                    <div className="flex flex-row items-center justify-between sm:justify-end sm:flex-col sm:items-end w-full sm:w-40 pl-[48px] sm:pl-0 mt-1 sm:mt-0">
                                        {isCompleted ? (
                                            <div className="flex items-center justify-between w-full sm:w-auto">
                                                <span className="px-3 py-[3px] bg-[#BEE3F8] text-[#3182CE] text-xs font-medium rounded-full">
                                                    Completed
                                                </span>
                                                <ChevronRight className={`sm:hidden shrink-0 w-5 h-5 text-black/40 group-hover:text-black/60 transition-transform duration-300 ${isExpanded ? 'rotate-90' : ''}`} />
                                            </div>
                                        ) : (
                                            <div className="flex gap-2 items-center w-full sm:w-auto">
                                                <div className="flex flex-col gap-1 flex-1 sm:w-40">
                                                    <span className="text-xs sm:text-sm text-text-gray font-medium">
                                                        {completed}/{total} weeks
                                                    </span>

                                                    <div className="w-full h-[7px] bg-[#E4E4E4] rounded-full overflow-hidden">
                                                        <div
                                                            className="h-full bg-[#FBD38D] rounded-full"
                                                            style={{ width: `${progressPercentage}%` }}
                                                        />
                                                    </div>
                                                </div>

                                                <ChevronRight className={`shrink-0 w-5 h-5 sm:w-6 sm:h-6 text-black/40 group-hover:text-black/60 transition-transform duration-300 ${isExpanded ? 'rotate-90' : ''}`} />
                                            </div>
                                        )}
                                    </div>
                                </div>

                                {/* Expanded Subtitle */}
                                {isExpanded && task.subtitle && (
                                    <div className="mt-2 pt-2 border-t border-black/5 animate-in fade-in slide-in-from-top-1 duration-300">
                                        <p className="text-xs text-[#545454] leading-relaxed italic">
                                            {task.subtitle}
                                        </p>
                                    </div>
                                )}
                            </div>
                        );
                    })}

                </div>
            </div>
        </Card>
    )
}
