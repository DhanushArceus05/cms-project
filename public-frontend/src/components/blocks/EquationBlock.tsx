import { renderLatex } from '@/lib/katex';
import { cn } from '@/lib/utils';
import type { EquationData } from '@/lib/types';

export function EquationBlock({ data }: { data: EquationData }) {
  const { html, hasError } = renderLatex(data.latex, data.displayMode);

  if (hasError) {
    return (
      <div className="rounded-lg border border-amber-200 bg-amber-50 px-4 py-3 text-sm text-amber-800">
        This equation could not be rendered.
      </div>
    );
  }

  return (
    <div
      className={cn(
        'overflow-x-auto rounded-lg border border-ink-100 bg-ink-50 px-4 py-3',
        data.displayMode ? 'text-center' : 'text-left'
      )}
      // KaTeX's renderToString output is deterministic, script-free markup —
      // safe to inject directly; see lib/katex.ts.
      dangerouslySetInnerHTML={{ __html: html }}
    />
  );
}
