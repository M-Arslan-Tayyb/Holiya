'use client'

import { useState, useEffect } from 'react'
import dynamic from 'next/dynamic'
import {
    Users,
    UserPlus,
    TrendingUp,
    MessageSquare,
    Activity,
    Bot,
    Star,
    LayoutDashboard,
    Calendar
} from 'lucide-react'
import { StatCard } from '@/components/admin/StatCard'
import { COLORS } from '@/lib/theme'
import { Card } from '@/components/ui/card'

// Dynamic import for ApexCharts to avoid SSR issues
const Chart = dynamic(() => import('react-apexcharts'), { ssr: false })

export default function AdminDashboardPage() {
    const [mounted, setMounted] = useState(false)

    useEffect(() => {
        setMounted(true)
    }, [])

    if (!mounted) return null

    // Chart Data & Options
    const agentUsageOptions: any = {
        chart: {
            type: 'pie',
            fontFamily: 'inherit',
        },
        labels: ['Gynecology', 'General Health', 'Mental Wellness', 'Pediatrics'],
        colors: ['#CA925F', '#755134', '#9B6B43', '#DAB18C'],
        legend: {
            position: 'bottom',
            fontSize: '14px',
            labels: {
                colors: '#545454',
            },
        },
        dataLabels: {
            enabled: true,
            dropShadow: { enabled: false },
        },
        tooltip: {
            theme: 'dark'
        },
        title: {
            text: 'Agent Usage Distribution',
            align: 'left',
            style: {
                fontSize: '18px',
                fontWeight: 'bold',
                color: '#755134'
            }
        },
        plotOptions: {
            pie: {
                expandOnClick: true,
                donut: {
                    size: '65%'
                }
            }
        },
        responsive: [{
            breakpoint: 480,
            options: {
                chart: { width: '100%' },
                legend: { position: 'bottom' }
            }
        }]
    }

    const agentUsageSeries = [33, 27, 20, 20]

    const userGrowthOptions: any = {
        chart: {
            type: 'bar',
            toolbar: { show: false },
            zoom: { enabled: false },
            fontFamily: 'inherit',
        },
        dataLabels: { enabled: false },
        colors: ['#CA925F', '#755134'],
        plotOptions: {
            bar: {
                horizontal: false,
                columnWidth: '55%',
                borderRadius: 4,
            },
        },
        xaxis: {
            categories: ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'],
            axisBorder: { show: false },
            axisTicks: { show: false },
            labels: {
                style: { colors: '#545454', fontSize: '12px' }
            }
        },
        yaxis: {
            labels: {
                style: { colors: '#545454', fontSize: '12px' }
            }
        },
        grid: {
            borderColor: '#F7EFE5',
            strokeDashArray: 4,
        },
        tooltip: { theme: 'light' },
        legend: {
            position: 'top',
            horizontalAlign: 'right',
            margin: { bottom: 10 }
        },
        title: {
            text: 'User Growth',
            align: 'left',
            style: {
                fontSize: '18px',
                fontWeight: 'bold',
                color: '#755134'
            }
        }
    }

    const userGrowthSeries = [
        {
            name: 'New Users',
            data: [45, 52, 48, 61, 70, 85, 92, 105, 110, 120, 125, 130]
        },
        {
            name: 'Total Users',
            data: [450, 520, 480, 610, 700, 850, 920, 1050, 1100, 1200, 1250, 1380]
        }
    ]

    return (
        <div className="p-2  space-y-10 max-w-7xl mx-auto">
            {/* Header */}
            <header className="flex flex-col md:flex-row md:items-center justify-between gap-4">
                <div className="space-y-1">
                    <div className="flex items-center gap-3">

                        <h1 className="text-3xl font-bold tracking-tight" style={{ color: COLORS.SECONDARY }}>
                            Admin Dashboard
                        </h1>
                    </div>
                    <p className="text-[#545454] opacity-70 flex items-center gap-2">
                        Monitor your platform performance and KPIs
                    </p>
                </div>

                <div className="flex items-center gap-3 bg-white/50 backdrop-blur-sm p-3 rounded-2xl border border-white/20 text-[#545454] font-medium text-sm">
                    <Calendar className="w-4 h-4 text-[#CA925F]" />
                    {new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })}
                </div>
            </header>

            {/* Sections */}
            <div className="space-y-8">
                {/* User Management */}
                <section className="space-y-4">
                    <h2 className="text-lg font-bold flex items-center gap-2" style={{ color: COLORS.SECONDARY }}>
                        User Management
                    </h2>
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                        <StatCard label="Total Active Users" value="1,250" icon={Users} />
                        <StatCard label="New Users This Week" value="47" icon={UserPlus} />
                        <StatCard label="Registration Growth" value="+12%" icon={TrendingUp} />
                    </div>

                </section>

                <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">
                    {/* Engagement Metrics */}
                    <section className="space-y-4">
                        <h2 className="text-lg font-bold flex items-center gap-2" style={{ color: COLORS.SECONDARY }}>
                            Engagement Metrics
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-1 lg:grid-cols-2 gap-6">
                            <StatCard label="Total Chat Sessions" value="10,500" icon={MessageSquare} />
                            <StatCard label="Engagement Rate" value="45%" icon={Activity} />
                        </div>
                    </section>


                </div>
                <div className="grid grid-cols-1 lg:grid-cols-1 gap-8">

                    <section className="space-y-4">
                        <h2 className="text-lg font-bold flex items-center gap-2" style={{ color: COLORS.SECONDARY }}>
                            Agents & System
                        </h2>
                        <div className="grid grid-cols-1 sm:grid-cols-2 gap-6">
                            <StatCard label="Total Agents" value="6" icon={Bot} />
                            <StatCard label="Top Agent Usage" value="Gynecology" icon={Star} />
                        </div>
                    </section>
                </div>

                {/* Charts */}
                <div className="grid grid-cols-1 gap-8">
                    {/* Agent Usage Distribution - Full Width */}
                    <Card className="p-8 bg-white/70 backdrop-blur-lg border border-white/30 shadow-2xl rounded-3xl overflow-hidden">
                        <div className="flex flex-col md:flex-row items-center gap-10">
                            <div className="w-full md:w-1/2">
                                <Chart
                                    options={agentUsageOptions}
                                    series={agentUsageSeries}
                                    type="pie"
                                    height={400}
                                />
                            </div>
                            <div className="w-full md:w-1/2 space-y-6">
                                <h3 className="text-lg font-bold" style={{ color: COLORS.SECONDARY }}>Top Performing Agents</h3>
                                <div className="space-y-4">
                                    <div className="p-5 rounded-2xl bg-white/50 border border-[#CA925F]/20 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-[#CA925F] flex items-center justify-center text-white font-bold">1</div>
                                            <span className="font-bold text-[#755134]">Gynecology</span>
                                        </div>
                                        <span className="text-[#CA925F] font-bold">33%</span>
                                    </div>
                                    <div className="p-5 rounded-2xl bg-white/50 border border-[#CA925F]/20 flex items-center justify-between">
                                        <div className="flex items-center gap-3">
                                            <div className="w-10 h-10 rounded-full bg-[#755134] flex items-center justify-center text-white font-bold">2</div>
                                            <span className="font-bold text-[#755134]">General Health</span>
                                        </div>
                                        <span className="text-[#755134] font-bold">27%</span>
                                    </div>
                                </div>
                            </div>
                        </div>
                    </Card>

                    {/* User Growth Chart - Full Width */}
                    <Card className="p-8 bg-white/70 backdrop-blur-lg border border-white/30 shadow-2xl rounded-3xl overflow-hidden">
                        <Chart
                            options={userGrowthOptions}
                            series={userGrowthSeries}
                            type="bar"
                            height={350}
                        />
                    </Card>
                </div>
            </div>
        </div>
    )
}
