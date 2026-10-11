import Ionicons from '@expo/vector-icons/Ionicons';
import { router } from 'expo-router';
import type { Href } from 'expo-router';
import { useState } from 'react';
import { ActivityIndicator, Alert, Pressable, ScrollView, StyleSheet, Text, View } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';

import { TopNotificationBar } from '@/components/TopNotificationBar';
import { useAppTheme } from '@/context/ThemeContext';
import { useTrip } from '@/context/TripContext';
import type { TravelOption } from '@/types/models';
import { colors } from '@/utils/theme';

export default function BookingsScreen() {
  const { colors } = useAppTheme();
  const { bookingByTravelOptionId, deleteBooking, isLoading, isSaving, travelOptions } = useTrip();
  const [deletingOptionId, setDeletingOptionId] = useState<string | null>(null);
  const bookedOptions = travelOptions.filter((option) => bookingByTravelOptionId[option.id]);

  function goBack() {
    if (router.canGoBack()) {
      router.back();
      return;
    }

    router.replace('/');
  }

  return (
    <SafeAreaView style={[styles.safeArea, { backgroundColor: colors.surface }]} edges={['top', 'bottom']}>
      <View style={[styles.page, { backgroundColor: colors.surface }]}>
        <TopNotificationBar message="Your saved festival bookings" />
        <ScrollView contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
          <Pressable
            accessibilityRole="button"
            accessibilityLabel="Go back"
            onPress={goBack}
            hitSlop={8}
            style={({ pressed }) => [styles.backButton, pressed && styles.pressed]}
          >
            <Ionicons name="chevron-back" size={17} color={colors.textMuted} />
            <Text style={[styles.backText, { color: colors.textMuted }]}>Back</Text>
          </Pressable>

          <View style={styles.titleRow}>
            <View style={[styles.basketIcon, { backgroundColor: colors.primarySoft }]}>
              <Ionicons name="bag-handle-outline" size={25} color={colors.primary} />
            </View>
            <View style={styles.flex}>
              <Text style={[styles.title, { color: colors.text }]}>My bookings</Text>
              <Text style={[styles.subtitle, { color: colors.textMuted }]}>
                {bookedOptions.length} saved booking{bookedOptions.length === 1 ? '' : 's'}
              </Text>
            </View>
          </View>

          {isLoading ? (
            <View style={styles.loadingState}>
              <ActivityIndicator color={colors.primary} />
              <Text style={[styles.statusText, { color: colors.textMuted }]}>Loading your bookings...</Text>
            </View>
          ) : bookedOptions.length === 0 ? (
            <View style={[styles.emptyCard, { borderColor: colors.border, backgroundColor: colors.surfaceMuted }]}>
              <Ionicons name="ticket-outline" size={30} color={colors.textMuted} />
              <Text style={[styles.emptyTitle, { color: colors.text }]}>Your basket is empty</Text>
              <Text style={[styles.emptyText, { color: colors.textMuted }]}>Choose a travel option and confirm it to save booking proof here.</Text>
            </View>
          ) : (
            <View style={styles.list}>
              {bookedOptions.map((option) => (
                <BookingCard
                  key={option.id}
                  option={option}
                  bookingId={bookingByTravelOptionId[option.id]}
                  deleting={isSaving && deletingOptionId === option.id}
                  onDelete={() => {
                    Alert.alert(
                      `Delete ${option.name} booking?`,
                      'The saved proof will be removed from Supabase. You can book this journey again afterward.',
                      [
                        { text: 'Cancel', style: 'cancel' },
                        {
                          text: 'Delete',
                          style: 'destructive',
                          onPress: async () => {
                            setDeletingOptionId(option.id);
                            await deleteBooking(option.id, bookingByTravelOptionId[option.id]);
                            setDeletingOptionId(null);
                          },
                        },
                      ],
                    );
                  }}
                />
              ))}
            </View>
          )}

          <Pressable
            accessibilityRole="button"
            onPress={() => router.replace('/travel')}
            style={({ pressed }) => [styles.primaryButton, { backgroundColor: colors.primary }, pressed && styles.pressed]}
          >
            <Ionicons name="add-circle-outline" size={19} color="#FFFFFF" />
            <Text style={styles.primaryButtonText}>Book another journey</Text>
          </Pressable>
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

function BookingCard({
  option,
  bookingId,
  deleting,
  onDelete,
}: {
  option: TravelOption;
  bookingId: string;
  deleting: boolean;
  onDelete: () => void;
}) {
  const { colors } = useAppTheme();
  const price = option.price === 0 ? 'Free' : `£${option.price}`;

  return (
    <View style={[styles.bookingCard, { borderColor: colors.border, backgroundColor: colors.surface }]}>
      <View style={styles.bookingSummary}>
        <View style={[styles.optionIcon, { backgroundColor: colors.primarySoft }]}>
          <Ionicons name={option.icon} size={22} color={colors.primary} />
        </View>
        <View style={styles.flex}>
          <Text style={[styles.optionName, { color: colors.text }]}>{option.name}</Text>
          <Text style={[styles.optionDetail, { color: colors.textMuted }]}>{option.duration} · {option.co2Kg} kg CO₂</Text>
        </View>
        <Text style={[styles.price, { color: colors.text }]}>{price}</Text>
      </View>

      <View style={[styles.cardActions, { borderTopColor: colors.border }]}>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Open ${option.name} booking proof`}
          onPress={() => router.push(`/booking/${bookingId}` as Href)}
          style={({ pressed }) => [styles.viewButton, pressed && styles.pressed]}
        >
          <Ionicons name="ticket-outline" size={16} color={colors.primary} />
          <Text style={[styles.viewText, { color: colors.primary }]}>View proof</Text>
        </Pressable>
        <Pressable
          accessibilityRole="button"
          accessibilityLabel={`Delete ${option.name} booking`}
          disabled={deleting}
          onPress={onDelete}
          style={({ pressed }) => [styles.deleteButton, pressed && styles.pressed]}
        >
          {deleting ? (
            <ActivityIndicator size="small" color={colors.danger} />
          ) : (
            <Ionicons name="trash-outline" size={16} color={colors.danger} />
          )}
          <Text style={[styles.deleteText, { color: colors.danger }]}>Delete</Text>
        </Pressable>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  safeArea: { flex: 1, backgroundColor: colors.surface },
  page: { width: '100%', maxWidth: 440, flex: 1, alignSelf: 'center', backgroundColor: colors.surface },
  content: { flexGrow: 1, paddingHorizontal: 20, paddingTop: 15, paddingBottom: 28 },
  flex: { flex: 1 },
  backButton: { minHeight: 27, alignSelf: 'flex-start', flexDirection: 'row', alignItems: 'center', gap: 3 },
  backText: { fontSize: 13 },
  titleRow: { flexDirection: 'row', alignItems: 'center', gap: 13, marginTop: 22 },
  basketIcon: { width: 50, height: 50, alignItems: 'center', justifyContent: 'center', borderRadius: 25 },
  title: { fontSize: 28, lineHeight: 34, fontWeight: '800', letterSpacing: -0.7 },
  subtitle: { marginTop: 3, fontSize: 12 },
  loadingState: { minHeight: 220, alignItems: 'center', justifyContent: 'center', gap: 10 },
  statusText: { fontSize: 12 },
  emptyCard: { alignItems: 'center', marginTop: 28, padding: 28, borderWidth: 1, borderRadius: 12 },
  emptyTitle: { marginTop: 12, fontSize: 16, fontWeight: '800' },
  emptyText: { marginTop: 7, fontSize: 11.5, lineHeight: 17, textAlign: 'center' },
  list: { gap: 11, marginTop: 28 },
  bookingCard: { padding: 14, borderWidth: 1, borderRadius: 10 },
  bookingSummary: { flexDirection: 'row', alignItems: 'center', gap: 12 },
  optionIcon: { width: 44, height: 44, alignItems: 'center', justifyContent: 'center', borderRadius: 9 },
  optionName: { fontSize: 14, fontWeight: '800' },
  optionDetail: { marginTop: 5, fontSize: 10.5 },
  price: { fontSize: 13, fontWeight: '800' },
  cardActions: { flexDirection: 'row', alignItems: 'center', marginTop: 13, paddingTop: 11, borderTopWidth: 1 },
  viewButton: { minHeight: 34, flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 },
  viewText: { fontSize: 11.5, fontWeight: '700' },
  deleteButton: { minHeight: 34, flex: 1, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 6 },
  deleteText: { fontSize: 11.5, fontWeight: '700' },
  primaryButton: { minHeight: 50, flexDirection: 'row', alignItems: 'center', justifyContent: 'center', gap: 8, marginTop: 24, borderRadius: 8 },
  primaryButtonText: { color: '#FFFFFF', fontSize: 14, fontWeight: '700' },
  pressed: { opacity: 0.7 },
});
