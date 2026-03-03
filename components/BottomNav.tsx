"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Calendar, Grid3x3, Star } from "lucide-react";

const NAV_ITEMS = [
    { href: "/", label: "Lịch Ngày", Icon: Calendar },
    { href: "/thang", label: "Lịch Tháng", Icon: Grid3x3 },
    { href: "/su-kien", label: "Sự Kiện", Icon: Star },
];

export function BottomNav() {
    const pathname = usePathname();

    return (
        <nav
            className="fixed bottom-0 left-1/2 -translate-x-1/2 w-full max-w-[480px] bg-card-vn border-t border-vn"
            style={{ boxShadow: "0 -2px 12px rgba(44,24,16,0.08)" }}
            aria-label="Điều hướng chính"
        >
            <ul className="flex items-stretch h-16">
                {NAV_ITEMS.map(({ href, label, Icon }) => {
                    const active = pathname === href;
                    return (
                        <li key={href} className="flex-1">
                            <Link
                                href={href}
                                className="flex flex-col items-center justify-center h-full gap-0.5 cursor-pointer transition-colors"
                                style={{ color: active ? "var(--color-primary)" : "var(--color-muted)" }}
                                aria-label={label}
                                aria-current={active ? "page" : undefined}
                            >
                                <Icon
                                    size={20}
                                    strokeWidth={active ? 2 : 1.5}
                                    style={{ transition: "color 150ms ease" }}
                                />
                                <span
                                    className="text-[11px] font-body"
                                    style={{ fontWeight: active ? 600 : 400 }}
                                >
                                    {label}
                                </span>
                                {active && (
                                    <span
                                        className="absolute bottom-0 w-8 h-0.5 rounded-t"
                                        style={{ background: "var(--color-primary)" }}
                                    />
                                )}
                            </Link>
                        </li>
                    );
                })}
            </ul>
        </nav>
    );
}
