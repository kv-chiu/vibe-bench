import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { Navbar } from '@/components/ui/navbar';
import { Footer } from '@/components/ui/footer';
import { Link } from '@/i18n/routing';
import { Plus, Edit, Eye } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { getTranslations } from 'next-intl/server';

export default async function AdminBenchmarksPage() {
  const t = await getTranslations('AdminPage');
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || session.user.role !== 'ADMIN') {
    redirect('/');
  }

  const benchmarks = await prisma.benchmark.findMany({
    include: {
      _count: {
        select: { submissions: true },
      },
    },
    orderBy: { createdAt: 'desc' },
  });

  return (
    <div className="bg-background flex min-h-screen flex-col">
      <Navbar />

      <main className="container mx-auto max-w-6xl flex-1 px-4 py-32">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="font-heading mb-2 text-3xl font-bold text-white">
              {t('benchmarksTitle')}
            </h1>
            <p className="text-muted">{benchmarks.length} benchmarks total</p>
          </div>
          <Link href="/admin/benchmarks/new">
            <Button className="shadow-glow-orange">
              <Plus className="mr-2 h-4 w-4" />
              {t('createBenchmark')}
            </Button>
          </Link>
        </div>

        <div className="bg-surface/30 overflow-hidden rounded-3xl border border-white/5">
          {benchmarks.length === 0 ? (
            <div className="text-muted p-12 text-center">
              <p>No benchmarks yet. Create your first one!</p>
            </div>
          ) : (
            <div className="divide-y divide-white/5">
              {benchmarks.map((benchmark) => (
                <div
                  key={benchmark.id}
                  className="flex items-center justify-between p-6 transition-colors hover:bg-white/5"
                >
                  <div className="flex-1">
                    <div className="flex items-center gap-3">
                      <h3 className="font-heading font-bold text-white">{benchmark.title}</h3>
                      <span
                        className={`rounded-full px-2 py-0.5 font-mono text-xs ${
                          benchmark.isActive
                            ? 'border border-green-500/20 bg-green-500/10 text-green-500'
                            : 'border border-red-500/20 bg-red-500/10 text-red-500'
                        }`}
                      >
                        {benchmark.isActive ? 'Active' : 'Archived'}
                      </span>
                    </div>
                    <p className="text-muted mt-1 line-clamp-1 text-sm">
                      {benchmark.description || 'No description'}
                    </p>
                    <div className="text-muted mt-2 text-xs">
                      {benchmark._count.submissions} submissions • Created{' '}
                      {new Date(benchmark.createdAt).toLocaleDateString()}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Link href={`/benchmarks/${benchmark.id}`}>
                      <Button variant="ghost" size="sm">
                        <Eye className="h-4 w-4" />
                      </Button>
                    </Link>
                    <Link href={`/admin/benchmarks/${benchmark.id}/edit`}>
                      <Button variant="ghost" size="sm">
                        <Edit className="h-4 w-4" />
                      </Button>
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
