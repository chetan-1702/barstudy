"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const navigation = [
    { href: "/", label: "Dashboard", icon: "⌂" },
    { href: "/subjects", label: "Subjects", icon: "▤" },
    { href: "/exams", label: "Exams", icon: "□" },
    { href: "/study", label: "Study Planner", icon: "◷" },
    { href: "/tasks", label: "Tasks", icon: "✓" },
    { href: "/resources", label: "Resources", icon: "▱" },
    { href: "/inn", label: "Inn of Court", icon: "⚖" },
];

export default function Sidebar() {
    const pathname = usePathname();

    return (
        <aside className="hidden w-64 flex-col bg-[#171b3a] text-white md:flex">

            <div className="border-b border-white/10 px-6 py-6">
                <Link
                    href="/"
                    className="flex items-center gap-3"
                >
                    <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-white text-lg font-bold text-[#171b3a]">
                        B
                    </div>

                    <div>
                        <h1 className="text-lg font-semibold">
                            BarStudy
                        </h1>

                        <p className="text-xs text-slate-400">
                            Bar Course Hub
                        </p>
                    </div>
                </Link>
            </div>

            <nav className="flex-1 px-4 py-6">

                <p className="mb-3 px-3 text-[10px] font-semibold uppercase tracking-widest text-slate-500">
                    Workspace
                </p>

                <div className="space-y-1">

                    {navigation.map((item) => {
                        const active =
                            item.href === "/"
                                ? pathname === "/"
                                : pathname.startsWith(item.href);

                        return (
                            <Link
                                key={item.href}
                                href={item.href}
                                className={`flex w-full items-center gap-3 rounded-xl px-3 py-2.5 text-sm transition ${active
                                    ? "bg-white/10 text-white"
                                    : "text-slate-400 hover:bg-white/5 hover:text-white"
                                    }`}
                            >
                                <span className="flex w-5 justify-center text-base">
                                    {item.icon}
                                </span>

                                {item.label}
                            </Link>
                        );
                    })}

                </div>
            </nav>

            <div className="border-t border-white/10 p-4">
                <div className="flex items-center gap-3 rounded-xl bg-white/5 p-3">

                    <div className="flex h-9 w-9 items-center justify-center rounded-full bg-indigo-500 text-sm font-semibold">
                        C
                    </div>

                    <div>
                        <p className="text-sm font-medium">
                            Chetan
                        </p>

                        <p className="text-xs text-slate-500">
                            Bar Course Student
                        </p>
                    </div>

                </div>
            </div>

        </aside>
    );
}
