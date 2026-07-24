import katex from 'katex';

export interface RenderedEquation {
  html: string;
  hasError: boolean;
}

/**
 * Renders a LaTeX string to KaTeX HTML server-side. Invalid LaTeX doesn't throw —
 * katex's `throwOnError: false` produces an inline error rendering instead, and we
 * additionally flag `hasError` so the UI can show a small, friendly notice rather
 * than silently displaying KaTeX's raw error markup.
 */
export function renderLatex(latex: string, displayMode: boolean): RenderedEquation {
  try {
    const html = katex.renderToString(latex, {
      displayMode,
      throwOnError: false,
      strict: 'ignore',
      output: 'html',
    });
    return { html, hasError: false };
  } catch {
    return { html: '', hasError: true };
  }
}
