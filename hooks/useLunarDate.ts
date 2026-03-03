"use client";

import { useMemo } from "react";
import { solarToLunar, getCanChi, getHoangDao } from "@/lib/lunar";
import type { LunarDate, CanChi, HoangDaoHour } from "@/lib/lunar";

export interface TodayInfo {
    solar: Date;
    lunar: LunarDate;
    canChi: CanChi;
    hoangDaoHours: HoangDaoHour[];
    isHoangDao: boolean;
}

export function useLunarDate(date: Date): {
    lunar: LunarDate;
    canChi: CanChi;
    hoangDaoHours: HoangDaoHour[];
    isHoangDao: boolean;
} {
    const d = date.getDate();
    const m = date.getMonth() + 1;
    const y = date.getFullYear();
    const h = date.getHours();

    const lunar = useMemo(() => solarToLunar(d, m, y), [d, m, y]);
    const canChi = useMemo(() => getCanChi(d, m, y, h), [d, m, y, h]);
    const hoangDaoHours = useMemo(
        () => getHoangDao(lunar.day, lunar.month, lunar.year),
        [lunar.day, lunar.month, lunar.year]
    );
    const currentChiIdx = Math.floor((h + 1) / 2) % 12;
    const isHoangDao = hoangDaoHours[currentChiIdx]?.isHoangDao ?? false;

    return { lunar, canChi, hoangDaoHours, isHoangDao };
}
