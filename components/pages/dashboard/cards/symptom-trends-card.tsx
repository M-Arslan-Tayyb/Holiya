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

const data = [
    { date: 'Sep 3', PMS: 2, 'Spinal pain': 3 },
    { date: 'Sep 4', PMS: 3, 'Spinal pain': 4 },
    { date: 'Sep 5', PMS: 2, 'Spinal pain': 2 },
    { date: 'Sep 6', PMS: 4, 'Spinal pain': 3 },
    { date: 'Sep 7', PMS: 3, 'Spinal pain': 2 },
]

export function SymptomTrendsCard() {
    return (
        <Card className="bg-gradient-to-br from-[#F6C6A4] via-[#F7EFE5] to-[#FFFFFF] border-0 p-6 rounded-2xl">
            <h3 className="text-lg font-semibold text-[#545454] mb-1">Symptom trends</h3>
            <p className="text-sm text-[#545454] opacity-70 mb-6">
                Tracking how often you experienced certain symptoms
            </p>

            {/* Chart */}
            <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                    <LineChart data={data} margin={{ top: 5, right: 30, left: 0, bottom: 5 }}>
                        <CartesianGrid strokeDasharray="3 3" stroke="rgba(212, 180, 140, 0.3)" />
                        <XAxis dataKey="date" stroke="#545454" fontSize={12} />
                        <YAxis stroke="#545454" fontSize={12} />
                        <Tooltip
                            contentStyle={{
                                backgroundColor: '#FFFFFF',
                                border: '1px solid #F0E6D8',
                                borderRadius: '8px',
                            }}
                            cursor={{ stroke: '#CA925F', strokeWidth: 1 }}
                        />
                        <Legend
                            wrapperStyle={{
                                paddingTop: '16px',
                            }}
                        />
                        <Line
                            type="monotone"
                            dataKey="PMS"
                            stroke="#63B3ED"
                            strokeWidth={2}
                            dot={{ fill: '#63B3ED', r: 4 }}
                            activeDot={{ r: 6 }}
                        />
                        <Line
                            type="monotone"
                            dataKey="Spinal pain"
                            stroke="#FD8D8D"
                            strokeWidth={2}
                            dot={{ fill: '#FD8D8D', r: 4 }}
                            activeDot={{ r: 6 }}
                        />
                    </LineChart>
                </ResponsiveContainer>
            </div>
        </Card>
    )
}
