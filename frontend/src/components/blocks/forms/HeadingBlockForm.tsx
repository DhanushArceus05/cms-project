'use client';

import { Input } from '@/components/ui/Input';
import { Select } from '@/components/ui/Select';
import type { HeadingData } from '@/lib/types';

interface HeadingBlockFormProps {
  data: HeadingData;
  onChange: (data: HeadingData) => void;
}

export function HeadingBlockForm({ data, onChange }: HeadingBlockFormProps) {
  return (
    <div className="flex flex-col gap-3 sm:flex-row">
      <Select
        value={data.level}
        onChange={(e) => onChange({ ...data, level: Number(e.target.value) })}
        className="sm:w-32"
        aria-label="Heading level"
      >
        {[1, 2, 3, 4, 5, 6].map((level) => (
          <option key={level} value={level}>
            Heading {level}
          </option>
        ))}
      </Select>
      <Input
        value={data.text}
        onChange={(e) => onChange({ ...data, text: e.target.value })}
        placeholder="Heading text"
        className="flex-1"
        aria-label="Heading text"
      />
    </div>
  );
}
