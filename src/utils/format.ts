export function formatCo2(kilograms: number) {
  return `${kilograms.toFixed(1)} kg`;
}

export function formatPrice(price: number) {
  return price === 0 ? 'Free' : `£${price.toFixed(2)}`;
}

export function formatDistance(meters: number) {
  return meters >= 1000 ? `${(meters / 1000).toFixed(1)} km` : `${meters} m`;
}
