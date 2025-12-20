import { View, Text, StyleSheet, ScrollView } from 'react-native';

export default function SettingsScreen() {
  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Text style={styles.heading}>Cài đặt</Text>
      <Text style={styles.description}>
        Các tuỳ chọn cấu hình sẽ được cập nhật trong phiên bản tiếp theo. Vui lòng quay lại sau để có
        thêm nhiều tính năng tuỳ chỉnh lịch âm.
      </Text>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flexGrow: 1,
    padding: 24,
    backgroundColor: '#fff',
  },
  heading: {
    fontSize: 24,
    fontWeight: '700',
    marginBottom: 12,
    color: '#111827',
  },
  description: {
    fontSize: 16,
    lineHeight: 24,
    color: '#4B5563',
  },
});
