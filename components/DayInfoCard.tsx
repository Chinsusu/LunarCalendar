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
    const hoursText = luckyHours
        .map(h => `${h.chi} (${formatHourRange(h.startHour, h.endHour)})`)
        .join(", ");

    const badgeBg = isHoangDao ? "#D4EDDA" : "#FDECEA";
    const badgeColor = isHoangDao ? "#2D6A2D" : "#8B1A1A";
    const badgeBorder = isHoangDao ? "#A3C9A8" : "#F0A9A9";

    return (
        <div className="card-base mx-4 my-3 flex flex-col gap-3">

            {/* Row 1: Badge — Font B · SemiBold · 15px · badge color */}
            <div className="flex items-center gap-2">
                <Star size={14} strokeWidth={1.5} color={badgeColor} />
                <span
                    className="px-2.5 py-0.5 rounded-full"
                    style={{
                        fontFamily: "var(--font-body)", fontWeight: 600, fontSize: 15,
                        color: badgeColor, backgroundColor: badgeBg,
                        border: `1px solid ${badgeBorder}`,
                    }}
                    role="status"
                >
                    {isHoangDao ? "Ngày Hoàng Đạo (Cát)" : "Ngày Hắc Đạo (Hung)"}
                </span>
            </div>

            {/* Row 2: Can Chi — Font B · SemiBold · 15px · ink */}
            <div className="flex items-center gap-2">
                <Hourglass size={14} strokeWidth={1.5} color="var(--color-accent)" style={{ flexShrink: 0 }} />
                <span style={{ fontFamily: "var(--font-body)", fontWeight: 600, fontSize: 15, color: "var(--color-ink)" }}>
                    Can Chi:{" "}
                    <span style={{ fontWeight: 400, color: "var(--color-muted)", fontSize: 13 }}>
                        {canChi.day}, {canChi.month}
                    </span>
                </span>
            </div>

            {/* Row 3: Giờ Hoàng Đạo — Font C · Regular · 13px · muted */}
            <div className="flex items-start gap-2">
                <Clock size={14} strokeWidth={1.5} color="var(--color-accent)" style={{ flexShrink: 0, marginTop: 1 }} />
                <span style={{ fontFamily: "var(--font-body)", fontWeight: 600, fontSize: 15, color: "var(--color-ink)" }}>
                    Giờ Hoàng Đạo:{" "}
                    <span style={{ fontWeight: 400, fontSize: 13, color: "var(--color-muted)" }}>
                        {hoursText}
                    </span>
                </span>
            </div>
        </div>
    );
}
