import { Link } from '@inertiajs/react';
import {
    LayoutGrid,
    Utensils,
    Calendar,
    ShoppingCart,
    BarChart3,
    HeartPulse,
    FolderGit2,
    BookOpen,
    HelpCircle
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

export function AppSidebar() {
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
                <NavMain items={mainNavItems} />
            </SidebarContent>

            <SidebarFooter>
                <NavFooter items={footerNavItems} className="mt-auto" />
                <NavUser />
            </SidebarFooter>
        </Sidebar>
    );
}
