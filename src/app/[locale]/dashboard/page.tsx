import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { Navbar } from '@/components/ui/navbar';
import { Footer } from '@/components/ui/footer';
import { Link } from '@/i18n/routing';
import { FileIcon, ExternalLink, Clock, CheckCircle2, XCircle } from 'lucide-react';
import { getTranslations } from 'next-intl/server';

export default async function DashboardPage() {
  const t = await getTranslations('DashboardPage');
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect('/sign-in?callbackUrl=/dashboard');
  }

  const submissions = await prisma.submission.findMany({
    where: {
      userId: session.user.id,
    },
    include: {
      benchmark: true,
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  const getStatusBadge = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return (
          <span className="inline-flex items-center rounded-full border border-green-500/20 bg-green-500/10 px-2.5 py-0.5 text-xs font-medium text-green-500">
            <CheckCircle2 className="mr-1 h-3 w-3" /> {t('approved')}
          </span>
        );
      case 'REJECTED':
        return (
          <span className="inline-flex items-center rounded-full border border-red-500/20 bg-red-500/10 px-2.5 py-0.5 text-xs font-medium text-red-500">
            <XCircle className="mr-1 h-3 w-3" /> {t('rejected')}
          </span>
        );
      default:
        return (
          <span className="inline-flex items-center rounded-full border border-yellow-500/20 bg-yellow-500/10 px-2.5 py-0.5 text-xs font-medium text-yellow-500">
            <Clock className="mr-1 h-3 w-3" /> {t('pending')}
          </span>
        );
    }
  };

  return (
    <div className="bg-background flex min-h-screen flex-col">
      <Navbar />

      <main className="container mx-auto max-w-4xl flex-1 px-4 py-32">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="font-heading mb-2 text-3xl font-bold text-white">{t('title')}</h1>
            <p className="text-muted">{t('subtitle')}</p>
          </div>
          <div className="flex items-center space-x-4">{/* Stats or Actions could go here */}</div>
        </div>

        <div className="bg-surface/30 overflow-hidden rounded-3xl border border-white/5 backdrop-blur-sm">
          {submissions.length === 0 ? (
            <div className="text-muted p-12 text-center">
              <p className="mb-4">You haven&apos;t submitted any solutions yet.</p>
              <Link
                href="/benchmarks"
                className="bg-primary text-background hover:bg-primary/90 inline-flex items-center justify-center rounded-xl px-6 py-2 font-medium transition-colors"
              >
                Browse Benchmarks
              </Link>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="text-muted bg-white/5 text-xs font-medium uppercase">
                  <tr>
                    <th className="px-6 py-4">{t('benchmark')}</th>
                    <th className="px-6 py-4">{t('modelTool')}</th>
                    <th className="px-6 py-4">{t('submitted')}</th>
                    <th className="px-6 py-4">{t('status')}</th>
                    <th className="px-6 py-4">{t('resources')}</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {submissions.map((sub) => (
                    <tr key={sub.id} className="transition-colors hover:bg-white/5">
                      <td className="px-6 py-4">
                        <Link
                          href={`/benchmarks/${sub.benchmarkId}`}
                          className="hover:text-primary font-medium text-white transition-colors"
                        >
                          {sub.benchmark.title}
                        </Link>
                        <div className="text-muted mt-0.5 max-w-[200px] truncate font-mono text-xs">
                          {sub.id.slice(-8)}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-sm text-white">{sub.baseModel}</span>
                          <span className="text-muted text-xs">{sub.codingTool}</span>
                        </div>
                      </td>
                      <td className="text-muted px-6 py-4 text-sm">
                        {new Date(sub.createdAt).toLocaleDateString()}
                      </td>
                      <td className="px-6 py-4">{getStatusBadge(sub.status)}</td>
                      <td className="px-6 py-4">
                        <div className="flex items-center space-x-2">
                          {sub.chatLogFiles.length > 0 && (
                            <a
                              href={sub.chatLogFiles[0]}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-muted rounded-lg bg-white/5 p-1.5 transition-colors hover:text-white"
                              title="View Files"
                            >
                              <FileIcon className="h-4 w-4" />
                            </a>
                          )}
                          {sub.repoUrl && (
                            <a
                              href={sub.repoUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-muted rounded-lg bg-white/5 p-1.5 transition-colors hover:text-white"
                              title="View Repo"
                            >
                              <ExternalLink className="h-4 w-4" />
                            </a>
                          )}
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </main>

      <Footer />
    </div>
  );
}
