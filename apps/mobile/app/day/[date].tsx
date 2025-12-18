/**
 * Day Detail Screen
 * @lunar-calendar/mobile
 */

import { useMemo } from 'react';
import { View, Text, ScrollView, useWindowDimensions, Platform } from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import {
  getDayInfo,
  VIETNAM_LOCATIONS,
  formatHourRange,
} from '@lunar-calendar/core';
import { Container, Card, Badge, HourCard } from '@lunar-calendar/ui';

export default function DayDetailScreen() {
  const { date } = useLocalSearchParams<{ date: string }>();
  const { width } = useWindowDimensions();

  const isDesktop = width > 1024;
  const isTablet = width > 768 && width <= 1024;

  const dayInfo = useMemo(() => {
    if (!date) return null;

    const [year, month, day] = date.split('-').map(Number);
    return getDayInfo({ year, month, day }, VIETNAM_LOCATIONS.hanoi);
  }, [date]);

  if (!dayInfo) {
    return (
      <View className="flex-1 items-center justify-center bg-gray-50">
        <Text className="text-gray-600">Không tìm thấy thông tin ngày</Text>
      </View>
    );
  }

  const hoangDaoHours = dayInfo.hours.filter((h) => h.type === 'hoangdao');
  const hacDaoHours = dayInfo.hours.filter((h) => h.type === 'hacdao');

  return (
    <ScrollView className="flex-1 bg-gray-50">
      {/* Header */}
      <View className="bg-primary p-5">
        <Container maxWidth="detail">
          <Text className="text-white text-3xl font-bold text-center">
            {dayInfo.solar.day}/{dayInfo.solar.month}/{dayInfo.solar.year}
          </Text>
          <Text className="text-red-100 text-lg text-center mt-1">
            {dayInfo.lunar.day} tháng {dayInfo.lunar.monthName}{' '}
            {dayInfo.lunar.isLeapMonth ? '(Nhuận)' : ''}
          </Text>
          <Text className="text-red-100 text-sm text-center mt-1">
            Năm {dayInfo.canChiYear.fullName}
          </Text>
        </Container>
      </View>

      <Container maxWidth="detail" className="py-4">
        {/* Can Chi & Day Quality - Desktop 2 columns */}
        <View className={isDesktop ? 'md:flex-row md:gap-4' : ''}>
          {/* Can Chi Section */}
          <Card padding="md" className={`mb-4 ${isDesktop ? 'md:flex-1' : ''}`}>
            <Text className="text-base font-semibold text-gray-900 mb-3">Can Chi</Text>
            <View className="flex-row justify-between">
              <View className="items-center flex-1">
                <Text className="text-xs text-gray-500">Năm</Text>
                <Text className="text-base font-semibold text-gray-900 mt-1">
                  {dayInfo.canChiYear.fullName}
                </Text>
                <Text className="text-xs text-primary mt-1">
                  {dayInfo.canChiYear.napAm || dayInfo.canChiYear.element}
                </Text>
              </View>
              <View className="items-center flex-1">
                <Text className="text-xs text-gray-500">Tháng</Text>
                <Text className="text-base font-semibold text-gray-900 mt-1">
                  {dayInfo.canChiMonth.fullName}
                </Text>
              </View>
              <View className="items-center flex-1">
                <Text className="text-xs text-gray-500">Ngày</Text>
                <Text className="text-base font-semibold text-gray-900 mt-1">
                  {dayInfo.canChiDay.fullName}
                </Text>
              </View>
            </View>
          </Card>

          {/* Day Quality Section */}
          <Card padding="md" className={`mb-4 ${isDesktop ? 'md:flex-1' : ''}`}>
            <Text className="text-base font-semibold text-gray-900 mb-3">Thông tin ngày</Text>
            <View className="flex-row gap-2 mb-3">
              <Badge variant={dayInfo.isHoangDaoDay ? 'good' : 'bad'} size="md">
                {dayInfo.isHoangDaoDay ? '✓ Hoàng Đạo' : '✗ Hắc Đạo'}
              </Badge>
              <Badge variant="neutral" size="md">
                Trực: {dayInfo.truc.name}
              </Badge>
            </View>

            {dayInfo.truc.goodFor.length > 0 && (
              <View className="mt-2">
                <Text className="text-sm font-semibold text-green-600 mb-1">✓ Nên làm:</Text>
                <Text className="text-sm text-gray-700 leading-5">
                  {dayInfo.truc.goodFor.join(', ')}
                </Text>
              </View>
            )}

            {dayInfo.truc.badFor.length > 0 && (
              <View className="mt-2">
                <Text className="text-sm font-semibold text-red-600 mb-1">✗ Kiêng:</Text>
                <Text className="text-sm text-gray-700 leading-5">
                  {dayInfo.truc.badFor.join(', ')}
                </Text>
              </View>
            )}
          </Card>
        </View>

        {/* Solar Term */}
        {dayInfo.solarTerm && (
          <Card padding="md" className="mb-4">
            <Text className="text-base font-semibold text-gray-900 mb-2">Tiết Khí</Text>
            <Text className="text-xl font-semibold text-primary mb-1">
              {dayInfo.solarTerm.name}
            </Text>
            <Text className="text-sm text-gray-600 leading-5">
              {dayInfo.solarTerm.description}
            </Text>
          </Card>
        )}

        {/* Sun Times */}
        {dayInfo.sunTimes && (
          <Card padding="md" className="mb-4">
            <Text className="text-base font-semibold text-gray-900 mb-4">Giờ Mặt Trời</Text>
            <View className="flex-row justify-around">
              <View className="items-center">
                <Text className="text-3xl">🌅</Text>
                <Text className="text-xs text-gray-500 mt-2">Bình minh</Text>
                <Text className="text-lg font-semibold text-gray-900 mt-1">
                  {dayInfo.sunTimes.sunrise}
                </Text>
              </View>
              <View className="items-center">
                <Text className="text-3xl">☀️</Text>
                <Text className="text-xs text-gray-500 mt-2">Giữa trưa</Text>
                <Text className="text-lg font-semibold text-gray-900 mt-1">
                  {dayInfo.sunTimes.solarNoon}
                </Text>
              </View>
              <View className="items-center">
                <Text className="text-3xl">🌇</Text>
                <Text className="text-xs text-gray-500 mt-2">Hoàng hôn</Text>
                <Text className="text-lg font-semibold text-gray-900 mt-1">
                  {dayInfo.sunTimes.sunset}
                </Text>
              </View>
            </View>
          </Card>
        )}

        {/* Good Hours Section */}
        <Card padding="md" className="mb-4">
          <Text className="text-base font-semibold text-gray-900 mb-3">
            Giờ Hoàng Đạo (6 giờ tốt)
          </Text>
          <View
            className={`flex-row flex-wrap ${
              isDesktop ? 'gap-3' : isTablet ? 'gap-2' : 'gap-2'
            }`}
          >
            {hoangDaoHours.map((hour) => (
              <View
                key={hour.chi}
                style={{
                  width: isDesktop
                    ? 'calc(16.666% - 10px)'
                    : isTablet
                    ? 'calc(25% - 6px)'
                    : 'calc(33.333% - 6px)',
                }}
              >
                <HourCard
                  chi={hour.chiName}
                  timeRange={formatHourRange(hour)}
                  starName={hour.starName}
                  canChi={hour.canChi.fullName}
                  isGood={true}
                />
              </View>
            ))}
          </View>
        </Card>

        {/* Bad Hours Section */}
        <Card padding="md" className="mb-4">
          <Text className="text-base font-semibold text-gray-900 mb-3">
            Giờ Hắc Đạo (6 giờ xấu)
          </Text>
          <View
            className={`flex-row flex-wrap ${
              isDesktop ? 'gap-3' : isTablet ? 'gap-2' : 'gap-2'
            }`}
          >
            {hacDaoHours.map((hour) => (
              <View
                key={hour.chi}
                style={{
                  width: isDesktop
                    ? 'calc(16.666% - 10px)'
                    : isTablet
                    ? 'calc(25% - 6px)'
                    : 'calc(33.333% - 6px)',
                }}
              >
                <HourCard
                  chi={hour.chiName}
                  timeRange={formatHourRange(hour)}
                  starName={hour.starName}
                  canChi={hour.canChi.fullName}
                  isGood={false}
                />
              </View>
            ))}
          </View>
        </Card>

        {/* Spacer */}
        <View style={{ height: 40 }} />
      </Container>
    </ScrollView>
  );
}
