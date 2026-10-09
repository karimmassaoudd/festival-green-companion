import { ArrivalPoint, EcoLocation, EcoQuest, FestivalTool } from '@/types/models';

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

export const arrivalPoints: ArrivalPoint[] = [
  { id: 'shuttle', name: 'Shuttle drop-off', icon: 'bus-outline', walkMinutes: 6, x: 15, y: 20 },
  { id: 'bus', name: 'Bus stop', icon: 'bus-outline', walkMinutes: 4, x: 72, y: 28 },
  { id: 'main', name: 'Main entrance', icon: 'enter-outline', walkMinutes: 2, x: 50, y: 58 },
  { id: 'bike', name: 'Bike parking', icon: 'bicycle-outline', walkMinutes: 5, x: 15, y: 75 },
  { id: 'car', name: 'Car park', icon: 'car-outline', walkMinutes: 8, x: 72, y: 76 },
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
