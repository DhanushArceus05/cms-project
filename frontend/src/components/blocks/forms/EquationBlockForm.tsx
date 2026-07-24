'use client';

import { Textarea } from '@/components/ui/Textarea';
import type { EquationData } from '@/lib/types';

interface EquationBlockFormProps {
  data: EquationData;
  onChange: (data: EquationData) => void;
}

export function EquationBlockForm({ data, onChange }: EquationBlockFormProps) {
  return (
    <div>
      <Textarea
        value={data.latex}
        onChange={(e) => onChange({ ...data, latex: e.target.value })}
        placeholder="e.g. E = mc^2"
        rows={3}
        className="font-mono"
        aria-label="Equation LaTeX"
      />
      <label className="mt-2.5 flex items-center gap-2 text-sm text-ink-600">
        <input
          type="checkbox"
          checked={data.displayMode}
          onChange={(e) => onChange({ ...data, displayMode: e.target.checked })}
          className="h-4 w-4 rounded border-ink-300 text-ink-900 focus:ring-accent-500"
        />
        Display as a centered block equation
      </label>
    </div>
  );
}
