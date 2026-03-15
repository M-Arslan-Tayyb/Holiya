'use client'

import { WorkEnvironmentCard } from '@/components/pages/dashboard/cards/work-environment-card'
import { HealthOverviewCard } from '@/components/pages/dashboard/cards/health-overview-card'
import { HealthProgramCard } from '@/components/pages/dashboard/cards/health-program-card'
import { SymptomTrendsCard } from '@/components/pages/dashboard/cards/symptom-trends-card'
import { UpcomingEventsCard } from '@/components/pages/dashboard/cards/upcoming-events-card'
import { MessageCircle } from 'lucide-react'
import { useGetUserDashboardFullQuery, useGetHealthPlanQuery } from '@/services/features/dashboard/api'
import { useSession } from 'next-auth/react'
import { Loader } from '@/components/common/Loader'

export default function DashboardPage() {
    const session = useSession()
    const userId = session.data?.user?.id

    const { data: dashboardData, isLoading: isDashboardLoading } = useGetUserDashboardFullQuery({ user_id: Number(userId) }, { skip: !userId })
    // const { data: dashboardData, isLoading: isDashboardLoading } = useGetUserDashboardFullQuery({ user_id: 35 }, { skip: !userId })

    const { isLoading: isHealthPlanLoading } = useGetHealthPlanQuery({ user_id: Number(userId) }, { skip: !userId })
    // const { isLoading: isHealthPlanLoading } = useGetHealthPlanQuery({ user_id: 18 }, { skip: !userId })


    const isPageLoading = isDashboardLoading || isHealthPlanLoading


    const stressLevel = dashboardData?.data?.stress_level
    console.log(stressLevel)

    if (isPageLoading) {
        return (
            <div className="loader-container">
                <Loader size="default" />
            </div>
        )
    }

    return (
        <>
            {/* Main content */}
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 items-stretch">

                {/* Left column */}
                <div className="lg:col-span-2 flex flex-col gap-6">

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <WorkEnvironmentCard
                            stressLevel={stressLevel}
                            isLoading={isDashboardLoading}
                        />
                        <HealthOverviewCard
                            healthOverview={dashboardData?.data?.health_overview}
                            isLoading={isDashboardLoading}
                        />
                    </div>
                    <div className="flex-1">
                        <HealthProgramCard userId={Number(userId)} />
                    </div>

                </div>

                {/* Right column */}
                <div className="lg:col-span-1 flex flex-col gap-6">
                    <div className="flex-1">
                        <SymptomTrendsCard
                            symptomTrends={dashboardData?.data?.symptom_trends}
                            isLoading={isDashboardLoading}
                        />
                    </div>
                    {/* <IntegratedAppsCard /> */}

                    {/* <div className="max-h-80 overflow-y-auto">
                        <UpcomingEventsCard />
                    </div> */}
                </div>
            </div>


        </>
    )
}