import { router, usePage } from '@inertiajs/react';
import { Languages, Check } from 'lucide-react';
import { Breadcrumbs } from '@/components/breadcrumbs';
import { SidebarTrigger } from '@/components/ui/sidebar';
import { Button } from '@/components/ui/button';
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { cn } from '@/lib/utils';
import type { BreadcrumbItem as BreadcrumbItemType } from '@/types';
import { Separator } from '@radix-ui/react-separator';

// Карта всех доступных языков приложения для легкого масштабирования
const languages = [
    { code: 'lv', label: 'Latviešu' },
    { code: 'en', label: 'English' },
    { code: 'ru', label: 'Русский' }, // Сюда можно легко дописывать новые языки
];

export function AppSidebarHeader({
    breadcrumbs = [],
}: {
    breadcrumbs?: BreadcrumbItemType[];
}) {
    const page = usePage();

    // Получаем текущую локаль из Laravel
    const currentLocale = (page.props.locale as string) || 'lv';

    // Находим объект текущего языка, чтобы отобразить его название/код на кнопке
    const activeLanguage = languages.find((lang) => lang.code === currentLocale) || languages[0];

    // Функция смены языка
    const handleLocaleChange = (newLocale: string) => {
        if (newLocale === currentLocale) return;

        router.get(`/locale/${newLocale}`, {}, {
            preserveScroll: true,
            onSuccess: () => router.reload(),
        });
    };

    return (
        <header className="flex h-16 shrink-0 items-center justify-between gap-2 border-b border-sidebar-border/50 px-6 transition-[width,height] ease-linear group-has-data-[collapsible=icon]/sidebar-wrapper:h-12 md:px-4">
            {/* Левая сторона: Триггер сайдбара и Хлебные крошки */}
            <div className="flex items-center gap-2">
                <SidebarTrigger className="-ml-1" />
                <Breadcrumbs breadcrumbs={breadcrumbs} />
            </div>

            {/* Правая сторона: Скрытый выпадающий список языков */}
            <div className="flex items-center gap-2 mr-1">
                <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                        <Button
                            variant="ghost"
                            size="sm"
                            className="h-9 gap-2 px-3 bg-neutral-100/80 dark:bg-neutral-800/60 border-neutral-200/60 dark:border-neutral-700/50 text-neutral-700 dark:text-neutral-300 hover:bg-neutral-200/70 dark:hover:bg-neutral-800 cursor-pointer transition-colors shadow-none"                        >
                            <Languages className="h-4 w-4 opacity-70" />
                            <div className="h-4 w-[1px] bg-neutral-300 dark:bg-neutral-600 shrink-0" />
                            <span className="text-xs font-semibold uppercase tracking-wider">
                                {activeLanguage.code}
                            </span>
                        </Button>
                    </DropdownMenuTrigger>

                    <DropdownMenuContent align="end" className="w-40">
                        {languages.map((lang) => (
                            <DropdownMenuItem
                                key={lang.code}
                                onClick={() => handleLocaleChange(lang.code)}
                                className={cn(
                                    "flex items-center justify-between font-medium text-sm cursor-pointer py-2 px-3",
                                    lang.code === currentLocale && "text-neutral-900 bg-neutral-50 dark:text-neutral-50 dark:bg-neutral-800"
                                )}
                            >
                                <span>{lang.label}</span>
                                {lang.code === currentLocale && (
                                    <Check className="h-4 w-4 text-neutral-500" />
                                )}
                            </DropdownMenuItem>
                        ))}
                    </DropdownMenuContent>
                </DropdownMenu>
            </div>
        </header>
    );
}