'use client'

import { Card } from '@/components/ui/card'
import { ChevronRight } from 'lucide-react'
import { useState } from 'react'

const tasks = [
    {
        id: 1,
        icon: '👨‍⚕️',
        title: 'Medical Consultation',
        status: 'Completed',
        progress: null,
    },
    {
        id: 2,
        icon: '🌿',
        title: 'Acupuncture 6 sessions',
        status: 'In Progress',
        progress: '3/6 sessions',
    },
    {
        id: 3,
        icon: '🥗',
        title: 'Weekly nutrition plan',
        status: 'Upcoming',
        progress: 'Week 10',
    },
    {
        id: 4,
        icon: '🍃',
        title: 'Herbal supplements',
        status: 'Upcoming',
        progress: 'Week 10/13',
    },
    {
        id: 5,
        icon: '⌚',
        title: 'Wearable device: Tens unit',
        status: 'Upcoming',
        progress: 'Week 10',
    },
]

export function HealthProgramCard() {
    const [expandedTaskId, setExpandedTaskId] = useState<number | null>(null)

    return (
        <Card className="bg-white border border-[#F0E6D8] p-6 rounded-2xl">
            <h3 className="text-lg font-semibold text-[#545454] mb-1">Health program</h3>
            <p className="text-sm text-[#545454] opacity-70 mb-6">6 month plan</p>

            {/* Timeline steps */}
            <div className="mb-6 flex gap-3 overflow-x-auto pb-2">
                <div className="flex-shrink-0 flex flex-col items-center gap-2">
                    <div className="px-3 py-1 bg-[#E8F5E9] text-[#2E7D32] text-xs font-medium rounded-full whitespace-nowrap">
                        Week 6
                    </div>
                    <p className="text-xs text-[#545454] text-center">Initial Assessment</p>
                </div>
                <div className="flex-shrink-0 flex flex-col items-center gap-2">
                    <div className="px-3 py-1 bg-[#E8F5E9] text-[#2E7D32] text-xs font-medium rounded-full whitespace-nowrap">
                        Week 1
                    </div>
                    <p className="text-xs text-[#545454] text-center">Check-up</p>
                </div>
                <div className="flex-shrink-0 flex flex-col items-center gap-2">
                    <div className="px-3 py-1 bg-[#FFF3E0] text-[#E65100] text-xs font-medium rounded-full whitespace-nowrap">
                        Week 12
                    </div>
                    <p className="text-xs text-[#545454] text-center">Orthopaedist appt</p>
                </div>
            </div>

            {/* Tasks list */}
            <div className="space-y-2">
                {tasks.map((task) => (
                    <button
                        key={task.id}
                        onClick={() => setExpandedTaskId(expandedTaskId === task.id ? null : task.id)}
                        className="w-full flex items-center justify-between p-3 rounded-lg hover:bg-[#F7EFE5] transition-colors border border-transparent hover:border-[#F0E6D8]"
                    >
                        <div className="flex items-center gap-3 text-left flex-1">
                            <span className="text-lg">{task.icon}</span>
                            <div>
                                <p className="text-sm font-medium text-[#545454]">{task.title}</p>
                                {task.progress && (
                                    <p className="text-xs text-[#545454] opacity-60">{task.progress}</p>
                                )}
                            </div>
                        </div>
                        <div className="flex items-center gap-2">
                            {task.status === 'Completed' && (
                                <span className="px-2 py-1 bg-[#E8F5E9] text-[#2E7D32] text-xs font-medium rounded">
                                    Completed
                                </span>
                            )}
                            {task.status === 'In Progress' && task.progress && (
                                <div className="w-16 h-2 bg-[#F7EFE5] rounded-full overflow-hidden">
                                    <div className="h-full bg-gradient-to-r from-[#F6C6A4] to-[#CA925F]" style={{ width: '50%' }}></div>
                                </div>
                            )}
                            {task.status === 'Upcoming' && task.progress && (
                                <div className="w-16 h-2 bg-[#F7EFE5] rounded-full overflow-hidden">
                                    <div className="h-full bg-gradient-to-r from-[#F6C6A4] to-[#CA925F]" style={{ width: '30%' }}></div>
                                </div>
                            )}
                            <ChevronRight className="w-4 h-4 text-[#545454] opacity-50" />
                        </div>
                    </button>
                ))}
            </div>
        </Card>
    )
}
