import { Head, Link } from '@inertiajs/react';
import {
    Utensils,
    Calendar,
    ShoppingCart,
    BarChart3,
    HeartPulse,
    HelpCircle,
    ArrowUpRight
} from 'lucide-react';
import { dashboard } from '@/routes';

export default function Dashboard() {
    return (
        <>
            <Head title="Dashboard" />

            <div className="flex h-auto flex-col gap-4 overflow-x-auto rounded-xl p-4">

                <div className="auto-rows-min gap-4 md:grid-cols-3 hidden sm:grid">

                    {/* Receptes */}
                    <Link href="/recipes" className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-sidebar-border/70 p-5 bg-white dark:bg-neutral-950 hover:shadow-sm hover:border-neutral-300 dark:hover:border-neutral-800 transition duration-200">
                        <div>
                            <div className="flex items-center justify-between mb-3">
                                <div className="p-2.5 rounded-lg bg-indigo-50 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400">
                                    <Utensils className="size-5" />
                                </div>
                                <ArrowUpRight className="size-4 text-neutral-300 group-hover:text-neutral-500 transition-colors" />
                            </div>
                            <h2 className="text-lg font-bold text-neutral-900 dark:text-white mb-1">Receptes</h2>
                            <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                                Pārlūkojiet drošu un veselīgu ēdienu receptes, kas atlasītas jūsu organismam.
                            </p>
                        </div>
                    </Link>

                    {/* Plānotājs */}
                    <Link href="/planner" className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-sidebar-border/70 p-5 bg-white dark:bg-neutral-950 hover:shadow-sm hover:border-neutral-300 dark:hover:border-neutral-800 transition duration-200">
                        <div>
                            <div className="flex items-center justify-between mb-3">
                                <div className="p-2.5 rounded-lg bg-amber-50 dark:bg-amber-950/40 text-amber-600 dark:text-amber-400">
                                    <Calendar className="size-5" />
                                </div>
                                <ArrowUpRight className="size-4 text-neutral-300 group-hover:text-neutral-500 transition-colors" />
                            </div>
                            <h2 className="text-lg font-bold text-neutral-900 dark:text-white mb-1">Ēdienkartes plānotājs</h2>
                            <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                                Izveidojiet savu nedēļas uztura plānu, balstoties uz fitnesa mērķiem.
                            </p>
                        </div>
                    </Link>


                    {/* Iepirkumu saraksts (Перенесен наверх) */}
                    <Link href="/shopping-list" className="group relative flex flex-col justify-between overflow-hidden rounded-xl border border-sidebar-border/70 p-5 bg-white dark:bg-neutral-950 hover:shadow-sm hover:border-neutral-300 dark:hover:border-neutral-800 transition duration-200">
                        <div>
                            <div className="flex items-center justify-between mb-3">
                                <div className="p-2.5 rounded-lg bg-emerald-50 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400">
                                    <ShoppingCart className="size-5" />
                                </div>
                                <ArrowUpRight className="size-4 text-neutral-300 group-hover:text-neutral-500 transition-colors" />
                            </div>
                            <h2 className="text-lg font-bold text-neutral-900 dark:text-white mb-1">Iepirkumu saraksts</h2>
                            <p className="text-xs text-neutral-500 dark:text-neutral-400 leading-relaxed">
                                Automātiski apkopots produktu saraksts no izvēlētajām receptēm.
                            </p>
                        </div>
                    </Link>

                </div>

                {/* APAKŠĒJAIS BLOKS: Kompakts papildu rīku saraksts */}
                {/* НИЖНИЙ БЛОК: Компактный список дополнительных инструментов */}
                <div className="relative overflow-hidden rounded-xl border border-sidebar-border/70 p-6 bg-white dark:bg-neutral-950">
                    <h3 className="text-base font-bold text-neutral-900 dark:text-white mb-4">Papildu rīki</h3>

                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        {/* Veselības profils (Перенесен вниз) */}
                        <Link href="/health-profile" className="group p-4 border border-neutral-100 dark:border-neutral-900/60 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-900/40 transition">
                            <div className="flex items-center gap-3 mb-2">
                                <HeartPulse className="size-5 text-rose-600" />
                                <h4 className="font-semibold text-sm text-neutral-800 dark:text-neutral-200">Veselības profils</h4>
                            </div>
                            <p className="text-xs text-neutral-400">Pārvaldiet savas alerģijas, nepanesamības un fiziskos parametrus.</p>
                        </Link>

                        {/* Statistika // Статистика */}
                        <Link href="/statistics" className="group p-4 border border-neutral-100 dark:border-neutral-900/60 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-900/40 transition">
                            <div className="flex items-center gap-3 mb-2">
                                <BarChart3 className="size-5 text-blue-600" />
                                <h4 className="font-semibold text-sm text-neutral-800 dark:text-neutral-200">Uztura statistika</h4>
                            </div>
                            <p className="text-xs text-neutral-400">Analītika, KBŽU kopsavilkumi un fitnesa mērķu progresa grafiki.</p>
                        </Link>

                        {/* Rokasgrāmata // Руководство */}
                        <Link href="/guide" className="group p-4 border border-neutral-100 dark:border-neutral-900/60 rounded-lg hover:bg-neutral-50 dark:hover:bg-neutral-900/40 transition">
                            <div className="flex items-center gap-3 mb-2">
                                <HelpCircle className="size-5 text-violet-600" />
                                <h4 className="font-semibold text-sm text-neutral-800 dark:text-neutral-200">Kā tas strādā?</h4>
                            </div>
                            <p className="text-xs text-neutral-400">Lietošanas instrukcija un svarīgākie viedā uztura pamatnosacījumi.</p>
                        </Link>
                    </div>
                </div>

            </div>
        </>
    );
}

Dashboard.layout = {
    breadcrumbs: [
        {
            title: 'Dashboard',
            href: dashboard(),
        },
    ],
};
