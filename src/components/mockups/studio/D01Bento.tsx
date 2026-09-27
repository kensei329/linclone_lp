import type { Dictionary } from '@/i18n/dictionaries';
import type { MockProps } from '@/components/mockups/types';

export type TileId = 'publicProfile' | 'fanContent' | 'live' | 'homeVoice' | 'morningCall' | 'fillers' | 'analytics';

type D01BentoProps = MockProps & { tileHrefs: Record<TileId, string>; tileDesc: Dictionary['creators']['home']['tiles'] };

const ORDER: TileId[] = ['publicProfile', 'fanContent', 'live', 'homeVoice', 'morningCall', 'fillers', 'analytics'];

/**
 * S3 `D01Bento`: the command centre; tiles are real links, so this is a <nav>
 * (spec §6.3, §7.2). STUB (WP0a), owned by WP5: replace wholesale.
 */
export function D01Bento({ d, tileHrefs, tileDesc, className }: D01BentoProps) {
  const labels = d.mock.studio.home.tiles;
  return (
    <nav aria-label={d.creators.home.tocLabel} data-mock="D01Bento" className={className}>
      <ul>
        {ORDER.map((id) => (
          <li key={id}>
            <a href={tileHrefs[id]} data-tile="" aria-label={`${labels[id]}: ${tileDesc[id]}`}>
              {labels[id]}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}
