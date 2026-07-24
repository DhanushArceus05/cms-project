import Link from 'next/link';

export default function NotFound() {
  return (
    <div className="mx-auto flex max-w-md flex-col items-center px-4 py-24 text-center">
      <h1 className="text-lg font-semibold text-ink-900">Page not found</h1>
      <p className="mt-2 text-sm text-ink-500">The page you&apos;re looking for doesn&apos;t exist.</p>
      <Link
        href="/"
        className="mt-6 inline-flex h-10 items-center justify-center rounded-lg bg-ink-900 px-5 text-sm font-medium text-white hover:bg-ink-800"
      >
        Back to home
      </Link>
    </div>
  );
}
