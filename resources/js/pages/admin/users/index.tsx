import { Head, usePage, router, Link } from '@inertiajs/react';
import { AppSidebarHeader } from '@/components/app-sidebar-header';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ShieldCheck, User, ArrowLeft, Ban, Trash2 } from 'lucide-react';
import { Checkbox } from '@/components/ui/checkbox';

interface UserItem {
    id: number;
    name: string;
    email: string;
    role: string;
    is_blocked: boolean;
    created_at: string;
}

interface ManageUsersProps {
    users: UserItem[];
    auth: {
        user: {
            id: number;
        };
    };
}

export default function ManageUsers() {
    // Вытаскиваем массив пользователей из пропсов Inertia
    const { users, auth } = usePage<any>().props as ManageUsersProps;
    const currentUserId = auth?.user?.id;

    function toggleRole(user: UserItem): void {
        const newRole = user.role === 'admin' ? 'user' : 'admin';

        router.patch(`/admin/users/${user.id}/role`, {
            role: newRole
        }, {
            preserveScroll: true, // Страница не прыгнет вверх после обновления данных
        });
    }

    function toggleBlock(user: UserItem): void {
        router.patch(`/admin/users/${user.id}/toggle-block`, {}, {
            preserveScroll: true,
        });
    }

    function deleteUser(user: UserItem): void {
        if (confirm(`Вы уверены, что хотите удалить пользователя ${user.name}?`)) {
            router.delete(`/admin/users/${user.id}`, {
                preserveScroll: true,
            });
        }
    }
    return (
        <>
            <Head title="Manage Users" />

            <div className="flex flex-1 flex-col gap-6 p-6 md:p-4">
                {/* Заголовок и кнопка назад */}
                <div className="flex items-center justify-between">
                    <div className="flex flex-col gap-1">
                        <h1 className="text-2xl font-bold tracking-tight text-neutral-900 dark:text-neutral-50">
                            Manage Users
                        </h1>
                        <p className="text-muted-foreground text-sm">
                            Просмотр списка зарегистрированных аккаунтов и управление системными привилегиями.
                        </p>
                    </div>
                    <Button asChild variant="outline" size="sm" className="gap-2">
                        <Link href="/admin">
                            <ArrowLeft className="h-4 w-4" />
                            Back to Dashboard
                        </Link>
                    </Button>
                </div>

                {/* Таблица пользователей внутри карточки */}
                <Card className="border-neutral-200/80 dark:border-neutral-800 shadow-sm">
                    <CardHeader className="pb-3">
                        <CardTitle className="text-lg font-semibold">User Database ({users?.length ?? 0})</CardTitle>
                        <CardDescription>Активные учетные записи платформы SmartEats.</CardDescription>
                    </CardHeader>
                    <CardContent className="p-0 sm:p-6 sm:pt-0">
                        <div className="overflow-x-auto">
                            <table className="w-full text-sm text-left text-neutral-500 dark:text-neutral-400">
                                <thead className="text-xs text-neutral-700 dark:text-neutral-300 uppercase bg-neutral-50 dark:bg-neutral-900 border-b border-neutral-200 dark:border-neutral-800">
                                    <tr>
                                        <th className="px-6 py-3 font-semibold">User info</th>
                                        <th className="px-6 py-3 font-semibold">Registered</th>
                                        <th className="px-6 py-3 font-semibold">System Role</th>
                                        <th className="px-6 py-3 font-semibold text-center w-24">Banned</th>
                                        <th className="px-6 py-3 font-semibold text-right">Actions</th>
                                    </tr>
                                </thead>
                                <tbody className="divide-y divide-neutral-200 dark:divide-neutral-800">
                                    {users && users.length > 0 ? (
                                        users.map((user) => {
                                            const isMe = user.id === currentUserId; // Проверка: является ли строка текущим админом

                                            return (
                                                <tr key={user.id} className="bg-white dark:bg-neutral-900 hover:bg-neutral-50 dark:hover:bg-neutral-800 transition-colors">

                                                    {/* 1. Колонка USER INFO */}
                                                    <td className="px-6 py-4">
                                                        <div className="flex flex-col">
                                                            <span className="font-medium text-neutral-900 dark:text-neutral-50 flex items-center gap-1.5">
                                                                {user.name}
                                                                {isMe && (
                                                                    <Badge variant="secondary" className="text-[10px] px-1.5 py-0 bg-blue-50 text-blue-600 dark:bg-blue-950/50 dark:text-blue-400 border-none font-normal">
                                                                        Это вы
                                                                    </Badge>
                                                                )}
                                                            </span>
                                                            <span className="text-xs text-neutral-400 dark:text-neutral-500">
                                                                {user.email}
                                                            </span>
                                                        </div>
                                                    </td>

                                                    {/* 2. Колонка REGISTERED */}
                                                    <td className="px-6 py-4 text-sm text-neutral-600 dark:text-neutral-400">
                                                        {user.created_at}
                                                    </td>

                                                    {/* 3. Колонка SYSTEM ROLE */}
                                                    <td className="px-6 py-4">
                                                        <div className="flex items-center gap-2">
                                                            {user.role === 'admin' ? (
                                                                <Badge className="bg-amber-50 text-amber-700 border-amber-200/60 dark:bg-amber-950/40 dark:text-amber-400 dark:border-amber-900/30 gap-1" variant="outline">
                                                                    <ShieldCheck className="h-3 w-3" /> Admin
                                                                </Badge>
                                                            ) : (
                                                                <Badge className="bg-neutral-50 text-neutral-600 border-neutral-200 dark:bg-neutral-900 dark:text-neutral-400 dark:border-neutral-800 gap-1" variant="outline">
                                                                    <User className="h-3 w-3" /> User
                                                                </Badge>
                                                            )}

                                                            {user.is_blocked && (
                                                                <Badge className="bg-red-50 text-red-700 border-red-200 dark:bg-red-950/40 dark:text-red-400 dark:border-red-900/30 gap-1 font-bold animate-pulse" variant="outline">
                                                                    <Ban className="h-3 w-3" /> Banned
                                                                </Badge>
                                                            )}
                                                        </div>
                                                    </td>

                                                    {/* ЧЕКБОКС БАНА */}
                                                    <td className="px-6 py-4 text-center">
                                                        <div className="flex justify-center items-center">
                                                            <Checkbox
                                                                checked={user.is_blocked}
                                                                disabled={isMe} // 👈 Себя забанить нельзя
                                                                onCheckedChange={() => toggleBlock(user)}
                                                                className="border-neutral-300 data-[state=checked]:bg-red-600 data-[state=checked]:border-red-600 h-4 w-4 transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                                                            />
                                                        </div>
                                                    </td>

                                                    {/* 4. Колонка ACTIONS (Смена роли + Кнопка удаления) */}
                                                    <td className="px-6 py-4 text-right">
                                                        <div className="flex items-center justify-end gap-2">
                                                            {/* Кнопка смены роли */}
                                                            <Button
                                                                variant="ghost"
                                                                size="sm"
                                                                disabled={isMe} // 👈 Себе роль менять нельзя
                                                                onClick={() => toggleRole(user)}
                                                                className={`text-xs disabled:opacity-30 disabled:hover:bg-transparent ${user.role === 'admin' ? 'font-medium text-red-600 hover:bg-red-50 dark:hover:bg-red-950/20' : 'font-medium text-amber-600 hover:bg-amber-50 dark:hover:bg-amber-950/20'}`}
                                                            >
                                                                {user.role === 'admin' ? 'Demote to User' : 'Make Admin'}
                                                            </Button>

                                                            {/* Кнопка удаления пользователя */}
                                                            <Button
                                                                variant="ghost"
                                                                size="icon"
                                                                disabled={isMe} // 👈 Себя удалить нельзя
                                                                onClick={() => deleteUser(user)}
                                                                className="h-8 w-8 text-neutral-400 hover:text-red-600 hover:bg-red-50 dark:text-neutral-500 dark:hover:text-red-400 dark:hover:bg-red-950/20 transition-colors disabled:opacity-30 disabled:hover:bg-transparent disabled:hover:text-neutral-400"
                                                                title={isMe ? "Вы не можете удалить свой собственный аккаунт" : "Удалить пользователя"}
                                                            >
                                                                <Trash2 className="h-4 w-4" />
                                                            </Button>
                                                        </div>
                                                    </td>

                                                </tr>
                                            );
                                        })
                                    ) : (
                                        <tr>
                                            <td colSpan={5} className="px-6 py-10 text-center text-neutral-500">
                                                Пользователи не найдены.
                                            </td>
                                        </tr>
                                    )}
                                </tbody>
                            </table>
                        </div>
                    </CardContent>
                </Card>
            </div>
        </>
    );
}

// Указываем дефолтный лейаут для Inertia в самом конце файла
ManageUsers.layout = (page: React.ReactNode) => page;

function patch(arg0: string, arg1: {}, arg2: { preserveScroll: boolean; }) {
    throw new Error('Function not implemented.');
}
