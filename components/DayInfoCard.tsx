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
    const luckyHours = hoangDaoHours.filter(h => h.isHoangDao).slice(0, 4);

    return (
        <div className="card-base mx-4 my-3 flex flex-col gap-4">
            {/* Row 1: Hoàng Đạo / Hắc Đạo */}
            <div className="flex items-center gap-2">
                <Star size={16} strokeWidth={1.5} color={isHoangDao ? "var(--color-hoang-dao)" : "var(--color-hac-dao)"} />
                <span
                    className={`text-sm font-semibold px-3 py-1 rounded`}
                    style={{
                        backgroundColor: isHoangDao ? "#D4EDDA" : "#FDECEA",
                        color: isHoangDao ? "var(--color-hoang-dao)" : "var(--color-hac-dao)",
                        border: `1px solid ${isHoangDao ? "#A3C9A8" : "#F0A9A9"}`,
                    }}
                    role="status"
                    aria-label={isHoangDao ? "Ngày Hoàng Đạo" : "Ngày Hắc Đạo"}
                >
                    {isHoangDao ? "Hoàng Đạo" : "Hắc Đạo"}
                </span>
            </div>

            {/* Row 2: Can Chi ngày + tháng */}
            <div className="flex items-start gap-3">
                <Hourglass size={16} strokeWidth={1.5} color="var(--color-accent)" style={{ marginTop: 2, flexShrink: 0 }} />
                <div className="flex flex-col gap-0.5">
                    <span className="text-sm font-semibold text-ink">Can Chi ngày — {canChi.day}</span>
                    <span className="text-sm text-muted-vn">Tháng {canChi.month}</span>
                    <span className="text-sm text-muted-vn">Năm {canChi.year}</span>
                </div>
            </div>

            {/* Row 3: Giờ Hoàng Đạo */}
            <div className="flex items-start gap-3">
                <Clock size={16} strokeWidth={1.5} color="var(--color-accent)" style={{ marginTop: 2, flexShrink: 0 }} />
                <div className="flex flex-col gap-1">
                    <span className="text-sm font-semibold text-ink">Giờ Hoàng Đạo</span>
                    <div className="flex flex-wrap gap-1.5">
                        {luckyHours.map(h => (
                            <span
                                key={h.chi}
                                className="text-xs px-2 py-0.5 rounded"
                                style={{
                                    backgroundColor: "#FDF8EC",
                                    color: "var(--color-secondary)",
                                    border: "1px solid var(--color-border)",
                                    fontFamily: "var(--font-body)",
                                }}
                                title={formatHourRange(h.startHour, h.endHour)}
                            >
                                Giờ {h.chi} ({formatHourRange(h.startHour, h.endHour)})
                            </span>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
}
