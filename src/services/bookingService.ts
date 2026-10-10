import { getSupabaseClient } from '@/lib/supabase';
import { TravelOption } from '@/types/models';

type BookingRow = {
  id: string;
  booking_reference: string;
  user_id: string;
  festival_id: string;
  travel_option_id: string;
  price_gbp: number;
  status: 'confirmed' | 'cancelled';
  booked_at: string;
};

type BookingSummaryRow = Pick<BookingRow, 'id' | 'travel_option_id'>;

type FestivalRow = {
  name: string;
  start_date: string;
  end_date: string;
  origin_name: string;
  destination_name: string;
};

type TravelOptionRow = {
  name: string;
  detail: string;
  duration_label: string;
  co2_kg: number;
};

export type TravelBooking = {
  id: string;
  bookingReference: string;
  festivalId: string;
  travelOptionId: string;
  price: number;
  status: BookingRow['status'];
  bookedAt: string;
};

export type TravelBookingProof = TravelBooking & {
  festivalName: string;
  festivalStartDate: string;
  festivalEndDate: string;
  originName: string;
  destinationName: string;
  travelOptionName: string;
  travelOptionDetail: string;
  duration: string;
  co2Kg: number;
};

export async function loadUserTravelBookings(userId: string, festivalId: string) {
  const client = getSupabaseClient();
  const { data, error } = await client
    .from('travel_bookings')
    .select('id, travel_option_id')
    .eq('user_id', userId)
    .eq('festival_id', festivalId)
    .eq('status', 'confirmed')
    .returns<BookingSummaryRow[]>();

  if (error) throw new Error(`Could not load your bookings: ${error.message}`);

  return Object.fromEntries(data.map((booking) => [booking.travel_option_id, booking.id]));
}

export async function createTravelBooking({
  userId,
  festivalId,
  travelOption,
}: {
  userId: string;
  festivalId: string;
  travelOption: TravelOption;
}): Promise<TravelBooking> {
  const client = getSupabaseClient();
  const { data: existing, error: existingError } = await client
    .from('travel_bookings')
    .select('id, booking_reference, user_id, festival_id, travel_option_id, price_gbp, status, booked_at')
    .eq('user_id', userId)
    .eq('festival_id', festivalId)
    .eq('travel_option_id', travelOption.id)
    .maybeSingle<BookingRow>();

  if (existingError) throw new Error(`Could not check your booking: ${existingError.message}`);
  if (existing) return mapBooking(existing);

  const { data, error } = await client
    .from('travel_bookings')
    .insert({
      user_id: userId,
      festival_id: festivalId,
      travel_option_id: travelOption.id,
      price_gbp: travelOption.price,
    })
    .select('id, booking_reference, user_id, festival_id, travel_option_id, price_gbp, status, booked_at')
    .single<BookingRow>();

  if (error) throw new Error(`Could not confirm your booking: ${error.message}`);
  return mapBooking(data);
}

export async function loadBookingProof(
  bookingId: string,
  userId: string,
): Promise<TravelBookingProof> {
  const client = getSupabaseClient();
  const { data: booking, error: bookingError } = await client
    .from('travel_bookings')
    .select('id, booking_reference, user_id, festival_id, travel_option_id, price_gbp, status, booked_at')
    .eq('id', bookingId)
    .eq('user_id', userId)
    .single<BookingRow>();

  if (bookingError) throw new Error(`Could not load booking proof: ${bookingError.message}`);

  const [{ data: festival, error: festivalError }, { data: option, error: optionError }] =
    await Promise.all([
      client
        .from('festivals')
        .select('name, start_date, end_date, origin_name, destination_name')
        .eq('id', booking.festival_id)
        .single<FestivalRow>(),
      client
        .from('travel_options')
        .select('name, detail, duration_label, co2_kg')
        .eq('id', booking.travel_option_id)
        .single<TravelOptionRow>(),
    ]);

  if (festivalError) throw new Error(`Could not load the festival: ${festivalError.message}`);
  if (optionError) throw new Error(`Could not load the travel details: ${optionError.message}`);

  return {
    ...mapBooking(booking),
    festivalName: festival.name,
    festivalStartDate: festival.start_date,
    festivalEndDate: festival.end_date,
    originName: festival.origin_name,
    destinationName: festival.destination_name,
    travelOptionName: option.name,
    travelOptionDetail: option.detail,
    duration: option.duration_label,
    co2Kg: Number(option.co2_kg),
  };
}

function mapBooking(row: BookingRow): TravelBooking {
  return {
    id: row.id,
    bookingReference: row.booking_reference,
    festivalId: row.festival_id,
    travelOptionId: row.travel_option_id,
    price: Number(row.price_gbp),
    status: row.status,
    bookedAt: row.booked_at,
  };
}
