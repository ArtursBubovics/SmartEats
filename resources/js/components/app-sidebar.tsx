import { Link, usePage } from '@inertiajs/react';
import {
    LayoutGrid,
    Utensils,
    Calendar,
    ShoppingCart,
    BarChart3,
    HeartPulse,
    FolderGit2,
    BookOpen,
    HelpCircle,
    ShieldAlert,
    FolderKanban,
    Users,
    Settings2
} from 'lucide-react';
import AppLogo from '@/components/app-logo';
import { NavFooter } from '@/components/nav-footer';
import { NavMain } from '@/components/nav-main';
import { NavUser } from '@/components/nav-user';
import {
    Sidebar,
    SidebarContent,
    SidebarFooter,
    SidebarHeader,
    SidebarMenu,
    SidebarMenuButton,
    SidebarMenuItem,
} from '@/components/ui/sidebar';
import { dashboard } from '@/routes';
import type { NavItem } from '@/types';

const mainNavItems: NavItem[] = [
    {
        title: 'Dashboard',
        href: dashboard(),
        icon: LayoutGrid,
    },
    {
        title: 'Recipes',
        href: '/recipes',
        icon: Utensils,
    },
    {
        title: 'Meal Planner',
        href: '/planner',
        icon: Calendar,
    },
    {
        title: 'Shopping List',
        href: '/shopping-list',
        icon: ShoppingCart,
    }
];

const footerNavItems: NavItem[] = [
    {
        title: 'Statistics',
        href: '/statistics',
        icon: BarChart3,
    },
    {
        title: 'Health Profile',
        href: '/health-profile',
        icon: HeartPulse,
    },
    {
        title: 'Guide',
        href: '/guide',
        icon: HelpCircle,
    },
];

// ==========================================
// 2. НАВИГАЦИЯ ТОЛЬКО ДЛЯ АДМИНИСТРАТОРА (ADMIN)
// ==========================================
const adminMainNavItems: NavItem[] = [
    {
        title: 'Admin Dashboard',
        href: '/admin',
        icon: ShieldAlert,
    },
    {
        title: 'Manage Recipes',
        href: '/admin/recipes',
        icon: FolderKanban,
    },
    {
        title: 'Manage Users',
        href: '/admin/users',
        icon: Users,
    }
];

const adminFooterNavItems: NavItem[] = [
    {
        title: 'System Settings',
        href: '/admin/settings',
        icon: Settings2,
    },
    {
        title: 'User View',
        href: dashboard(), // Кнопка, чтобы админ мог легко вернуться в обычный личный кабинет
        icon: LayoutGrid,
    },
];


export function AppSidebar() {
    const { auth } = usePage().props as any;

    const isAdmin = auth.user?.is_admin === true;
    
    const currentMainItems = isAdmin ? adminMainNavItems : mainNavItems;
    const currentFooterItems = isAdmin ? adminFooterNavItems : footerNavItems;

    return (
        <Sidebar collapsible="icon" variant="inset">
            <SidebarHeader>
                <SidebarMenu>
                    <SidebarMenuItem>
                        <SidebarMenuButton size="lg" asChild>
                            <Link href={dashboard()} prefetch>
                                <AppLogo />
                            </Link>
                        </SidebarMenuButton>
                    </SidebarMenuItem>
                </SidebarMenu>
            </SidebarHeader>

            <SidebarContent>
                <NavMain items={currentMainItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={currentFooterItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
