'use client'

import { Card } from '@/components/ui/card'
import {
    LineChart,
    Line,
    XAxis,
    YAxis,
    CartesianGrid,
    Tooltip,
    Legend,
    ResponsiveContainer,
} from 'recharts'
import { Loader2, Maximize2, Minimize2 } from 'lucide-react'
import { useMemo, useState } from 'react'

interface SymptomTrend {
    name: string
    mention_count: number
    sessions_affected: number
}

interface SymptomTrendsData {
    symptoms: SymptomTrend[]
    has_data: boolean
    max_count?: number
}

interface SymptomTrendsCardProps {
    symptomTrends?: SymptomTrendsData
    isLoading?: boolean
}

/* Stable pastel colors */
const COLORS = [
    '#63B3ED', '#FD8D8D', '#FBBF24', '#A78BFA', '#F87171',
    '#34D399', '#F472B6', '#60A5FA', '#FB923C',
    '#22D3EE', '#818CF8', '#C084FC', '#38BDF8',
]

const getColor = (index: number) => COLORS[index % COLORS.length]

/* Deterministic transform (NO random values) */
const transformSymptomData = (symptoms: SymptomTrend[], showAll: boolean) => {
    const symptomsToUse = showAll ? symptoms : symptoms.slice(0, 2)
    const weeks = ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5']

    return weeks.map((week, index) => {
        const point: { date: string;[key: string]: number | string } = {
            date: week,
        }

        symptomsToUse.forEach((symptom) => {
            // distribute mention_count gradually over weeks
            const value = Math.round(
                (symptom.mention_count / weeks.length) * (index + 1)
            )
            point[symptom.name] = value
        })

        return point
    })
}

export function SymptomTrendsCard({
    symptomTrends,
    isLoading = false,
}: SymptomTrendsCardProps) {

    if (isLoading) {
        return (
            <Card className="bg-[linear-gradient(135deg,#FFD6D0_0%,#F7EFE5_50%,#FFFFFF_100%)] gap-0 border-none p-4 rounded-2xl lg:ml-9 lg:w-[90%] w-full">
                <div className="flex items-center justify-center min-h-[280px]">
                    <Loader2 className="w-6 h-6 text-[#CA925F] animate-spin" />
                </div>
            </Card>
        )
    }

    if (!symptomTrends?.has_data) {
        return (
            <Card className="bg-[linear-gradient(135deg,#FFD6D0_0%,#F7EFE5_50%,#FFFFFF_100%)] gap-0 border-none p-4 rounded-2xl lg:ml-9 lg:w-[90%] w-full">
                <h3 className="text-lg font-semibold text-[#545454] opacity-70 mb-1 font-sans">
                    Symptom trends
                </h3>
                <p className="text-base text-[#545454] opacity-70 mb-6">
                    Tracking how often you experienced certain symptoms
                </p>
                <div className="flex flex-col items-center justify-center h-64 text-[#545454] opacity-70">
                    <p className="text-sm">No data available yet</p>
                    <p className="text-xs opacity-50 mt-1">
                        Complete your assessment to see insights
                    </p>
                </div>
            </Card>
        )
    }

    const symptoms = symptomTrends.symptoms
    const maxY = symptomTrends.max_count || 10
    const hasMultipleSymptoms = symptoms.length > 2

    const [isFullscreen, setIsFullscreen] = useState(false)
    const chartData = useMemo(
        () => transformSymptomData(symptoms, isFullscreen),
        [symptoms, isFullscreen]
    )


    /* Custom Tooltip → show mention_count */
    const CustomTooltip = ({ active, payload, label }: any) => {
        if (active && payload && payload.length) {
            return (
                <div className="bg-white border border-[#F0E6D8] rounded-lg p-3 shadow-md">
                    <p className="text-xs text-gray-500 mb-1">{label}</p>
                    {payload.map((entry: any, index: number) => (
                        <p
                            key={index}
                            className="text-sm"
                            style={{ color: entry.color }}
                        >
                            {entry.name}: {entry.value} mentions
                        </p>
                    ))}
                </div>
            )
        }
        return null
    }

    /* ================= NORMAL VIEW ================= */

    if (!isFullscreen) {
        const topSymptoms = symptoms.slice(0, 2)

        return (
            <Card className="bg-[linear-gradient(135deg,#FFD6D0_0%,#F7EFE5_50%,#FFFFFF_100%)] gap-0 border-none p-4 rounded-2xl lg:ml-9 lg:w-[90%] w-full relative">
                <div className="flex items-center justify-between mb-1">
                    <h3 className="text-lg font-semibold text-[#545454] opacity-70 font-sans">
                        Symptom trends
                    </h3>
                    {hasMultipleSymptoms && (
                        <button
                            onClick={() => setIsFullscreen(true)}
                            className="p-2 hover:bg-gray-100 rounded-lg transition-colors"
                        >
                            <Maximize2 className="w-4 h-4 text-[#545454]" />
                        </button>
                    )}
                </div>

                <p className="text-base text-[#545454] opacity-70 mb-6">
                    Tracking how often you experienced certain symptoms
                </p>

                <div className="w-full h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="date" />
                            <YAxis domain={[0, maxY]} />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend />

                            {topSymptoms.map((symptom, index) => (
                                <Line
                                    key={symptom.name}
                                    type="monotone"
                                    dataKey={symptom.name}
                                    stroke={getColor(index)}
                                    strokeWidth={2}
                                    dot={{ r: 4 }}
                                />
                            ))}
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {hasMultipleSymptoms && (
                    <p className="text-xs text-[#545454] opacity-50 mt-2 text-center">
                        +{symptoms.length - 2} more symptoms. Click to view all
                    </p>
                )}
            </Card>
        )
    }

    /* ================= FULLSCREEN ================= */

    return (
        <div className="fixed inset-0 z-50 bg-black/10 flex items-center justify-center p-4 h-full">
            <Card className="bg-[linear-gradient(135deg,#FFD6D0_0%,#F7EFE5_50%,#FFFFFF_100%)] border-none p-6 rounded-3xl w-full max-w-6xl">
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-[#545454] font-sans">
                        All Symptom Trends
                    </h3>
                    <button
                        onClick={() => setIsFullscreen(false)}
                        className="p-2 hover:bg-gray-100 rounded-lg"
                    >
                        <Minimize2 className="w-5 h-5 text-[#545454]" />
                    </button>
                </div>

                <div className="w-full h-96 mb-6">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart data={chartData}>
                            <CartesianGrid strokeDasharray="3 3" vertical={false} />
                            <XAxis dataKey="date" />
                            <YAxis domain={[0, maxY]} />
                            <Tooltip content={<CustomTooltip />} />
                            <Legend wrapperStyle={{ flexWrap: 'wrap' }} />

                            {symptoms.map((symptom, index) => (
                                <Line
                                    key={symptom.name}
                                    type="monotone"
                                    dataKey={symptom.name}
                                    stroke={getColor(index)}
                                    strokeWidth={2}
                                    dot={{ r: 4 }}
                                />
                            ))}
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Scrollable 2-row symptom grid */}
                <div className="h-[160px] overflow-y-auto">
                    <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                        {symptoms.map((symptom, index) => (
                            <div
                                key={symptom.name}
                                className="flex items-center gap-3 p-3 bg-gray-50 rounded-xl"
                            >
                                <div
                                    className="w-3 h-3 rounded-full"
                                    style={{ backgroundColor: getColor(index) }}
                                />
                                <div className="min-w-0">
                                    <p className="text-sm font-medium truncate">
                                        {symptom.name}
                                    </p>
                                    <p className="text-xs opacity-70">
                                        {symptom.mention_count} mentions •{' '}
                                        {symptom.sessions_affected} sessions
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>
            </Card>
        </div>
    )
}