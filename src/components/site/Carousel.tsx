import type { ReactNode } from 'react';
import type { Dictionary } from '@/i18n/dictionaries';
import { CarouselClient } from './Carousel.client';

type CarouselProps = { label: string; items: ReactNode[]; itemWidth?: string; d: Dictionary; onActive?: never };

/**
 * Native scroll-snap carousel (spec §4.3). Server wrapper: only the three
 * a11y strings cross into the client island.
 */
export function Carousel({ label, items, itemWidth = '86vw', d }: CarouselProps) {
  const { carouselPrev, carouselNext, carouselPosition } = d.a11y;
  return <CarouselClient label={label} items={items} itemWidth={itemWidth} a11y={{ carouselPrev, carouselNext, carouselPosition }} />;
}
