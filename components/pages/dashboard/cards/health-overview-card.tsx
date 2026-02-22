'use client'

import { Card } from '@/components/ui/card'
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'
import { Loader2 } from 'lucide-react'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@/components/ui/tooltip'

interface HealthOverviewData {
    improvement_percentage: number
    current_conditions: string[]
    summary: string
    has_data: boolean
}

interface HealthOverviewCardProps {
    healthOverview?: HealthOverviewData
    isLoading?: boolean
}

export function HealthOverviewCard({ healthOverview, isLoading = false }: HealthOverviewCardProps) {
    // Prepare pie chart data
    const pieData = healthOverview?.has_data
        ? [
            { name: 'Improvement', value: healthOverview.improvement_percentage },
            { name: 'Remaining', value: 100 - healthOverview.improvement_percentage },
        ]
        : [
            { name: 'Improvement', value: 0 },
            { name: 'Remaining', value: 100 },
        ]

    // Loading State - Loader2 centered, exact style preserved
    if (isLoading) {
        return (
            <Card
                className="border-none p-4 rounded-3xl gap-0
                bg-[linear-gradient(to_bottom,#FBE4D6_0%,#F7EFE5_60%,rgba(255,255,255,0.65)_100%)]"
            >
                <div className="flex items-center justify-center min-h-[180px]">
                    <Loader2 className="w-6 h-6 text-[#CA925F] animate-spin" />
                </div>
            </Card>
        )
    }

    // No Data State
    if (!healthOverview?.has_data) {
        return (
            <Card
                className="border-none p-4 rounded-3xl w-full lg:w-[110%] mx-auto
                bg-[linear-gradient(to_bottom,#FBE4D6_0%,#F7EFE5_60%,rgba(255,255,255,0.65)_100%)]
                flex flex-col lg:flex-row justify-between gap-8 lg:gap-6"
            >
                <div className="flex-1 w-full lg:w-auto flex flex-col">
                    <div className='flex justify-between flex-col h-full w-full'>
                        <div className="">
                            <h3 className="text-lg font-semibold text-gray-800">Health overview</h3>
                        </div>
                        <div className="flex flex-col flex-wrap gap-2">
                            <div className="text-sm text-[#545454] opacity-70">Current conditions</div>
                            <div className="text-sm text-[#545454] opacity-70">No conditions recorded</div>
                        </div>
                    </div>
                </div>
                <div className="relative w-full max-w-[210px] aspect-square md:w-64 lg:w-72 flex-shrink-0 mx-auto lg:mx-0">
                    <div className="absolute inset-0 flex flex-col items-center justify-center">
                        <span className="text-[26px] md:text-[32px] font-sans text-[#545454] leading-none">
                            0%
                        </span>
                        <span className="text-[10px] md:text-[12px] font-medium text-[#545454] opacity-50 mt-1">
                            No Data
                        </span>
                    </div>
                </div>
            </Card>
        )
    }

    // Has Data State - Exact style preserved
    return (
        <Card
            className="border-none p-4 rounded-3xl w-full lg:w-[110%] mx-auto
            bg-[linear-gradient(to_bottom,#FBE4D6_0%,#F7EFE5_60%,rgba(255,255,255,0.65)_100%)]
            flex flex-col lg:flex-row justify-between gap-8 lg:gap-6"
        >
            {/* Left Section: Content */}
            <div className="flex-1 w-full lg:w-auto flex flex-col">
                <div className='flex justify-between flex-col h-full w-full'>
                    <div className="">
                        <h3 className="text-lg font-semibold text-gray-800 font-sans">Health overview</h3>
                    </div>

                    <TooltipProvider>
                        <div className="flex flex-col flex-wrap gap-2">
                            <div className="text-sm text-[#545454] opacity-70">Current conditions</div>

                            <div className="flex flex-col gap-2 overflow-y-auto max-h-[72px] pr-2 -mr-2">
                                {healthOverview.current_conditions.slice(0, 6).map((condition, index) => {
                                    const firstWord = condition.split(' ')[0]
                                    const isLong = condition.length > 20

                                    return (
                                        <Tooltip key={index}>
                                            <TooltipTrigger asChild>
                                                <button
                                                    type="button"
                                                    className={`px-3 py-2 text-text-gray text-xs font-medium rounded-xl w-[80%] flex items-center gap-2 
                  ${index % 2 === 0 ? 'bg-blue-300' : 'bg-red-300'}`}
                                                >
                                                    <div className={`w-2 h-2 rounded-full ${index % 2 === 0 ? 'bg-blue-500' : 'bg-red-500'}`} />
                                                    <span className="truncate">{isLong ? `${firstWord}...` : condition}</span>
                                                </button>
                                            </TooltipTrigger>
                                            <TooltipContent side="right" sideOffset={4} className="max-w-[200px] z-50">
                                                <p className="text-xs">{condition}</p>
                                            </TooltipContent>
                                        </Tooltip>
                                    )
                                })}
                            </div>
                        </div>
                    </TooltipProvider>

                </div>
            </div>

            {/* Right Section: Chart */}
            <div className="relative w-full max-w-[210px] aspect-square md:w-64 lg:w-72 flex-shrink-0 mx-auto lg:mx-0">
                <ResponsiveContainer width="100%" height="100%">
                    <PieChart>
                        <Pie
                            data={pieData}
                            cx="50%"
                            cy="50%"
                            innerRadius={68}
                            outerRadius={80}
                            paddingAngle={2}
                            dataKey="value"
                            startAngle={220}
                            endAngle={-40}
                            stroke="none"
                        >
                            <Cell fill="#55b55aff" />
                            <Cell fill="#E0E0E0" />
                        </Pie>
                    </PieChart>
                </ResponsiveContainer>

                {/* Centralized Text Overlay */}
                <div className="absolute inset-0 flex flex-col items-center justify-center pointer-events-none">
                    <span className="text-[26px] md:text-[32px] font-sans text-[#545454] leading-none">
                        {healthOverview.improvement_percentage}%
                    </span>
                    <span className="text-[10px] md:text-[12px] font-medium text-[#545454] opacity-50 mt-1">
                        Improvement
                    </span>
                </div>

                {/* Timeline Labels */}
                <div className="absolute bottom-4 left-6 text-[10px] md:text-xs text-[#545454] opacity-70 font-medium">
                    1 Week
                </div>
                <div className="absolute bottom-4 right-6 text-[10px] md:text-xs text-[#545454] opacity-70 font-medium">
                    3 Months
                </div>
            </div>
        </Card>
    )
}