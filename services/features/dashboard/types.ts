export interface StressLevel {
    stress_level: number;
    reason: string;
    has_data: boolean;
    work_env: string;
}

export interface DashboardFullData {
    stress_level: StressLevel;
    health_overview: any;
    symptom_trends: any;
    work_env?: string;


}

export interface TimelineStep {
    week: string;
    title: string;
    status: 'Completed' | 'Upcoming';
}

export interface HealthTask {
    id: number;
    icon: string;
    title: string;
    status: 'Completed' | 'In Progress' | 'Upcoming';
    progress: string | null;
    progressPercentage?: number;
}

export interface HealthPlanData {
    plan_name: string;
    duration: string;
    timeline_steps: TimelineStep[];
    tasks: HealthTask[];
}