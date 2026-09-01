export interface CategoryFilterItem {
  id: string;
  name: string;
  icon: string;
}

export const SAMPLE_CATEGORIES: CategoryFilterItem[] = [
  { id: 'clothing', name: 'Clothing', icon: 'Shirt' },
  { id: 'toys', name: 'Toys & Play', icon: 'Gamepad2' },
  { id: 'nursery', name: 'Nursery & Bedding', icon: 'BedDouble' },
  { id: 'footwear', name: 'Footwear', icon: 'Footprints' },
  { id: 'accessories', name: 'Accessories', icon: 'Watch' },
  { id: 'essentials', name: 'Daily Essentials', icon: 'Sparkles' },
];
