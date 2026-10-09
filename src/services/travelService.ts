import { getSupabaseClient } from '@/lib/supabase';
import { IconName, TravelOption } from '@/types/models';

const FESTIVAL_SLUG = 'greenfield-festival';

type FestivalRow = {
  id: string;
};

type TravelOptionRow = {
  id: string;
  name: string;
  detail: string;
  icon_name: string;
  duration_label: string;
  price_gbp: number;
  co2_kg: number;
  convenience: TravelOption['convenience'];
  sustainability_note: string | null;
};

type SavedChoiceRow = {
  travel_option_id: string;
};

export type FestivalTravelData = {
  festivalId: string;
  travelOptions: TravelOption[];
  savedTravelOptionId: string | null;
};

export async function loadFestivalTravelData(userId: string): Promise<FestivalTravelData> {
  const client = getSupabaseClient();

  const { data: festivalData, error: festivalError } = await client
    .from('festivals')
    .select('id')
    .eq('slug', FESTIVAL_SLUG)
    .single<FestivalRow>();

  if (festivalError) throw new Error(`Could not load the festival: ${festivalError.message}`);

  const { data: optionData, error: optionError } = await client
    .from('travel_options')
    .select(
      'id, name, detail, icon_name, duration_label, price_gbp, co2_kg, convenience, sustainability_note',
    )
    .eq('festival_id', festivalData.id)
    .order('display_order')
    .returns<TravelOptionRow[]>();

  if (optionError) throw new Error(`Could not load travel options: ${optionError.message}`);
  if (!optionData.length) throw new Error('No travel options were found for this festival.');

  const { data: choiceData, error: choiceError } = await client
    .from('user_travel_choices')
    .select('travel_option_id')
    .eq('user_id', userId)
    .eq('festival_id', festivalData.id)
    .maybeSingle<SavedChoiceRow>();

  if (choiceError) throw new Error(`Could not load the saved travel choice: ${choiceError.message}`);

  return {
    festivalId: festivalData.id,
    travelOptions: optionData.map(mapTravelOption),
    savedTravelOptionId: choiceData?.travel_option_id ?? null,
  };
}

export async function saveTravelChoice({
  festivalId,
  userId,
  travelOptionId,
}: {
  festivalId: string;
  userId: string;
  travelOptionId: string;
}) {
  const client = getSupabaseClient();
  const { error } = await client.from('user_travel_choices').upsert(
    {
      festival_id: festivalId,
      user_id: userId,
      travel_option_id: travelOptionId,
    },
    { onConflict: 'user_id,festival_id' },
  );

  if (error) throw new Error(`Could not save the travel choice: ${error.message}`);
}

function mapTravelOption(row: TravelOptionRow): TravelOption {
  return {
    id: row.id,
    name: row.name,
    detail: row.detail,
    icon: row.icon_name as IconName,
    duration: row.duration_label,
    price: Number(row.price_gbp),
    co2Kg: Number(row.co2_kg),
    convenience: row.convenience,
    sustainabilityNote: row.sustainability_note ?? undefined,
  };
}
