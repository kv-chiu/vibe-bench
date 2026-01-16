import { Navbar } from '@/components/ui/navbar';
import { Footer } from '@/components/ui/footer';
import { getAllSubmissions } from '@/lib/api/submissions';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { Calendar, GitBranch, ExternalLink } from 'lucide-react';
import { headers } from 'next/headers';
import { auth } from '@/lib/auth';
import { checkLiked } from '@/lib/actions/like';
import { LikeButton } from '@/components/submissions/like-button';

export const dynamic = 'force-dynamic';

export default async function SubmissionsPage() {
  const t = await getTranslations('SubmissionsPage');
  const submissions = await getAllSubmissions();

  // Get current user session
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const currentUserId = session?.user?.id;

  // Check liked status for each submission
  const submissionsWithLikeStatus = await Promise.all(
    submissions.map(async (sub) => ({
      ...sub,
      likedByCurrentUser: await checkLiked(sub.id, currentUserId),
    }))
  );

  return (
    <div className="bg-background flex min-h-screen flex-col">
      <Navbar />

      <main className="container mx-auto max-w-7xl flex-1 px-4 py-32">
        {/* Header */}
        <div className="animate-fade-in-up mb-12">
          <h1 className="font-heading mb-4 text-4xl font-bold tracking-tight md:text-5xl">
            {t('title')}
          </h1>
          <p className="text-muted max-w-2xl text-lg">{t('subtitle')}</p>
        </div>

        {/* Gallery Grid */}
        {submissionsWithLikeStatus.length > 0 ? (
          <div className="grid grid-cols-1 gap-6 md:grid-cols-2 lg:grid-cols-3">
            {submissionsWithLikeStatus.map((sub) => (
              <div
                key={sub.id}
                className="group bg-surface hover:border-primary/30 hover:shadow-glow-orange relative flex flex-col overflow-hidden rounded-3xl border border-white/5 p-6 transition-all duration-300 hover:-translate-y-1"
              >
                {/* Glow Effect */}
                <div className="from-primary/5 pointer-events-none absolute inset-0 bg-linear-to-br to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />

                {/* Header */}
                <div className="relative z-10 mb-3 flex items-start justify-between">
                  <div className="flex items-center gap-3">
                    <div className="bg-primary/10 text-primary flex h-10 w-10 items-center justify-center rounded-full font-bold">
                      {(sub.authorName || sub.user?.name || 'A')[0].toUpperCase()}
                    </div>
                    <div>
                      <div className="font-heading font-bold text-white">
                        {sub.authorName || sub.user?.name || 'Anonymous'}
                      </div>
                      <div className="text-muted flex items-center gap-1 text-xs">
                        <Calendar className="h-3 w-3" />
                        {new Date(sub.createdAt).toLocaleDateString()}
                      </div>
                    </div>
                  </div>
                </div>

                {/* Benchmark Link */}
                <Link
                  href={`/benchmarks/${sub.benchmarkId}`}
                  className="text-primary relative z-10 mb-3 line-clamp-1 text-sm hover:underline"
                >
                  {sub.benchmark.title}
                </Link>

                {/* Model & Tool Tags */}
                <div className="relative z-10 mb-4 flex flex-wrap gap-2">
                  <span className="text-muted rounded-md border border-white/5 bg-white/5 px-2.5 py-1 font-mono text-xs">
                    {sub.baseModel}
                  </span>
                  <span className="text-muted rounded-md border border-white/5 bg-white/5 px-2.5 py-1 font-mono text-xs">
                    {sub.codingTool}
                  </span>
                </div>

                {/* Actions */}
                <div className="relative z-10 mt-auto flex items-center justify-between border-t border-white/5 pt-4">
                  <LikeButton
                    submissionId={sub.id}
                    initialLiked={sub.likedByCurrentUser}
                    initialCount={sub.likeCount}
                    userId={currentUserId}
                  />

                  <div className="flex items-center gap-2">
                    {sub.repoUrl && (
                      <a
                        href={sub.repoUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="text-muted rounded-lg bg-white/5 p-2 transition-colors hover:text-white"
                        title={t('viewRepo')}
                      >
                        <ExternalLink className="h-4 w-4" />
                      </a>
                    )}
                    <Link
                      href={`/submissions/${sub.id}`}
                      className="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20 rounded-lg border px-3 py-1.5 text-xs font-medium transition-colors"
                    >
                      {t('viewDetails')}
                    </Link>
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="bg-surface/30 flex flex-col items-center justify-center rounded-3xl border border-dashed border-white/10 py-24">
            <GitBranch className="text-muted mb-4 h-12 w-12" />
            <p className="text-muted">{t('noSubmissions')}</p>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
