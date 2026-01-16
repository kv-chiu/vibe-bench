'use client';

import { Link } from '@/i18n/routing';
import { Button } from '@/components/ui/button';
import { Calendar, Layers } from 'lucide-react';
import { type BenchmarkWithUser } from '@/lib/api/benchmarks';
import { useTranslations } from 'next-intl';

interface BenchmarkCardProps {
  benchmark: BenchmarkWithUser;
  isAdmin?: boolean;
}

export function BenchmarkCard({ benchmark, isAdmin }: BenchmarkCardProps) {
  const t = useTranslations('BenchmarksPage');
  return (
    <div className="group bg-surface hover:border-primary/30 hover:shadow-glow-orange relative flex flex-col overflow-hidden rounded-3xl border border-white/5 p-6 transition-all duration-300 hover:-translate-y-1">
      {/* Glow Effect */}
      <div className="from-primary/5 pointer-events-none absolute inset-0 bg-linear-to-br to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

      {/* Header */}
      <div className="relative z-10 mb-4 flex items-start justify-between">
        <div className="space-y-1">
          <div className="text-muted mb-2 flex items-center gap-2 font-mono text-xs">
            <span
              className={`h-2 w-2 rounded-full ${benchmark.isActive ? 'bg-green-500 shadow-[0_0_10px_rgba(34,197,94,0.4)]' : 'bg-red-500'}`}
            />
            {benchmark.isActive ? t('activeProtocol') : 'ARCHIVED'}
          </div>
          <h3 className="font-heading group-hover:text-primary line-clamp-1 text-xl font-bold text-white transition-colors">
            {benchmark.title}
          </h3>
        </div>
      </div>

      {/* Description */}
      <p className="text-muted/80 relative z-10 mb-6 line-clamp-3 flex-1 text-sm leading-relaxed">
        {benchmark.description || 'No description provided.'}
      </p>

      {/* Stats / Meta */}
      <div className="relative z-10 mt-auto space-y-4 border-t border-white/5 pt-4">
        <div className="text-muted flex items-center justify-between font-mono text-xs">
          <div className="flex items-center gap-1.5">
            <Layers className="h-3.5 w-3.5" />
            <span>
              {benchmark._count.submissions} {t('submissions')}
            </span>
          </div>
          <div className="flex items-center gap-1.5">
            <Calendar className="h-3.5 w-3.5" />
            <span>{new Date(benchmark.createdAt).toLocaleDateString()}</span>
          </div>
        </div>

        {/* Actions */}
        <div className="flex items-center gap-3">
          <Link href={`/benchmarks/${benchmark.id}`} className="flex-1">
            <Button variant="secondary" size="sm" className="w-full">
              {t('viewSpecs')}
            </Button>
          </Link>
          {isAdmin && (
            <Link href={`/admin/benchmarks/${benchmark.id}/edit`}>
              <Button variant="ghost" size="sm" className="px-3">
                Edit
              </Button>
            </Link>
          )}
        </div>
      </div>
    </div>
  );
}
