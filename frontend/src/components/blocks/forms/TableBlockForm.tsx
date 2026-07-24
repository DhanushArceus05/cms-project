'use client';

import { Button } from '@/components/ui/Button';
import { Input } from '@/components/ui/Input';
import type { TableData } from '@/lib/types';

interface TableBlockFormProps {
  data: TableData;
  onChange: (data: TableData) => void;
}

export function TableBlockForm({ data, onChange }: TableBlockFormProps) {
  const addColumn = () => {
    onChange({
      headers: [...data.headers, `Column ${data.headers.length + 1}`],
      rows: data.rows.map((row) => [...row, '']),
    });
  };

  const removeColumn = (colIndex: number) => {
    if (data.headers.length <= 1) return;
    onChange({
      headers: data.headers.filter((_, i) => i !== colIndex),
      rows: data.rows.map((row) => row.filter((_, i) => i !== colIndex)),
    });
  };

  const updateHeader = (colIndex: number, value: string) => {
    onChange({ ...data, headers: data.headers.map((h, i) => (i === colIndex ? value : h)) });
  };

  const addRow = () => {
    onChange({ ...data, rows: [...data.rows, data.headers.map(() => '')] });
  };

  const removeRow = (rowIndex: number) => {
    if (data.rows.length <= 1) return;
    onChange({ ...data, rows: data.rows.filter((_, i) => i !== rowIndex) });
  };

  const updateCell = (rowIndex: number, colIndex: number, value: string) => {
    onChange({
      ...data,
      rows: data.rows.map((row, r) => (r === rowIndex ? row.map((cell, c) => (c === colIndex ? value : cell)) : row)),
    });
  };

  return (
    <div className="overflow-x-auto">
      <table className="w-full min-w-[480px] border-separate border-spacing-1.5">
        <thead>
          <tr>
            {data.headers.map((header, colIndex) => (
              <th key={colIndex} className="text-left">
                <div className="flex items-center gap-1">
                  <Input
                    value={header}
                    onChange={(e) => updateHeader(colIndex, e.target.value)}
                    placeholder={`Column ${colIndex + 1}`}
                    className="h-8 text-xs font-semibold"
                  />
                  <button
                    type="button"
                    onClick={() => removeColumn(colIndex)}
                    disabled={data.headers.length <= 1}
                    title="Remove column"
                    className="shrink-0 rounded px-1.5 py-1 text-xs text-rose-500 hover:bg-rose-50 disabled:cursor-not-allowed disabled:text-ink-300 disabled:hover:bg-transparent"
                  >
                    ✕
                  </button>
                </div>
              </th>
            ))}
            <th className="w-8" />
          </tr>
        </thead>
        <tbody>
          {data.rows.map((row, rowIndex) => (
            <tr key={rowIndex}>
              {row.map((cell, colIndex) => (
                <td key={colIndex}>
                  <Input
                    value={cell}
                    onChange={(e) => updateCell(rowIndex, colIndex, e.target.value)}
                    className="h-8 text-sm"
                  />
                </td>
              ))}
              <td>
                <button
                  type="button"
                  onClick={() => removeRow(rowIndex)}
                  disabled={data.rows.length <= 1}
                  title="Remove row"
                  className="rounded px-1.5 py-1 text-xs text-rose-500 hover:bg-rose-50 disabled:cursor-not-allowed disabled:text-ink-300 disabled:hover:bg-transparent"
                >
                  ✕
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>

      <div className="mt-2 flex gap-2">
        <Button type="button" variant="ghost" size="sm" onClick={addRow}>
          + Add row
        </Button>
        <Button type="button" variant="ghost" size="sm" onClick={addColumn}>
          + Add column
        </Button>
      </div>
    </div>
  );
}
