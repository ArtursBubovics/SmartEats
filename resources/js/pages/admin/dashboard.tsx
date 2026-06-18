import { Head, usePage, Link } from '@inertiajs/react';
import { AppSidebarHeader } from '@/components/app-sidebar-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { ShieldAlert, Users, Utensils, PlusCircle, ArrowUpRight, LayoutGrid } from 'lucide-react';
import { Description } from '@radix-ui/react-dialog';
import { dashboard } from '@/routes';

interface AdminDashboardProps {
    auth: {
        user: {
            name: string;
            email: string;
        };
    };
    stats: {
        total_recipes: number;
        total_users: number;
        system_errors_count?: number; // На будущее для логов ошибок
    };
}

export default function AdminDashboard() {
    const { auth, stats } = usePage<any>().props as AdminDashboardProps;

    const breadcrumbs = [
        { title: 'Admin', href: '/admin' },
        { title: 'Dashboard', href: '#', current: true },
    ];

    return (
        <>
            <Head title="Admin Dashboard" />

            <div className="flex flex-1 flex-col gap-6 p-6 md:p-4">
                {/* Сетка основных показателей (Только самое важное) */}
                <div className="grid gap-4 md:grid-cols-3">
                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Всего рецептов</CardTitle>
                            <Utensils className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">{stats?.total_recipes ?? 0}</div>
                            <p className="text-xs text-muted-foreground mt-1">Доступно пользователям в базе данных</p>
                        </CardContent>
                    </Card>

                    <Card>
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium">Пользователи</CardTitle>
                            <Users className="h-4 w-4 text-muted-foreground" />
                        </CardHeader>
                        <CardContent>
                            <div className="text-3xl font-bold">{stats?.total_users ?? 0}</div>
                            <p className="text-xs text-muted-foreground mt-1">Зарегистрированных аккаунтов</p>
                        </CardContent>
                    </Card>

                    {/* Карточка ошибок — оставили, так как это важный системный показатель */}
                    <Card className="border-emerald-200/60 dark:border-emerald-900/30 bg-emerald-50/10 dark:bg-emerald-950/5 flex flex-col justify-between">
                        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                            <CardTitle className="text-sm font-medium text-emerald-800 dark:text-emerald-400">User View</CardTitle>
                            <LayoutGrid className="h-4 w-4 text-emerald-600 dark:text-emerald-400" />
                        </CardHeader>
                        <CardContent className="flex flex-col flex-1 justify-between gap-2">
                            <p className="text-xs text-muted-foreground">
                                Вернуться в обычный личный кабинет пользователя.
                            </p>
                            <Button asChild variant="link" className="text-emerald-700 dark:text-emerald-400 h-auto p-0 justify-start font-semibold text-xs gap-1 mt-1">
                                <Link href={dashboard()}>
                                    Перейти на Dashboard
                                    <ArrowUpRight className="h-3 w-3" />
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>
                </div>

                {/* Основная рабочая зона админа */}
                <div className="grid gap-4 md:grid-cols-2">

                    <Card className="flex flex-col justify-between border-neutral-200/80 dark:border-neutral-800 shadow-sm">
                        <CardHeader>
                            <div className="flex items-center gap-2 mb-1">
                                <Utensils className="h-5 w-5 text-neutral-500" />
                                <CardTitle className="text-xl font-semibold tracking-tight">Manage Recipes</CardTitle>
                            </div>
                            <CardDescription>
                                Просмотр всей базы рецептов, добавление новых позиций, настройка БЖУ макросов и локализации контента.
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex flex-col sm:flex-row gap-3 pt-2">
                            <Button asChild variant="outline" className="w-full sm:w-auto gap-2">
                                <Link href="/admin/recipes">
                                    Перейти
                                    <ArrowUpRight className="h-4 w-4" />
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>

                    {/* Блок Manage Users */}
                    <Card className="flex flex-col justify-between border-neutral-200/80 dark:border-neutral-800 shadow-sm">
                        <CardHeader>
                            <div className="flex items-center gap-2 mb-1">
                                <Users className="h-5 w-5 text-neutral-500" />
                                <CardTitle className="text-xl font-semibold tracking-tight">Manage Users</CardTitle>
                            </div>
                            <CardDescription>
                                Контроль учетных записей, просмотр активности пользователей, а также изменение системных ролей (user / admin).
                            </CardDescription>
                        </CardHeader>
                        <CardContent className="flex gap-3 pt-2">
                            <Button asChild variant="outline" className="w-full sm:w-auto gap-2">
                                <Link href="/admin/users">
                                    Перейти
                                    <ArrowUpRight className="h-4 w-4" />
                                </Link>
                            </Button>
                        </CardContent>
                    </Card>

                </div>
            </div>
        </>
    );
}

AdminDashboard.layout = (page: React.ReactNode) => page;