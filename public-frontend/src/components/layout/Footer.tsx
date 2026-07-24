export function Footer() {
  const year = new Date().getFullYear();
  return (
    <footer className="border-t border-ink-100 bg-white">
      <div className="mx-auto flex max-w-5xl flex-col items-center justify-between gap-3 px-4 py-8 text-sm text-ink-500 sm:flex-row md:px-6">
        <p>© {year} ContentHub. All content is served from the CMS.</p>
        <p className="text-ink-400">Built with Next.js</p>
      </div>
    </footer>
  );
}
