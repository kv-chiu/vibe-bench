import { BenchmarkCard } from '@/components/benchmarks/benchmark-card';
import { Navbar } from '@/components/ui/navbar';
import { Footer } from '@/components/ui/footer';
import { getBenchmarks } from '@/lib/api/benchmarks';
import { Search } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

export const dynamic = 'force-dynamic';

export default async function ProjectsPage() {
  const t = await getTranslations('BenchmarksPage');
  const benchmarks = await getBenchmarks();

  return (
    <div className="bg-background flex min-h-screen flex-col">
      <Navbar />

      <main className="container mx-auto max-w-7xl flex-1 px-4 py-32">
        {/* Header Section */}
        <div className="animate-fade-in-up mb-12 flex flex-col justify-between gap-6 md:flex-row md:items-end">
          <div className="space-y-4">
            <h1 className="font-heading text-4xl font-bold tracking-tight md:text-5xl">
              {t('title')}
            </h1>
            <p className="text-muted max-w-xl text-lg">{t('subtitle')}</p>
          </div>

          {/* Search / Filter Placeholder */}
          <div className="group relative w-full md:w-80">
            <div className="pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3">
              <Search className="text-muted group-focus-within:text-primary h-4 w-4 transition-colors" />
            </div>
            <input
              type="text"
              placeholder={t('searchPlaceholder')}
              className="bg-surface focus:border-primary placeholder:text-muted/50 w-full border-b-2 border-white/10 px-10 py-3 text-sm text-white transition-all focus:bg-white/5 focus:outline-none"
              disabled // Pending implementation
            />
          </div>
        </div>

        {/* Grid */}
        {benchmarks.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {benchmarks.map((benchmark) => (
              <BenchmarkCard key={benchmark.id} benchmark={benchmark} />
            ))}
          </div>
        ) : (
          /* Empty State */
          <div className="bg-surface/30 flex flex-col items-center justify-center rounded-3xl border border-dashed border-white/10 py-24">
            <div className="bg-surface shadow-glow-orange mb-6 flex h-16 w-16 items-center justify-center rounded-full border border-white/5">
              <Search className="text-muted h-8 w-8" />
            </div>
            <h3 className="font-heading mb-2 text-xl font-bold text-white">No Benchmarks Found</h3>
            <p className="text-muted max-w-sm text-center">
              The protocol list is currently empty. Check back later or log in as admin to create
              one.
            </p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
