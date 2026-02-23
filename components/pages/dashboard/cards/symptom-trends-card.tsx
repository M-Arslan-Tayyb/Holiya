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
import { useState } from 'react'

interface SymptomTrend {
    name: string
    mention_count: number
    sessions_affected: number
}

interface SymptomTrendsData {
    symptoms: SymptomTrend[]
    has_data: boolean
}

interface SymptomTrendsCardProps {
    symptomTrends?: SymptomTrendsData
    isLoading?: boolean
}

// Helper: Generate random pastel color
const getRandomPastelColor = (index: number) => {
    const colors = [
        '#63B3ED', '#FD8D8D', '#FBBF24', '#A78BFA', '#F87171',
        '#34D399', '#F472B6', '#60A5FA', '#A78BFA', '#FB923C',
        '#22D3EE', '#818CF8', '#C084FC', '#F87171', '#38BDF8',
    ]
    return colors[index % colors.length]
}

// Helper: Transform API data to line chart format
const transformSymptomData = (symptoms: SymptomTrend[], showAll: boolean = false) => {
    const symptomsToUse = showAll ? symptoms : symptoms.slice(0, 2)
    const dates = ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5']

    return dates.map((date, index) => {
        const dataPoint: { date: string;[key: string]: string | number } = { date }

        symptomsToUse.forEach((symptom) => {
            const baseValue = Math.round(symptom.mention_count / dates.length)
            const variation = Math.floor(Math.random() * 3) - 1
            dataPoint[symptom.name] = Math.max(0, baseValue + variation + index % 2)
        })

        return dataPoint
    })
}

export function SymptomTrendsCard({ symptomTrends, isLoading = false }: SymptomTrendsCardProps) {
    const [isFullscreen, setIsFullscreen] = useState(false)
    const hasData = symptomTrends?.has_data ?? false

    // Loading State
    if (isLoading) {
        return (
            <Card className="bg-[linear-gradient(135deg,#FFD6D0_0%,#F7EFE5_50%,#FFFFFF_100%)] gap-0 border-none p-4 rounded-2xl lg:ml-9 lg:w-[90%] w-full">
                <div className="flex items-center justify-center min-h-[280px]">
                    <Loader2 className="w-6 h-6 text-[#CA925F] animate-spin" />
                </div>
            </Card>
        )
    }

    // No Data State
    if (!symptomTrends?.has_data) {
        return (
            <Card className="bg-[linear-gradient(135deg,#FFD6D0_0%,#F7EFE5_50%,#FFFFFF_100%)] gap-0 border-none p-4 rounded-2xl lg:ml-9 lg:w-[90%] w-full">
                <h3 className="text-lg font-semibold text-[#545454] opacity-70 mb-1 font-sans">Symptom trends</h3>
                <p className="text-base text-[#545454] opacity-70 mb-6">
                    Tracking how often you experienced certain symptoms
                </p>
                {/* 👉 Updated informative message */}
                <div className="flex flex-col items-center justify-center h-64 text-[#545454] opacity-70">
                    <p className="text-sm">No data available yet</p>
                    <p className="text-xs opacity-50 mt-1">Complete your assessment to see insights</p>
                </div>
            </Card>
        )
    }


    const symptoms = symptomTrends.symptoms
    const hasMultipleSymptoms = symptoms.length > 2
    const chartData = transformSymptomData(symptoms, isFullscreen)

    // Regular View (Limited to 2 symptoms)
    if (!isFullscreen) {
        const topSymptoms = symptoms.slice(0, 2)

        return (
            <Card className="bg-[linear-gradient(135deg,#FFD6D0_0%,#F7EFE5_50%,#FFFFFF_100%)] gap-0 border-none p-4 rounded-2xl lg:ml-9 lg:w-[90%] w-full relative">
                {/* Header with Fullscreen Button */}
                <div className="flex items-center justify-between mb-1">
                    <h3 className="text-lg font-semibold text-[#545454] opacity-70 font-sans">
                        Symptom trends
                    </h3>
                    {hasMultipleSymptoms && (
                        <button
                            onClick={() => setIsFullscreen(true)}
                            className="p-2 hover:bg-white/50 rounded-lg transition-colors"
                            title="View all symptoms"
                        >
                            <Maximize2 className="w-4 h-4 text-[#545454] opacity-70" />
                        </button>
                    )}
                </div>

                <p className="text-base text-[#545454] opacity-70 mb-6">
                    Tracking how often you experienced certain symptoms
                </p>

                {/* Chart */}
                <div className="w-full h-64">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                            data={chartData}
                            margin={{ top: 10, right: 10, left: -20, bottom: 5 }}
                        >
                            <CartesianGrid
                                strokeDasharray="3 3"
                                stroke="rgba(212, 180, 140, 0.3)"
                                vertical={false}
                            />
                            <XAxis
                                dataKey="date"
                                stroke="#545454"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                dy={10}
                            />
                            <YAxis
                                stroke="#545454"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                tickCount={5}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#FFFFFF',
                                    border: '1px solid #F0E6D8',
                                    borderRadius: '8px',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                }}
                                cursor={{ stroke: '#CA925F', strokeWidth: 1 }}
                            />
                            <Legend
                                wrapperStyle={{
                                    paddingTop: '20px',
                                    display: 'flex',
                                    justifyContent: 'center',
                                }}
                            />
                            {topSymptoms.map((symptom, index) => (
                                <Line
                                    key={symptom.name}
                                    type="monotone"
                                    dataKey={symptom.name}
                                    stroke={getRandomPastelColor(index)}
                                    strokeWidth={2}
                                    dot={{ fill: getRandomPastelColor(index), r: 4 }}
                                    activeDot={{ r: 6 }}
                                />
                            ))}
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Show indicator if more symptoms available */}
                {hasMultipleSymptoms && (
                    <p className="text-xs text-[#545454] opacity-50 mt-2 text-center">
                        +{symptoms.length - 2} more symptoms. Click to view all
                    </p>
                )}
            </Card>
        )
    }

    // Fullscreen View (All symptoms)
    return (
        <div className="fixed inset-0 z-50 bg-black/50 flex items-center justify-center p-4">
            <Card className="bg-[linear-gradient(135deg,#FFD6D0_0%,#F7EFE5_50%,#FFFFFF_100%)] border-none p-6 rounded-3xl w-full max-w-6xl max-h-[90vh] overflow-y-auto">
                {/* Header with Close Button */}
                <div className="flex items-center justify-between mb-4">
                    <h3 className="text-xl font-semibold text-[#545454] font-sans">
                        All Symptom Trends
                    </h3>
                    <button
                        onClick={() => setIsFullscreen(false)}
                        className="p-2 hover:bg-white/50 rounded-lg transition-colors"
                    >
                        <Minimize2 className="w-5 h-5 text-[#545454]" />
                    </button>
                </div>

                <p className="text-base text-[#545454] opacity-70 mb-6">
                    Tracking how often you experienced certain symptoms
                </p>

                {/* Chart - Taller in fullscreen */}
                <div className="w-full h-96">
                    <ResponsiveContainer width="100%" height="100%">
                        <LineChart
                            data={chartData}
                            margin={{ top: 10, right: 30, left: -20, bottom: 5 }}
                        >
                            <CartesianGrid
                                strokeDasharray="3 3"
                                stroke="rgba(212, 180, 140, 0.3)"
                                vertical={false}
                            />
                            <XAxis
                                dataKey="date"
                                stroke="#545454"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                dy={10}
                            />
                            <YAxis
                                stroke="#545454"
                                fontSize={12}
                                tickLine={false}
                                axisLine={false}
                                tickCount={5}
                            />
                            <Tooltip
                                contentStyle={{
                                    backgroundColor: '#FFFFFF',
                                    border: '1px solid #F0E6D8',
                                    borderRadius: '8px',
                                    boxShadow: '0 4px 12px rgba(0,0,0,0.1)',
                                }}
                                cursor={{ stroke: '#CA925F', strokeWidth: 1 }}
                            />
                            <Legend
                                wrapperStyle={{
                                    paddingTop: '20px',
                                    display: 'flex',
                                    justifyContent: 'center',
                                    flexWrap: 'wrap',
                                }}
                            />
                            {symptoms.map((symptom, index) => (
                                <Line
                                    key={symptom.name}
                                    type="monotone"
                                    dataKey={symptom.name}
                                    stroke={getRandomPastelColor(index)}
                                    strokeWidth={2}
                                    dot={{ fill: getRandomPastelColor(index), r: 4 }}
                                    activeDot={{ r: 6 }}
                                />
                            ))}
                        </LineChart>
                    </ResponsiveContainer>
                </div>

                {/* Symptom List */}
                <div className="mt-6 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                    {symptoms.map((symptom, index) => (
                        <div
                            key={symptom.name}
                            className="flex items-center gap-3 p-3 bg-white/50 rounded-xl"
                        >
                            <div
                                className="w-3 h-3 rounded-full"
                                style={{ backgroundColor: getRandomPastelColor(index) }}
                            />
                            <div className="flex-1 min-w-0">
                                <p className="text-sm font-medium text-[#545454] truncate">
                                    {symptom.name}
                                </p>
                                <p className="text-xs text-[#545454] opacity-70">
                                    {symptom.mention_count} mentions • {symptom.sessions_affected} sessions
                                </p>
                            </div>
                        </div>
                    ))}
                </div>
            </Card>
        </div>
    )
}