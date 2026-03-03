import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Sự Kiện — Lịch Âm Việt",
    description: "Quản lý sự kiện âm lịch, giỗ kị, lễ Phật và ghi chú cá nhân",
};

export default function SuKienPage() {
    return (
        <div className="px-4 pt-4">
            <h1 className="font-display font-bold text-xl text-primary mb-4">Sự Kiện</h1>
            <div
                className="rounded-xl p-6 text-center text-muted-vn"
                style={{
                    background: "var(--color-card)",
                    border: "1px solid var(--color-border)",
                }}
            >
                <p className="text-sm">🚧 Đang phát triển — Sprint 1.5</p>
                <p className="text-xs mt-1">EventForm + IndexedDB sẽ có ở đây</p>
            </div>
        </div>
    );
}
