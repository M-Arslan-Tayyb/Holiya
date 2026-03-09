import {
    Home,
    Heart,
    Calendar,
    Activity,
    Clock,
    Pill,
    BookOpen,
    Settings,
    MessageCircle,
    LayoutDashboard,
    Users,
} from 'lucide-react'

export interface MenuItem {
    id: string
    label: string
    icon: React.ComponentType<{ className?: string }>
    href: string
    roles?: number[] // Roles allowed to see this item. If undefined, everyone can see it.
}

export const SIDEBAR_MENU: MenuItem[] = [
    {
        id: 'home',
        label: 'Home',
        icon: Home,
        href: '/dashboard',
    },
    {
        id: 'admin-dashboard',
        label: 'Admin Dashboard',
        icon: LayoutDashboard,
        href: '/admin-dashboard',
        roles: [1],
    },
    {
        id: 'user-listing',
        label: 'Users',
        icon: Users,
        href: '/user-listing',
        roles: [1],
    },
    {
        id: 'ai-health-companion',
        label: 'AI Health Companion',
        icon: MessageCircle,
        href: '/chat',
    },
]
