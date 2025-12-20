/**
 * Home Screen (Classic "Vạn Niên" UI)
 * @lunar-calendar/mobile
 */

import { useEffect, useMemo, useState } from 'react';
import { Pressable, ScrollView, Text, TextInput, View, useWindowDimensions, Platform } from 'react-native';
import { Link, router } from 'expo-router';
import { formatHourRange, getDayInfo, VIETNAM_LOCATIONS } from '@lunar-calendar/core';
import { Container } from '@lunar-calendar/ui';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';

type SolarDate = { year: number; month: number; day: number };

function pad2(value: number) {
  return String(value).padStart(2, '0');
}

function toYmd(solar: SolarDate) {
  return `${solar.year}-${pad2(solar.month)}-${pad2(solar.day)}`;
}

function fromDate(date: Date): SolarDate {
  return { year: date.getFullYear(), month: date.getMonth() + 1, day: date.getDate() };
}

function toDate(solar: SolarDate) {
  return new Date(solar.year, solar.month - 1, solar.day);
}

function addDays(solar: SolarDate, deltaDays: number): SolarDate {
  const next = toDate(solar);
  next.setDate(next.getDate() + deltaDays);
  return fromDate(next);
}

function addMonths(year: number, month: number, deltaMonths: number) {
  const base = new Date(year, month - 1, 1);
  base.setMonth(base.getMonth() + deltaMonths);
  return { year: base.getFullYear(), month: base.getMonth() + 1 };
}

function clampDay(year: number, month: number, desiredDay: number) {
  const daysInMonth = new Date(year, month, 0).getDate();
  return Math.min(desiredDay, daysInMonth);
}

const weekLabels = ['Thứ hai', 'Thứ ba', 'Thứ tư', 'Thứ năm', 'Thứ sáu', 'Thứ bảy', 'Chủ nhật'];

export default function HomeScreen() {
  const { width } = useWindowDimensions();
  const isNarrow = width < 768;

  const today = useMemo(() => fromDate(new Date()), []);
  const [selected, setSelected] = useState<SolarDate>(today);
  const [monthYear, setMonthYear] = useState(() => ({ year: today.year, month: today.month }));
  const [jumpMonth, setJumpMonth] = useState(pad2(today.month));
  const [jumpYear, setJumpYear] = useState(String(today.year));

  useEffect(() => {
    setJumpMonth(pad2(monthYear.month));
    setJumpYear(String(monthYear.year));
  }, [monthYear.month, monthYear.year]);

  const selectedInfo = useMemo(
    () => getDayInfo(selected, VIETNAM_LOCATIONS.hanoi),
    [selected.day, selected.month, selected.year]
  );

  const monthGrid = useMemo(() => {
    const firstOfMonth = new Date(monthYear.year, monthYear.month - 1, 1);
    // JS: Sunday=0 ... Saturday=6. We want Monday=0 ... Sunday=6.
    const mondayFirstOffset = (firstOfMonth.getDay() + 6) % 7;
    const gridStart = new Date(monthYear.year, monthYear.month - 1, 1 - mondayFirstOffset);

    const cells: Array<{ solar: SolarDate; inMonth: boolean; info: ReturnType<typeof getDayInfo> }> = [];
    for (let i = 0; i < 42; i++) {
      const d = new Date(gridStart);
      d.setDate(gridStart.getDate() + i);
      const solar = fromDate(d);
      const inMonth = solar.year === monthYear.year && solar.month === monthYear.month;
      cells.push({
        solar,
        inMonth,
        info: getDayInfo(solar, VIETNAM_LOCATIONS.hanoi),
      });
    }

    return cells;
  }, [monthYear.month, monthYear.year]);

  const goPrevDay = () => {
    const next = addDays(selected, -1);
    setSelected(next);
    setMonthYear({ year: next.year, month: next.month });
  };

  const goNextDay = () => {
    const next = addDays(selected, 1);
    setSelected(next);
    setMonthYear({ year: next.year, month: next.month });
  };

  const goPrevMonth = () => {
    const next = addMonths(monthYear.year, monthYear.month, -1);
    setMonthYear(next);
    setSelected((prev) => ({ ...prev, year: next.year, month: next.month, day: clampDay(next.year, next.month, prev.day) }));
  };

  const goNextMonth = () => {
    const next = addMonths(monthYear.year, monthYear.month, 1);
    setMonthYear(next);
    setSelected((prev) => ({ ...prev, year: next.year, month: next.month, day: clampDay(next.year, next.month, prev.day) }));
  };

  const goToday = () => {
    setSelected(today);
    setMonthYear({ year: today.year, month: today.month });
  };

  const onJump = () => {
    const m = Number(jumpMonth);
    const y = Number(jumpYear);
    if (!Number.isFinite(m) || !Number.isFinite(y) || m < 1 || m > 12 || y < 1900 || y > 2100) {
      return;
    }
    setMonthYear({ year: y, month: m });
    setSelected((prev) => ({ ...prev, year: y, month: m, day: clampDay(y, m, prev.day) }));
  };

  useKeyboardShortcuts({
    onPrevMonth: goPrevMonth,
    onNextMonth: goNextMonth,
    onToday: goToday,
  });

  const hoangDaoText = selectedInfo.isHoangDaoDay ? 'Ngày hoàng đạo' : 'Ngày hắc đạo';
  const menhNgay = selectedInfo.canChiDay.napAm || selectedInfo.canChiDay.element;
  const gioHoangDao = selectedInfo.hours
    .filter((h) => h.type === 'hoangdao')
    .map((h) => `${h.chiName} (${formatHourRange(h)})`)
    .join(', ');

  const selectedYmd = toYmd(selected);

  return (
    <ScrollView className="flex-1 bg-gray-100">
      {/* Top Bar */}
      <View className="bg-primary">
        <Container className="px-4 py-3 flex-row items-center justify-between">
          <Text className="text-white font-bold text-lg">LỊCH VẠN NIÊN</Text>

          <Link href={`/day/${selectedYmd}`} asChild>
            <Pressable className="bg-green-700 px-3 py-2 rounded flex-row items-center">
              <Text className="text-white font-semibold">Xem nhanh theo ngày</Text>
            </Pressable>
          </Link>
        </Container>
      </View>

      <Container className="px-4 py-4">
        {/* Day Summary */}
        <View className="bg-white border border-gray-200 rounded">
          <View className="flex-row items-stretch">
            <Pressable
              onPress={goPrevDay}
              className="w-14 items-center justify-center border-r border-gray-200"
              accessibilityLabel="Ngày trước"
            >
              <Text className="text-2xl text-primary">‹</Text>
            </Pressable>

            <View className={`flex-1 ${isNarrow ? 'py-4' : 'py-5'} px-4`}>
              <View className={isNarrow ? 'flex-col gap-4' : 'flex-row'}>
                {/* Solar */}
                <View className={`flex-1 ${isNarrow ? '' : 'pr-4 border-r border-gray-200'} items-center`}>
                  <Text className="text-gray-800 font-semibold">Dương Lịch</Text>
                  <Text className="text-primary font-extrabold text-6xl leading-[72px] mt-2">
                    {selectedInfo.solar.day}
                  </Text>
                  <Text className="text-gray-700 mt-1">
                    Tháng {selectedInfo.solar.month} năm {selectedInfo.solar.year}
                  </Text>
                </View>

                {/* Lunar */}
                <View className={`flex-1 ${isNarrow ? '' : 'pl-4'} items-center`}>
                  <Text className="text-gray-800 font-semibold">Âm lịch</Text>
                  <Text className="text-gray-900 font-extrabold text-6xl leading-[72px] mt-2">
                    {selectedInfo.lunar.day}
                  </Text>
                  <Text className="text-gray-700 mt-1">
                    Tháng {selectedInfo.lunar.month} năm {selectedInfo.canChiYear.fullName}
                    {selectedInfo.lunar.isLeapMonth ? ' (Nhuận)' : ''}
                  </Text>
                  {selectedInfo.lunar.day === 1 && (
                    <Text className="text-red-600 font-semibold mt-1">Ngày mồng 1</Text>
                  )}
                </View>
              </View>

              <View className="border-t border-gray-200 mt-4 pt-4">
                <Text className="text-gray-900">
                  <Text className="font-semibold">Mệnh ngày:</Text> {menhNgay} - {hoangDaoText}
                </Text>
                <Text className="text-gray-900 mt-2">
                  <Text className="font-semibold">Giờ hoàng đạo:</Text> {gioHoangDao}
                </Text>
              </View>
            </View>

            <Pressable
              onPress={goNextDay}
              className="w-14 items-center justify-center border-l border-gray-200"
              accessibilityLabel="Ngày sau"
            >
              <Text className="text-2xl text-primary">›</Text>
            </Pressable>
          </View>
        </View>

        {/* Month Header */}
        <View className="mt-4 bg-primary rounded overflow-hidden">
          <View className="px-3 py-2 flex-row items-center justify-between">
            <Pressable onPress={goPrevMonth} className="w-10 items-center justify-center" accessibilityLabel="Tháng trước">
              <Text className="text-white text-xl">‹</Text>
            </Pressable>

            <Text className="text-white font-bold">
              THÁNG {pad2(monthYear.month)} - {monthYear.year}
            </Text>

            <View className="flex-row items-center gap-2">
              <View className="flex-row items-center gap-2">
                <TextInput
                  value={jumpMonth}
                  onChangeText={setJumpMonth}
                  inputMode="numeric"
                  className="bg-white px-2 py-1 rounded w-14 text-center"
                  placeholder="MM"
                />
                <TextInput
                  value={jumpYear}
                  onChangeText={setJumpYear}
                  inputMode="numeric"
                  className="bg-white px-2 py-1 rounded w-20 text-center"
                  placeholder="YYYY"
                />
              </View>
              <Pressable onPress={onJump} className="bg-green-700 px-3 py-1 rounded" accessibilityLabel="Xem">
                <Text className="text-white font-bold">XEM</Text>
              </Pressable>
              <Pressable onPress={goNextMonth} className="w-10 items-center justify-center" accessibilityLabel="Tháng sau">
                <Text className="text-white text-xl">›</Text>
              </Pressable>
            </View>
          </View>
        </View>

        {/* Calendar Table */}
        <View className="bg-white border border-gray-200 rounded-b overflow-hidden">
          {/* Week header */}
          <View className="flex-row">
            {weekLabels.map((label, index) => {
              const isSunday = index === 6;
              return (
                <View key={label} className="flex-1 border-r border-gray-200 px-2 py-2">
                  <Text className={`text-center text-xs font-semibold ${isSunday ? 'text-red-600' : 'text-gray-700'}`}>
                    {label}
                  </Text>
                </View>
              );
            })}
          </View>

          {/* 6 rows */}
          {Array.from({ length: 6 }).map((_, rowIndex) => {
            const row = monthGrid.slice(rowIndex * 7, rowIndex * 7 + 7);
            return (
              <View key={rowIndex} className="flex-row">
                {row.map((cell, colIndex) => {
                  const isSunday = colIndex === 6;
                  const isToday = cell.solar.year === today.year && cell.solar.month === today.month && cell.solar.day === today.day;
                  const isSelected = cell.solar.year === selected.year && cell.solar.month === selected.month && cell.solar.day === selected.day;
                  const showLunarMonth = cell.info.lunar.day === 1;
                  const solarText = pad2(cell.solar.day);

                  const baseText = cell.inMonth ? 'text-gray-900' : 'text-gray-400';
                  const solarColor = isSunday ? (cell.inMonth ? 'text-red-600' : 'text-red-300') : baseText;

                  const bg =
                    isSelected
                      ? 'bg-orange-100'
                      : isToday
                      ? 'bg-yellow-100'
                      : '';

                  return (
                    <Pressable
                      key={`${cell.solar.year}-${cell.solar.month}-${cell.solar.day}`}
                      onPress={() => {
                        setSelected(cell.solar);
                        if (!cell.inMonth) {
                          setMonthYear({ year: cell.solar.year, month: cell.solar.month });
                        }
                        if (isNarrow && Platform.OS !== 'web') {
                          router.push(`/day/${toYmd(cell.solar)}`);
                        }
                      }}
                      onLongPress={() => {
                        if (Platform.OS === 'web') {
                          router.push(`/day/${toYmd(cell.solar)}`);
                        }
                      }}
                      className={`flex-1 border-t border-r border-gray-200 p-2 min-h-[80px] ${bg}`}
                      accessibilityLabel={`Ngày ${cell.solar.day}/${cell.solar.month}/${cell.solar.year}`}
                    >
                      <View className="flex-row items-start justify-between">
                        <Text className={`text-lg font-bold ${solarColor}`}>{solarText}</Text>
                        <Text className={`text-xs ${cell.inMonth ? 'text-gray-600' : 'text-gray-400'}`}>
                          {showLunarMonth ? `${cell.info.lunar.day}/${cell.info.lunar.month}` : cell.info.lunar.day}
                        </Text>
                      </View>

                      <View className="flex-1 justify-end">
                        {cell.info.lunar.day === 1 && (
                          <Text className={`text-[11px] ${cell.inMonth ? 'text-red-600' : 'text-red-300'}`}>
                            Ngày mồng 1
                          </Text>
                        )}

                        <View className="flex-row items-center justify-between mt-1">
                          <Text className={`text-[11px] ${cell.inMonth ? 'text-gray-500' : 'text-gray-400'}`}>
                            {cell.info.canChiDay.fullName}
                          </Text>
                          <View
                            className={`w-2 h-2 rounded-full ${
                              cell.info.isHoangDaoDay ? 'bg-green-600' : 'bg-gray-300'
                            }`}
                          />
                        </View>
                      </View>
                    </Pressable>
                  );
                })}
              </View>
            );
          })}
        </View>

        {/* Legend */}
        <View className="flex-row items-center gap-4 mt-3">
          <View className="flex-row items-center gap-2">
            <View className="w-2 h-2 rounded-full bg-green-600" />
            <Text className="text-gray-700 text-sm">Ngày hoàng đạo</Text>
          </View>
          <View className="flex-row items-center gap-2">
            <View className="w-2 h-2 rounded-full bg-gray-300" />
            <Text className="text-gray-700 text-sm">Ngày hắc đạo</Text>
          </View>
          <Pressable onPress={goToday} className="ml-auto bg-white border border-gray-200 px-3 py-2 rounded">
            <Text className="text-gray-900 font-semibold">Hôm nay</Text>
          </Pressable>
        </View>
      </Container>
    </ScrollView>
  );
}
