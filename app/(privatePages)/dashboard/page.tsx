'use client'

import { WorkEnvironmentCard } from '@/components/pages/dashboard/cards/work-environment-card'
import { HealthOverviewCard } from '@/components/pages/dashboard/cards/health-overview-card'
import { HealthProgramCard } from '@/components/pages/dashboard/cards/health-program-card'
import { SymptomTrendsCard } from '@/components/pages/dashboard/cards/symptom-trends-card'
import { IntegratedAppsCard } from '@/components/pages/dashboard/cards/integrated-apps-card'
import { UpcomingEventsCard } from '@/components/pages/dashboard/cards/upcoming-events-card'
import { MessageCircle } from 'lucide-react'

export default function DashboardPage() {
    return (
        <>
            {/* Main content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Left column */}
                {/* <div className="lg:col-span-2 space-y-6">

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <WorkEnvironmentCard />
                        <HealthOverviewCard />
                    </div>

                    <HealthProgramCard />


                </div> */}

                {/* Right column */}
                {/* <div className="lg:col-span-1 space-y-6">
                    <SymptomTrendsCard />
                    <IntegratedAppsCard />

                    <div className="max-h-80 overflow-y-auto">
                        <UpcomingEventsCard />
                    </div>
                </div> */}
            </div>

            {/* Floating Chat Button */}
            <button
                className="fixed bottom-6 right-6 w-16 h-16 rounded-full bg-white border-2 border-gray-200 text-[#545454] shadow-lg hover:border-gray-300 hover:bg-gray-50 transition-colors flex items-center justify-center z-20"
                aria-label="Open chat"
            >
                <MessageCircle className="w-8 h-8" />
            </button>
        </>
    )
}