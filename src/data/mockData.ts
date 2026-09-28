import { EcoLocation, EcoQuest, FestivalTool, TravelOption } from '@/types/models';

export const festivalTools: FestivalTool[] = [
  {
    id: 'cup-return',
    title: 'Scan Return',
    subtitle: 'Deposit cup or plate QR code',
    badge: '+10 pts',
    icon: 'qr-code-outline',
  },
  {
    id: 'water',
    title: 'Water Refill',
    subtitle: 'West Stage tap · chilled',
    badge: '45 m away',
    icon: 'water-outline',
    route: '/map',
  },
  {
    id: 'travel',
    title: 'Travel Log',
    subtitle: 'Certified GWR rail traveller',
    badge: 'Low CO₂',
    icon: 'train-outline',
    route: '/travel',
  },
  {
    id: 'food',
    title: 'Eco Dining',
    subtitle: 'Zero-waste local kitchens',
    badge: '24 stalls',
    icon: 'restaurant-outline',
    route: '/map',
  },
];

export const initialQuests: EcoQuest[] = [
  { id: 'refill', label: 'Refill 750 ml bottle 3 times', points: 15, completed: true },
  { id: 'compost', label: 'Sort compostable packaging', points: 15, completed: true },
  { id: 'meal', label: 'Eat one certified plant-based meal', points: 20, completed: false },
];

export const travelOptions: TravelOption[] = [
  {
    id: 'train',
    name: 'Train & Electric Shuttle',
    detail: 'Direct rail + festival e-shuttle',
    icon: 'train-outline',
    duration: '1 hr 30 min',
    price: 24.5,
    co2Kg: 2.1,
    savingPercent: 91,
    recommended: true,
  },
  {
    id: 'bus',
    name: 'Official Direct Coach',
    detail: 'Victoria coach station to festival',
    icon: 'bus-outline',
    duration: '2 hr 10 min',
    price: 18,
    co2Kg: 3.4,
    savingPercent: 86,
  },
  {
    id: 'carpool',
    name: 'Festival Carpool',
    detail: 'Estimated with 3 or more guests',
    icon: 'people-outline',
    duration: '2 hr',
    price: 14,
    co2Kg: 5.6,
    savingPercent: 77,
  },
  {
    id: 'car',
    name: 'Solo Car Drive',
    detail: 'Baseline petrol car estimate',
    icon: 'car-outline',
    duration: '1 hr 45 min',
    price: 31.2,
    co2Kg: 24.2,
    savingPercent: 0,
  },
];

export const ecoLocations: EcoLocation[] = [
  {
    id: 'water-west',
    name: 'West Stage Chilled Spring',
    detail: 'Alpine Spring Flow · UV-sterilized',
    type: 'water',
    icon: 'water-outline',
    distanceMeters: 45,
    walkMinutes: 1,
    waitMinutes: 0,
    x: 51,
    y: 59,
  },
  {
    id: 'cup-central',
    name: 'Central Cup Return',
    detail: 'Return reusable cups and earn 10 points',
    type: 'cup',
    icon: 'cafe-outline',
    distanceMeters: 120,
    walkMinutes: 2,
    waitMinutes: 4,
    x: 72,
    y: 47,
  },
  {
    id: 'recycling-pyramid',
    name: 'Pyramid Recycling Hub',
    detail: 'Mixed recycling and compost sorting',
    type: 'recycling',
    icon: 'leaf-outline',
    distanceMeters: 210,
    walkMinutes: 4,
    waitMinutes: 1,
    x: 82,
    y: 18,
  },
  {
    id: 'food-solar',
    name: 'Solar Kitchen Row',
    detail: 'Plant-based stalls powered by renewables',
    type: 'food',
    icon: 'restaurant-outline',
    distanceMeters: 180,
    walkMinutes: 3,
    waitMinutes: 6,
    x: 25,
    y: 27,
  },
];

export const ecoFilterLabels = {
  water: 'Water',
  recycling: 'Recycling',
  cup: 'Cup Return',
  food: 'Eco Food',
} as const;
