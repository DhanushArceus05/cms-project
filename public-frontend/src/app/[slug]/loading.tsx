export default function LoadingCmsPage() {
  return (
    <div className="mx-auto max-w-3xl animate-pulse px-4 py-12 md:px-6 md:py-16">
      <div className="mb-8 flex items-center justify-between border-b border-ink-100 pb-4">
        <div className="h-4 w-24 rounded bg-ink-100" />
        <div className="h-3 w-20 rounded bg-ink-100" />
      </div>
      <div className="flex flex-col gap-4">
        <div className="h-8 w-2/3 rounded bg-ink-100" />
        <div className="h-4 w-full rounded bg-ink-100" />
        <div className="h-4 w-5/6 rounded bg-ink-100" />
        <div className="h-4 w-3/4 rounded bg-ink-100" />
      </div>
    </div>
  );
}
