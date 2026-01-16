import { notFound } from 'next/navigation';
import { headers } from 'next/headers';
import { Navbar } from '@/components/ui/navbar';
import { Footer } from '@/components/ui/footer';
import { getSubmissionById } from '@/lib/api/submissions';
import { getTranslations } from 'next-intl/server';
import { Link } from '@/i18n/routing';
import { ArrowLeft, Calendar, ExternalLink, FileText } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { auth } from '@/lib/auth';
import { checkLiked } from '@/lib/actions/like';
import { LikeButton } from '@/components/submissions/like-button';

export default async function SubmissionDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const submission = await getSubmissionById(id);
  const t = await getTranslations('SubmissionsPage');

  if (!submission) {
    notFound();
  }

  // Get current user session
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const currentUserId = session?.user?.id;
  const isLiked = await checkLiked(submission.id, currentUserId);

  return (
    <div className="bg-background flex min-h-screen flex-col">
      <Navbar />

      <main className="container mx-auto max-w-4xl flex-1 px-4 py-32">
        {/* Back Link */}
        <Link
          href="/submissions"
          className="text-muted mb-8 inline-flex items-center gap-2 transition-colors hover:text-white"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Submissions
        </Link>

        {/* Header Card */}
        <div className="bg-surface/50 mb-8 rounded-3xl border border-white/5 p-8">
          <div className="flex flex-col justify-between gap-6 md:flex-row md:items-start">
            {/* Left: Author & Benchmark Info */}
            <div className="flex-1 space-y-4">
              {/* Author */}
              <div className="flex items-center gap-4">
                <div className="bg-primary/10 text-primary flex h-14 w-14 items-center justify-center rounded-full text-xl font-bold">
                  {(submission.authorName || submission.user?.name || 'A')[0].toUpperCase()}
                </div>
                <div>
                  <div className="font-heading text-xl font-bold text-white">
                    {submission.authorName || submission.user?.name || 'Anonymous'}
                  </div>
                  <div className="text-muted flex items-center gap-1.5 text-sm">
                    <Calendar className="h-3.5 w-3.5" />
                    {t('submittedOn')} {new Date(submission.createdAt).toLocaleDateString()}
                  </div>
                </div>
              </div>

              {/* Benchmark */}
              <div className="border-t border-white/5 pt-4">
                <div className="text-muted mb-1 text-xs uppercase">{t('benchmark')}</div>
                <Link
                  href={`/benchmarks/${submission.benchmarkId}`}
                  className="font-heading text-primary text-lg font-bold hover:underline"
                >
                  {submission.benchmark.title}
                </Link>
                {submission.benchmark.description && (
                  <p className="text-muted mt-2 line-clamp-2 text-sm">
                    {submission.benchmark.description}
                  </p>
                )}
              </div>
            </div>

            {/* Right: Actions */}
            <div className="flex shrink-0 flex-col gap-3">
              <LikeButton
                submissionId={submission.id}
                initialLiked={isLiked}
                initialCount={submission.likeCount}
                userId={currentUserId}
              />

              {submission.repoUrl && (
                <a href={submission.repoUrl} target="_blank" rel="noopener noreferrer">
                  <Button variant="outline" size="sm" className="w-full">
                    <ExternalLink className="mr-2 h-4 w-4" />
                    {t('viewRepo')}
                  </Button>
                </a>
              )}
            </div>
          </div>
        </div>

        {/* Details Grid */}
        <div className="mb-8 grid gap-6 md:grid-cols-2">
          {/* Model & Tool */}
          <div className="bg-surface/30 rounded-2xl border border-white/5 p-6">
            <h3 className="text-muted mb-4 text-sm uppercase">AI Configuration</h3>
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-muted">{t('model')}</span>
                <span className="rounded-md bg-white/5 px-3 py-1 font-mono text-white">
                  {submission.baseModel}
                </span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-muted">{t('tool')}</span>
                <span className="rounded-md bg-white/5 px-3 py-1 font-mono text-white">
                  {submission.codingTool}
                </span>
              </div>
              {submission.plugins.length > 0 && (
                <div className="border-t border-white/5 pt-3">
                  <span className="text-muted text-sm">Plugins</span>
                  <div className="mt-2 flex flex-wrap gap-2">
                    {submission.plugins.map((plugin, i) => (
                      <span key={i} className="rounded bg-white/5 px-2 py-1 text-xs">
                        {plugin}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Resources */}
          <div className="bg-surface/30 rounded-2xl border border-white/5 p-6">
            <h3 className="text-muted mb-4 text-sm uppercase">Resources</h3>
            <div className="space-y-3">
              {submission.chatLogUrl && (
                <a
                  href={submission.chatLogUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 rounded-xl bg-white/5 p-3 transition-colors hover:bg-white/10"
                >
                  <FileText className="text-primary h-5 w-5" />
                  <span className="text-white">{t('viewChatLog')}</span>
                  <ExternalLink className="text-muted ml-auto h-4 w-4" />
                </a>
              )}
              {submission.chatLogFiles.length > 0 && (
                <div className="space-y-2">
                  {submission.chatLogFiles.map((file, i) => (
                    <a
                      key={i}
                      href={file}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center gap-3 rounded-xl bg-white/5 p-3 transition-colors hover:bg-white/10"
                    >
                      <FileText className="text-muted h-5 w-5" />
                      <span className="truncate text-sm text-white">Log File {i + 1}</span>
                      <ExternalLink className="text-muted ml-auto h-4 w-4" />
                    </a>
                  ))}
                </div>
              )}
              {!submission.chatLogUrl && submission.chatLogFiles.length === 0 && (
                <p className="text-muted text-sm">No chat logs provided.</p>
              )}
            </div>
          </div>
        </div>

        {/* Chat Log Text */}
        {submission.chatLogText && (
          <div className="bg-surface/30 rounded-2xl border border-white/5 p-6">
            <h3 className="text-muted mb-4 text-sm uppercase">Chat Log</h3>
            <pre className="text-muted max-h-96 overflow-x-auto overflow-y-auto rounded-xl bg-black/30 p-4 font-mono text-sm whitespace-pre-wrap">
              {submission.chatLogText}
            </pre>
          </div>
        )}
      </main>

      <Footer />
    </div>
  );
}
