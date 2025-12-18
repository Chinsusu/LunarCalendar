/**
 * Home Screen - Calendar View
 * @lunar-calendar/mobile
 */

import { useState, useMemo } from 'react';
import {
  View,
  Text,
  Pressable,
  ScrollView,
  StyleSheet,
  useWindowDimensions,
  Platform,
} from 'react-native';
import { Link } from 'expo-router';
import {
  getMonthCalendar,
  getTodayInfo,
  getDayInfo,
  DayInfo,
  VIETNAM_LOCATIONS,
} from '@lunar-calendar/core';
import { Container, Card, Badge, Button, DayCell } from '@lunar-calendar/ui';
import { useKeyboardShortcuts } from '../hooks/useKeyboardShortcuts';

const WEEKDAYS = ['CN', 'T2', 'T3', 'T4', 'T5', 'T6', 'T7'];
const MONTHS_VN = [
  'Tháng 1',
  'Tháng 2',
  'Tháng 3',
  'Tháng 4',
  'Tháng 5',
  'Tháng 6',
  'Tháng 7',
  'Tháng 8',
  'Tháng 9',
  'Tháng 10',
  'Tháng 11',
  'Tháng 12',
];

export default function HomeScreen() {
  const { width } = useWindowDimensions();
  const today = new Date();

  const [currentYear, setCurrentYear] = useState(today.getFullYear());
  const [currentMonth, setCurrentMonth] = useState(today.getMonth() + 1);
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  // Check if desktop
  const isDesktop = width > 1024;
  const isTablet = width > 768 && width <= 1024;

  // Get calendar data
  const calendarData = useMemo(() => {
    return getMonthCalendar(currentYear, currentMonth, VIETNAM_LOCATIONS.hanoi);
  }, [currentYear, currentMonth]);

  // Get today's info for header
  const todayInfo = useMemo(() => getTodayInfo(), []);

  // Get selected day info for desktop sidebar
  const selectedDayInfo = useMemo(() => {
    if (!selectedDate) return null;
    const [year, month, day] = selectedDate.split('-').map(Number);
    return getDayInfo({ year, month, day }, VIETNAM_LOCATIONS.hanoi);
  }, [selectedDate]);

  // Calculate first day of month offset
  const firstDayOffset = useMemo(() => {
    return new Date(currentYear, currentMonth - 1, 1).getDay();
  }, [currentYear, currentMonth]);

  // Navigation
  const goToPrevMonth = () => {
    if (currentMonth === 1) {
      setCurrentMonth(12);
      setCurrentYear(currentYear - 1);
    } else {
      setCurrentMonth(currentMonth - 1);
    }
  };

  const goToNextMonth = () => {
    if (currentMonth === 12) {
      setCurrentMonth(1);
      setCurrentYear(currentYear + 1);
    } else {
      setCurrentMonth(currentMonth + 1);
    }
  };

  const goToToday = () => {
    setCurrentYear(today.getFullYear());
    setCurrentMonth(today.getMonth() + 1);
  };

  // Setup keyboard shortcuts for web
  useKeyboardShortcuts({
    onPrevMonth: goToPrevMonth,
    onNextMonth: goToNextMonth,
    onToday: goToToday,
    onEscape: () => setSelectedDate(null),
  });

  const cellWidth = isDesktop ? 80 : (width - 32) / 7;

  const isToday = (day: DayInfo) => {
    return (
      day.solar.year === today.getFullYear() &&
      day.solar.month === today.getMonth() + 1 &&
      day.solar.day === today.getDate()
    );
  };

  const handleDayPress = (day: DayInfo) => {
    const dateStr = `${day.solar.year}-${day.solar.month}-${day.solar.day}`;
    if (isDesktop) {
      // On desktop, show in sidebar
      setSelectedDate(dateStr);
    }
    // On mobile/tablet, will navigate via Link
  };

  return (
    <View className="flex-1 bg-gray-50">
      {/* Today Summary Header */}
      <View className="bg-primary p-4">
        <Container maxWidth="calendar">
          <Text className="text-white text-2xl font-bold text-center">
            {todayInfo.lunar.day} tháng {todayInfo.lunar.monthName}
          </Text>
          <Text className="text-red-100 text-sm text-center mt-1">
            Ngày {todayInfo.canChiDay.fullName} • {todayInfo.canChiYear.fullName}
          </Text>
          <View className="flex-row justify-center mt-2 gap-2">
            <Badge variant={todayInfo.isHoangDaoDay ? 'good' : 'bad'} size="sm">
              {todayInfo.isHoangDaoDay ? 'Hoàng Đạo' : 'Hắc Đạo'}
            </Badge>
            <Badge variant="neutral" size="sm">
              {todayInfo.truc.name}
            </Badge>
          </View>
          {todayInfo.sunTimes && (
            <Text className="text-red-100 text-xs text-center mt-2">
              🌅 {todayInfo.sunTimes.sunrise} • 🌇 {todayInfo.sunTimes.sunset}
            </Text>
          )}
        </Container>
      </View>

      {/* Main Content - Desktop 2 columns, Mobile single column */}
      <View className={isDesktop ? 'flex-row flex-1' : 'flex-1'}>
        {/* Calendar Section */}
        <View className={isDesktop ? 'flex-1 w-3/5' : 'flex-1'}>
          <ScrollView>
            <Container maxWidth="calendar">
              {/* Month Navigation */}
              <View className="flex-row justify-between items-center py-4 border-b border-gray-200">
                <Pressable
                  onPress={goToPrevMonth}
                  className={`p-2 ${Platform.OS === 'web' ? 'hover:bg-gray-100 cursor-pointer' : ''} rounded-lg`}
                >
                  <Text className="text-2xl text-primary">‹</Text>
                </Pressable>

                <Pressable onPress={goToToday}>
                  <Text className="text-lg font-semibold text-gray-900">
                    {MONTHS_VN[currentMonth - 1]} {currentYear}
                  </Text>
                </Pressable>

                <Pressable
                  onPress={goToNextMonth}
                  className={`p-2 ${Platform.OS === 'web' ? 'hover:bg-gray-100 cursor-pointer' : ''} rounded-lg`}
                >
                  <Text className="text-2xl text-primary">›</Text>
                </Pressable>
              </View>

              {/* Weekday Headers */}
              <View className="flex-row py-2 border-b border-gray-200">
                {WEEKDAYS.map((day, index) => (
                  <View
                    key={day}
                    style={{ width: cellWidth }}
                    className="items-center"
                  >
                    <Text
                      className={`text-xs font-semibold ${
                        index === 0 ? 'text-primary' : 'text-gray-600'
                      }`}
                    >
                      {day}
                    </Text>
                  </View>
                ))}
              </View>

              {/* Calendar Grid */}
              <View className="flex-row flex-wrap py-2">
                {/* Empty cells for offset */}
                {Array.from({ length: firstDayOffset }).map((_, i) => (
                  <View
                    key={`empty-${i}`}
                    style={{ width: cellWidth }}
                    className="aspect-square"
                  />
                ))}

                {/* Day cells */}
                {calendarData.map((day) => {
                  const dayOfWeek = new Date(
                    day.solar.year,
                    day.solar.month - 1,
                    day.solar.day
                  ).getDay();
                  const dateStr = `${day.solar.year}-${day.solar.month}-${day.solar.day}`;

                  const DayCellComponent = (
                    <DayCell
                      solarDay={day.solar.day}
                      lunarDay={day.lunar.day}
                      lunarMonth={day.lunar.month}
                      isToday={isToday(day)}
                      isHoangDao={day.isHoangDaoDay}
                      isSunday={dayOfWeek === 0}
                      isFirstLunarDay={day.lunar.day === 1}
                      style={{ width: cellWidth }}
                      onPress={() => handleDayPress(day)}
                    />
                  );

                  if (isDesktop) {
                    // Desktop: Just pressable, shows in sidebar
                    return (
                      <View key={dateStr} style={{ width: cellWidth }}>
                        {DayCellComponent}
                      </View>
                    );
                  } else {
                    // Mobile/Tablet: Navigate to detail page
                    return (
                      <Link
                        key={dateStr}
                        href={`/day/${dateStr}`}
                        asChild
                      >
                        <View style={{ width: cellWidth }}>
                          {DayCellComponent}
                        </View>
                      </Link>
                    );
                  }
                })}
              </View>

              {/* Legend */}
              <View className="flex-row justify-center py-4 gap-6">
                <View className="flex-row items-center gap-2">
                  <View className="w-3 h-3 rounded-full bg-hoang-dao" />
                  <Text className="text-xs text-gray-600">Ngày hoàng đạo</Text>
                </View>
                <View className="flex-row items-center gap-2">
                  <View className="w-3 h-3 rounded-full bg-primary" />
                  <Text className="text-xs text-gray-600">Hôm nay</Text>
                </View>
              </View>
            </Container>
          </ScrollView>
        </View>

        {/* Sidebar - Desktop only */}
        {isDesktop && (
          <View className="w-2/5 border-l border-gray-200 bg-white">
            <ScrollView>
              {selectedDayInfo ? (
                <View className="p-4">
                  <DaySidebar dayInfo={selectedDayInfo} />
                </View>
              ) : (
                <View className="p-4 items-center justify-center" style={{ minHeight: 200 }}>
                  <Text className="text-gray-400 text-center">
                    Chọn một ngày để xem chi tiết
                  </Text>
                </View>
              )}
            </ScrollView>
          </View>
        )}
      </View>
    </View>
  );
}

// Sidebar component for desktop
function DaySidebar({ dayInfo }: { dayInfo: any }) {
  return (
    <View>
      {/* Header */}
      <View className="mb-4">
        <Text className="text-2xl font-bold text-gray-900">
          {dayInfo.solar.day}/{dayInfo.solar.month}/{dayInfo.solar.year}
        </Text>
        <Text className="text-base text-gray-600 mt-1">
          {dayInfo.lunar.day} tháng {dayInfo.lunar.monthName}{' '}
          {dayInfo.lunar.isLeapMonth ? '(Nhuận)' : ''}
        </Text>
      </View>

      {/* Can Chi */}
      <Card padding="md" className="mb-4">
        <Text className="text-sm font-semibold text-gray-700 mb-2">Can Chi</Text>
        <View className="flex-row justify-between">
          <View className="items-center flex-1">
            <Text className="text-xs text-gray-500">Năm</Text>
            <Text className="text-sm font-semibold text-gray-900 mt-1">
              {dayInfo.canChiYear.fullName}
            </Text>
          </View>
          <View className="items-center flex-1">
            <Text className="text-xs text-gray-500">Tháng</Text>
            <Text className="text-sm font-semibold text-gray-900 mt-1">
              {dayInfo.canChiMonth.fullName}
            </Text>
          </View>
          <View className="items-center flex-1">
            <Text className="text-xs text-gray-500">Ngày</Text>
            <Text className="text-sm font-semibold text-gray-900 mt-1">
              {dayInfo.canChiDay.fullName}
            </Text>
          </View>
        </View>
      </Card>

      {/* Day Quality */}
      <Card padding="md" className="mb-4">
        <View className="flex-row gap-2 mb-2">
          <Badge variant={dayInfo.isHoangDaoDay ? 'good' : 'bad'} size="sm">
            {dayInfo.isHoangDaoDay ? '✓ Hoàng Đạo' : '✗ Hắc Đạo'}
          </Badge>
          <Badge variant="neutral" size="sm">
            Trực: {dayInfo.truc.name}
          </Badge>
        </View>

        {dayInfo.truc.goodFor.length > 0 && (
          <View className="mt-2">
            <Text className="text-xs font-semibold text-green-600">✓ Nên làm:</Text>
            <Text className="text-xs text-gray-700 mt-1">
              {dayInfo.truc.goodFor.join(', ')}
            </Text>
          </View>
        )}

        {dayInfo.truc.badFor.length > 0 && (
          <View className="mt-2">
            <Text className="text-xs font-semibold text-red-600">✗ Kiêng:</Text>
            <Text className="text-xs text-gray-700 mt-1">
              {dayInfo.truc.badFor.join(', ')}
            </Text>
          </View>
        )}
      </Card>

      {/* Sun Times */}
      {dayInfo.sunTimes && (
        <Card padding="md">
          <Text className="text-sm font-semibold text-gray-700 mb-3">Giờ Mặt Trời</Text>
          <View className="flex-row justify-around">
            <View className="items-center">
              <Text className="text-2xl">🌅</Text>
              <Text className="text-xs text-gray-500 mt-1">Bình minh</Text>
              <Text className="text-sm font-semibold text-gray-900 mt-1">
                {dayInfo.sunTimes.sunrise}
              </Text>
            </View>
            <View className="items-center">
              <Text className="text-2xl">☀️</Text>
              <Text className="text-xs text-gray-500 mt-1">Giữa trưa</Text>
              <Text className="text-sm font-semibold text-gray-900 mt-1">
                {dayInfo.sunTimes.solarNoon}
              </Text>
            </View>
            <View className="items-center">
              <Text className="text-2xl">🌇</Text>
              <Text className="text-xs text-gray-500 mt-1">Hoàng hôn</Text>
              <Text className="text-sm font-semibold text-gray-900 mt-1">
                {dayInfo.sunTimes.sunset}
              </Text>
            </View>
          </View>
        </Card>
      )}

      {/* View Full Details Link */}
      <Link
        href={`/day/${dayInfo.solar.year}-${dayInfo.solar.month}-${dayInfo.solar.day}`}
        asChild
      >
        <Pressable className="mt-4 p-3 bg-primary rounded-lg items-center">
          <Text className="text-white font-semibold">Xem chi tiết đầy đủ</Text>
        </Pressable>
      </Link>
    </View>
  );
}

const styles = StyleSheet.create({
  // Keeping minimal styles for compatibility
});
