'use client';

import { Textarea } from '@/components/ui/Textarea';
import type { ParagraphData } from '@/lib/types';

interface ParagraphBlockFormProps {
  data: ParagraphData;
  onChange: (data: ParagraphData) => void;
}

export function ParagraphBlockForm({ data, onChange }: ParagraphBlockFormProps) {
  return (
    <Textarea
      value={data.text}
      onChange={(e) => onChange({ ...data, text: e.target.value })}
      placeholder="Write a paragraph..."
      rows={4}
      aria-label="Paragraph text"
    />
  );
}
