import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { prisma } from '@/lib/prisma';
import { Navbar } from '@/components/ui/navbar';
import { Footer } from '@/components/ui/footer';
import { Link } from '@/i18n/routing';
import { Check, X, FileIcon, ExternalLink, Settings } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { approveSubmission, rejectSubmission } from '@/lib/actions/admin';
import { getTranslations } from 'next-intl/server';

export default async function AdminPage() {
  const t = await getTranslations('AdminPage');
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || session.user.role !== 'ADMIN') {
    redirect('/');
  }

  const pendingSubmissions = await prisma.submission.findMany({
    where: {
      status: 'PENDING',
    },
    include: {
      benchmark: true,
      user: true,
    },
    orderBy: {
      createdAt: 'asc', // Oldest first
    },
  });

  return (
    <div className="bg-background flex min-h-screen flex-col">
      <Navbar />

      <main className="container mx-auto max-w-6xl flex-1 px-4 py-32">
        <div className="mb-8 flex items-center justify-between">
          <div>
            <h1 className="font-heading mb-2 text-3xl font-bold text-white">{t('title')}</h1>
            <p className="text-muted">{t('subtitle')}</p>
          </div>
          <div className="flex items-center space-x-3">
            <Link href="/admin/benchmarks">
              <Button variant="outline" size="sm">
                <Settings className="mr-2 h-4 w-4" />
                {t('benchmarksTitle')}
              </Button>
            </Link>
            <span className="bg-primary/10 text-primary border-primary/20 rounded-full border px-3 py-1 text-sm font-medium">
              {pendingSubmissions.length} {t('pending')}
            </span>
          </div>
        </div>

        <div className="bg-surface/30 overflow-hidden rounded-3xl border border-white/5 backdrop-blur-sm">
          {pendingSubmissions.length === 0 ? (
            <div className="text-muted p-12 text-center">
              <div className="mb-4 inline-flex h-12 w-12 items-center justify-center rounded-full border border-green-500/20 bg-green-500/10 text-green-500">
                <Check className="h-6 w-6" />
              </div>
              <p>{t('noPending')}</p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full text-left">
                <thead className="text-muted bg-white/5 text-xs font-medium uppercase">
                  <tr>
                    <th className="px-6 py-4">Submission</th>
                    <th className="px-6 py-4">Author</th>
                    <th className="px-6 py-4">Submitted</th>
                    <th className="px-6 py-4">Content</th>
                    <th className="px-6 py-4 text-right">Actions</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-white/5">
                  {pendingSubmissions.map((sub) => (
                    <tr key={sub.id} className="group transition-colors hover:bg-white/5">
                      <td className="px-6 py-4">
                        <Link
                          href={`/benchmarks/${sub.benchmarkId}`}
                          className="hover:text-primary block font-medium text-white transition-colors"
                        >
                          {sub.benchmark.title}
                        </Link>
                        <div className="text-muted mt-1 space-y-1 text-xs">
                          <div>
                            Model: <span className="text-white">{sub.baseModel}</span>
                          </div>
                          <div>
                            Tool: <span className="text-white">{sub.codingTool}</span>
                          </div>
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col">
                          <span className="text-sm text-white">
                            {sub.authorName || 'Anonymous'}
                          </span>
                          <span className="text-muted text-xs">{sub.user.email}</span>
                        </div>
                      </td>
                      <td className="text-muted px-6 py-4 text-sm">
                        {new Date(sub.createdAt).toLocaleDateString()}
                        <div className="text-xs">
                          {new Date(sub.createdAt).toLocaleTimeString()}
                        </div>
                      </td>
                      <td className="px-6 py-4">
                        <div className="flex flex-col space-y-2">
                          {sub.repoUrl && (
                            <a
                              href={sub.repoUrl}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-primary inline-flex items-center text-sm hover:underline"
                            >
                              <ExternalLink className="mr-1 h-3 w-3" />
                              Repo
                            </a>
                          )}
                          {sub.chatLogFiles.length > 0 && (
                            <a
                              href={sub.chatLogFiles[0]}
                              target="_blank"
                              rel="noopener noreferrer"
                              className="text-muted inline-flex items-center text-sm transition-colors hover:text-white"
                            >
                              <FileIcon className="mr-1 h-3 w-3" />
                              Log File
                            </a>
                          )}
                        </div>
                      </td>
                      <td className="px-6 py-4 text-right">
                        <div className="flex items-center justify-end space-x-2">
                          <form action={approveSubmission.bind(null, sub.id)}>
                            <button
                              type="submit"
                              className="rounded-lg border border-green-500/20 bg-green-500/10 p-2 text-green-500 transition-colors hover:bg-green-500/20"
                              title="Approve"
                            >
                              <Check className="h-4 w-4" />
                            </button>
                          </form>
                          <form action={rejectSubmission.bind(null, sub.id)}>
                            <button
                              type="submit"
                              className="rounded-lg border border-red-500/20 bg-red-500/10 p-2 text-red-500 transition-colors hover:bg-red-500/20"
                              title="Reject"
                            >
                              <X className="h-4 w-4" />
                            </button>
                          </form>
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
