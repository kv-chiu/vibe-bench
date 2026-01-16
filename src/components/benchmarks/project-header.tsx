'use client';

import { Calendar, GitBranch, Layers } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { type Benchmark } from '@/generated/prisma/client';
import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';

interface ProjectHeaderProps {
  benchmark: Benchmark & {
    createdBy: { name: string | null; image: string | null };
    _count: { submissions: number };
  };
}

export function ProjectHeader({ benchmark }: ProjectHeaderProps) {
  const t = useTranslations('BenchmarkDetailPage');

  return (
    <div className="relative mb-12">
      {/* Background Decor */}
      <div className="bg-primary/5 pointer-events-none absolute top-0 right-0 -z-10 h-96 w-96 rounded-full blur-3xl" />

      <div className="flex flex-col justify-between gap-6 md:flex-row md:items-start">
        <div className="flex-1 space-y-4">
          {/* Status Badge */}
          <div className="flex items-center gap-3">
            <div
              className={`rounded-full border px-3 py-1 font-mono text-xs ${
                benchmark.isActive
                  ? 'border-green-500/20 bg-green-500/10 text-green-500'
                  : 'border-red-500/20 bg-red-500/10 text-red-500'
              }`}
            >
              {benchmark.isActive ? t('activeProtocol') : t('archived')}
            </div>

            <div className="text-muted flex items-center gap-1.5 text-xs">
              <Calendar className="h-3.5 w-3.5" />
              {t('created')} {new Date(benchmark.createdAt).toLocaleDateString()}
            </div>
          </div>

          <h1 className="font-heading text-4xl leading-tight font-bold text-white md:text-5xl">
            {benchmark.title}
          </h1>

          <div className="flex items-center gap-1.5 text-white">
            <Layers className="text-primary h-4 w-4" />
            <span className="font-mono">
              {benchmark._count.submissions} {t('submissions')}
            </span>
          </div>
        </div>

        {/* Action Button */}
        {benchmark.isActive && (
          <div className="shrink-0">
            <Link href={`/benchmarks/${benchmark.id}/submit`}>
              <Button size="lg" className="shadow-glow-orange-intense w-full md:w-auto">
                <GitBranch className="mr-2 h-4 w-4" />
                {t('submitSolution')}
              </Button>
            </Link>
          </div>
        )}
      </div>
    </div>
  );
}
