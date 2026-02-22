'use client'

import { WorkEnvironmentCard } from '@/components/pages/dashboard/cards/work-environment-card'
import { HealthOverviewCard } from '@/components/pages/dashboard/cards/health-overview-card'
import { HealthProgramCard } from '@/components/pages/dashboard/cards/health-program-card'
import { SymptomTrendsCard } from '@/components/pages/dashboard/cards/symptom-trends-card'
import { IntegratedAppsCard } from '@/components/pages/dashboard/cards/integrated-apps-card'
import { UpcomingEventsCard } from '@/components/pages/dashboard/cards/upcoming-events-card'
import { MessageCircle } from 'lucide-react'
import { useGetUserDashboardFullQuery } from '@/services/features/dashboard/api'
import { useSession } from 'next-auth/react'

export default function DashboardPage() {
    const session = useSession()
    const userId = session.data?.user?.id

    const { data, isLoading } = useGetUserDashboardFullQuery({ user_id: Number(userId) })
    // const { data, isLoading } = useGetUserDashboardFullQuery({ user_id: 35 })


    const stressLevel = data?.data?.stress_level
    console.log(stressLevel)
    return (
        <>
            {/* Main content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Left column */}
                <div className="lg:col-span-2 space-y-6">

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <WorkEnvironmentCard
                            stressLevel={stressLevel}
                            isLoading={isLoading}
                        />
                        <HealthOverviewCard
                            healthOverview={data?.data?.health_overview}
                            isLoading={isLoading}
                        />
                    </div>

                    {/* <HealthProgramCard /> */}


                </div>

                {/* Right column */}
                <div className="lg:col-span-1 space-y-6">
                    <SymptomTrendsCard
                        symptomTrends={data?.data?.symptom_trends}
                        isLoading={isLoading}
                    />
                    {/* <IntegratedAppsCard /> */}

                    <div className="max-h-80 overflow-y-auto">
                        {/* <UpcomingEventsCard /> */}
                    </div>
                </div>
            </div>


        </>
    )
}