'use client';

import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import { Button } from '@/components/ui/Button';
import type { ListData, ListItemLevel1, ListItemLevel2, ListItemLevel3 } from '@/lib/types';

interface ListBlockFormProps {
  data: ListData;
  onChange: (data: ListData) => void;
}

export function ListBlockForm({ data, onChange }: ListBlockFormProps) {
  const updateItems = (items: ListItemLevel1[]) => onChange({ ...data, items });

  const addItem = () => updateItems([...data.items, { text: '' }]);

  return (
    <div>
      <Select
        value={data.style}
        onChange={(e) => onChange({ ...data, style: e.target.value as ListData['style'] })}
        className="mb-3 w-40"
        aria-label="List style"
      >
        <option value="unordered">Bulleted</option>
        <option value="ordered">Numbered</option>
      </Select>

      <div className="flex flex-col gap-2">
        {data.items.map((item, index) => (
          <Level1Item
            key={index}
            item={item}
            onChange={(next) => updateItems(data.items.map((it, i) => (i === index ? next : it)))}
            onRemove={() => updateItems(data.items.filter((_, i) => i !== index))}
            canRemove={data.items.length > 1}
          />
        ))}
      </div>

      <Button type="button" variant="ghost" size="sm" onClick={addItem} className="mt-2">
        + Add item
      </Button>
    </div>
  );
}

function ItemRow({
  value,
  onChange,
  onRemove,
  onAddChild,
  canRemove,
  canAddChild,
  placeholder,
}: {
  value: string;
  onChange: (text: string) => void;
  onRemove: () => void;
  onAddChild?: () => void;
  canRemove: boolean;
  canAddChild?: boolean;
  placeholder: string;
}) {
  return (
    <div className="flex items-center gap-2">
      <Input value={value} onChange={(e) => onChange(e.target.value)} placeholder={placeholder} className="flex-1" />
      {canAddChild && onAddChild && (
        <button
          type="button"
          onClick={onAddChild}
          title="Add sub-item"
          className="shrink-0 rounded-md px-2 py-1.5 text-xs font-medium text-ink-500 hover:bg-ink-100"
        >
          ↳ Sub-item
        </button>
      )}
      <button
        type="button"
        onClick={onRemove}
        disabled={!canRemove}
        title="Remove item"
        className="shrink-0 rounded-md px-2 py-1.5 text-xs font-medium text-rose-500 hover:bg-rose-50 disabled:cursor-not-allowed disabled:text-ink-300 disabled:hover:bg-transparent"
      >
        Remove
      </button>
    </div>
  );
}

function Level1Item({
  item,
  onChange,
  onRemove,
  canRemove,
}: {
  item: ListItemLevel1;
  onChange: (item: ListItemLevel1) => void;
  onRemove: () => void;
  canRemove: boolean;
}) {
  const children = item.items ?? [];

  const setChildren = (items: ListItemLevel2[]) => onChange({ ...item, items });
  const addChild = () => setChildren([...children, { text: '' }]);

  return (
    <div>
      <ItemRow
        value={item.text}
        onChange={(text) => onChange({ ...item, text })}
        onRemove={onRemove}
        onAddChild={addChild}
        canRemove={canRemove}
        canAddChild
        placeholder="List item"
      />
      {children.length > 0 && (
        <div className="ml-6 mt-2 flex flex-col gap-2 border-l-2 border-ink-100 pl-4">
          {children.map((child, index) => (
            <Level2Item
              key={index}
              item={child}
              onChange={(next) => setChildren(children.map((c, i) => (i === index ? next : c)))}
              onRemove={() => setChildren(children.filter((_, i) => i !== index))}
            />
          ))}
        </div>
      )}
    </div>
  );
}

function Level2Item({
  item,
  onChange,
  onRemove,
}: {
  item: ListItemLevel2;
  onChange: (item: ListItemLevel2) => void;
  onRemove: () => void;
}) {
  const children = item.items ?? [];

  const setChildren = (items: ListItemLevel3[]) => onChange({ ...item, items });
  const addChild = () => setChildren([...children, { text: '' }]);

  return (
    <div>
      <ItemRow
        value={item.text}
        onChange={(text) => onChange({ ...item, text })}
        onRemove={onRemove}
        onAddChild={addChild}
        canRemove
        canAddChild
        placeholder="Sub-item"
      />
      {children.length > 0 && (
        <div className="ml-6 mt-2 flex flex-col gap-2 border-l-2 border-ink-100 pl-4">
          {children.map((child, index) => (
            <ItemRow
              key={index}
              value={child.text}
              onChange={(text) => setChildren(children.map((c, i) => (i === index ? { text } : c)))}
              onRemove={() => setChildren(children.filter((_, i) => i !== index))}
              canRemove
              placeholder="Sub-sub-item"
            />
          ))}
        </div>
      )}
    </div>
  );
}
