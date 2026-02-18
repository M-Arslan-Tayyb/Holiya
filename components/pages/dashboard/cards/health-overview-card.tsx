'use client'

import { Card } from '@/components/ui/card'
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts'

const data = [
    { name: 'Improvement', value: 60 },
    { name: 'Remaining', value: 40 },
]

export function HealthOverviewCard() {
    return (
        <Card className="bg-white border border-[#F0E6D8] p-6 rounded-2xl">
            <h3 className="text-lg font-semibold text-[#545454] mb-1">Health overview</h3>
            <p className="text-sm text-[#545454] opacity-70 mb-6">Current conditions</p>

            {/* Circular progress chart */}
            <div className="flex justify-center mb-6">
                <div className="w-32 h-32">
                    <ResponsiveContainer width="100%" height="100%">
                        <PieChart>
                            <Pie
                                data={data}
                                cx="50%"
                                cy="50%"
                                innerRadius={50}
                                outerRadius={65}
                                paddingAngle={2}
                                dataKey="value"
                            >
                                <Cell fill="#4CAF50" />
                                <Cell fill="#F7EFE5" />
                            </Pie>
                        </PieChart>
                    </ResponsiveContainer>
                </div>
            </div>

            {/* Center text */}
            <div className="text-center mb-6">
                <p className="text-sm text-[#545454] opacity-70">Improvement</p>
                <p className="text-3xl font-bold text-[#4CAF50]">60%</p>
            </div>

            {/* Time period tabs */}
            <div className="flex gap-2 mb-4 bg-[#F7EFE5] p-1 rounded-lg">
                <button className="flex-1 py-1 px-3 text-xs font-medium text-[#545454] rounded hover:bg-white">
                    1 Week
                </button>
                <button className="flex-1 py-1 px-3 text-xs font-medium text-[#545454] bg-white rounded shadow-sm">
                    3 months
                </button>
            </div>

            {/* Badges */}
            <div className="flex gap-2">
                <span className="px-3 py-1 bg-[#E3F2FD] text-[#0277BD] text-xs font-medium rounded-full">
                    PMS
                </span>
                <span className="px-3 py-1 bg-[#FFEBEE] text-[#C62828] text-xs font-medium rounded-full">
                    Spinal issues
                </span>
            </div>
        </Card>
    )
}
