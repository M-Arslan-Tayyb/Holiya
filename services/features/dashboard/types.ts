export interface StressLevel {
    stress_level: number;
    reason: string;
    has_data: boolean;
}

export interface DashboardFullData {
    stress_level: StressLevel;
    health_overview: any;
    symptom_trends: any;
}