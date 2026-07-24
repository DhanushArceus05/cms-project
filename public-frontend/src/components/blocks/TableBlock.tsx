import type { TableData } from '@/lib/types';

export function TableBlock({ data }: { data: TableData }) {
  return (
    <div className="overflow-x-auto rounded-xl border border-ink-100">
      <table className="w-full text-left text-sm">
        <thead>
          <tr className="bg-ink-50">
            {data.headers.map((header, i) => (
              <th key={i} scope="col" className="border-b border-ink-100 px-4 py-2.5 font-semibold text-ink-800">
                {header}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {data.rows.map((row, r) => (
            <tr key={r} className="border-b border-ink-50 last:border-0">
              {row.map((cell, c) => (
                <td key={c} className="px-4 py-2.5 text-ink-600">
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
