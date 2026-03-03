"use client";

import { Clock, Hourglass, Star } from "lucide-react";
import type { CanChi, HoangDaoHour } from "@/lib/lunar";
import { formatHourRange } from "@/lib/utils";

interface DayInfoCardProps {
    canChi: CanChi;
    hoangDaoHours: HoangDaoHour[];
    isHoangDao: boolean;
}

export function DayInfoCard({ canChi, hoangDaoHours, isHoangDao }: DayInfoCardProps) {
    const luckyHours = hoangDaoHours.filter(h => h.isHoangDao);

    // Compact: "Tý (23h-1h), Sửu (1h-3h), Thìn (7h-9h), Tỵ (9h-11h)..."
    const hoursText = luckyHours
        .map(h => `${h.chi} (${formatHourRange(h.startHour, h.endHour)})`)
        .join(", ");

    return (
        <div className="card-base mx-4 my-3 flex flex-col gap-3">
            {/* Row 1: Badge Hoàng Đạo / Hắc Đạo */}
            <div className="flex items-center gap-2">
                <Star size={15} strokeWidth={1.5}
                    color={isHoangDao ? "var(--color-hoang-dao)" : "var(--color-hac-dao)"} />
                <span
                    className="text-sm font-semibold px-2.5 py-0.5 rounded-full"
                    style={{
                        backgroundColor: isHoangDao ? "#D4EDDA" : "#FDECEA",
                        color: isHoangDao ? "var(--color-hoang-dao)" : "var(--color-hac-dao)",
                        border: `1px solid ${isHoangDao ? "#A3C9A8" : "#F0A9A9"}`,
                    }}
                    role="status"
                >
                    {isHoangDao ? "Ngày Hoàng Đạo (Cát)" : "Ngày Hắc Đạo (Hung)"}
                </span>
            </div>

            {/* Row 2: Can Chi — 1 dòng compact */}
            <div className="flex items-center gap-2">
                <Hourglass size={14} strokeWidth={1.5} color="var(--color-accent)" style={{ flexShrink: 0 }} />
                <span className="text-sm text-ink font-body">
                    <span className="font-semibold">Can Chi:</span>{" "}
                    Ngày {canChi.day}, Tháng {canChi.month}
                </span>
            </div>

            {/* Row 3: Giờ Hoàng Đạo — inline */}
            <div className="flex items-start gap-2">
                <Clock size={14} strokeWidth={1.5} color="var(--color-accent)" style={{ flexShrink: 0, marginTop: 2 }} />
                <span className="text-sm text-ink font-body">
                    <span className="font-semibold">Giờ Hoàng Đạo: </span>
                    <span className="text-muted-vn">{hoursText}</span>
                </span>
            </div>
        </div>
    );
}
