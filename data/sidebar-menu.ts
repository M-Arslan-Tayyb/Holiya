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
} from 'lucide-react'

export interface MenuItem {
    id: string
    label: string
    icon: React.ComponentType<{ className?: string }>
    href: string
}

export const SIDEBAR_MENU: MenuItem[] = [
    {
        id: 'home',
        label: 'Home',
        icon: Home,
        href: '/dashboard',
    },
    {
        id: 'ai-health-companion',
        label: 'AI Health Companion',
        icon: MessageCircle,
        href: '/chat',
    },


]
