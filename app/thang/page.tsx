import type { Metadata } from "next";

export const metadata: Metadata = {
    title: "Lịch Tháng — Lịch Âm Việt",
    description: "Xem lịch âm dương lịch tháng, ngày Hoàng Đạo, Rằm và Mùng 1",
};

export default function LichThangPage() {
    return (
        <div className="px-4 pt-4">
            <h1 className="font-display font-bold text-xl text-primary mb-4">Lịch Tháng</h1>
            <div
                className="rounded-xl p-6 text-center text-muted-vn"
                style={{
                    background: "var(--color-card)",
                    border: "1px solid var(--color-border)",
                }}
            >
                <p className="text-sm">🚧 Đang phát triển — Sprint 1.5</p>
                <p className="text-xs mt-1">MonthCalendar component sẽ có ở đây</p>
            </div>
        </div>
    );
}
