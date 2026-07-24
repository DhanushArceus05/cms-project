import { cn } from '@/lib/utils';
import type { ListData, ListItemLevel1, ListItemLevel2 } from '@/lib/types';

export function ListBlock({ data }: { data: ListData }) {
  const ListTag = data.style === 'ordered' ? 'ol' : 'ul';
  const markerClass = data.style === 'ordered' ? 'list-decimal' : 'list-disc';

  return (
    <ListTag className={cn('space-y-1.5 pl-5 leading-relaxed text-ink-700', markerClass)}>
      {data.items.map((item, i) => (
        <Level1 key={i} item={item} markerClass={markerClass} />
      ))}
    </ListTag>
  );
}

function Level1({ item, markerClass }: { item: ListItemLevel1; markerClass: string }) {
  const children = item.items ?? [];
  return (
    <li>
      {item.text}
      {children.length > 0 && (
        <ol className={cn('mt-1.5 space-y-1.5 pl-5', markerClass)}>
          {children.map((child, i) => (
            <Level2 key={i} item={child} markerClass={markerClass} />
          ))}
        </ol>
      )}
    </li>
  );
}

function Level2({ item, markerClass }: { item: ListItemLevel2; markerClass: string }) {
  const children = item.items ?? [];
  return (
    <li>
      {item.text}
      {children.length > 0 && (
        <ol className={cn('mt-1.5 space-y-1.5 pl-5', markerClass)}>
          {children.map((child, i) => (
            <li key={i}>{child.text}</li>
          ))}
        </ol>
      )}
    </li>
  );
}
