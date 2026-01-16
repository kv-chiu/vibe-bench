import { notFound } from 'next/navigation';
import { headers } from 'next/headers';
import { Navbar } from '@/components/ui/navbar';
import { Footer } from '@/components/ui/footer';
import { getBenchmarkById } from '@/lib/api/benchmarks';
import { ProjectHeader } from '@/components/benchmarks/project-header';
import { MarkdownView } from '@/components/markdown-view';
import { SubmissionList } from '@/components/benchmarks/submission-list';
import { auth } from '@/lib/auth';
import { checkLiked } from '@/lib/actions/like';
import { getTranslations } from 'next-intl/server';

export default async function ProjectDetailPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const benchmark = await getBenchmarkById(id);

  if (!benchmark) {
    notFound();
  }

  // Get current user session
  const session = await auth.api.getSession({
    headers: await headers(),
  });
  const currentUserId = session?.user?.id;

  // Check liked status for each submission
  const submissionsWithLikeStatus = await Promise.all(
    benchmark.submissions.map(async (sub) => ({
      ...sub,
      likedByCurrentUser: await checkLiked(sub.id, currentUserId),
    }))
  );

  const t = await getTranslations('BenchmarkDetailPage');

  return (
    <div className="bg-background flex min-h-screen flex-col">
      <Navbar />

      <main className="container mx-auto max-w-5xl flex-1 px-4 py-32">
        <ProjectHeader benchmark={benchmark} />

        <div className="grid grid-cols-1 gap-12 lg:grid-cols-3">
          {/* Main Content: Requirements */}
          <div className="space-y-12 lg:col-span-2">
            <section>
              <h2 className="font-heading mb-6 flex items-center gap-2 text-2xl font-bold text-white">
                {t('requirements')}
                <div className="ml-4 h-px flex-1 bg-white/10" />
              </h2>
              <div className="bg-surface/50 rounded-3xl border border-white/5 p-8">
                {benchmark.description && (
                  <p className="text-muted mb-8 border-b border-white/5 pb-8 text-lg leading-relaxed">
                    {benchmark.description}
                  </p>
                )}
                {/* Fallback mock content if no real markdown doc exists yet */}
                <MarkdownView
                  content={
                    benchmark.requirementDoc ||
                    `
### Overview
No detailed requirements document provided yet.

### Key Objectives
- Objective 1
- Objective 2

### Evaluation Criteria
1. **Accuracy**: Code works as expected.
2. **Quality**: Clean, typed code.
                  `
                  }
                />
              </div>
            </section>
          </div>

          {/* Sidebar: Submissions */}
          <div className="space-y-8">
            <section>
              <h2 className="font-heading mb-6 text-xl font-bold text-white">{t('submissions')}</h2>
              <SubmissionList
                submissions={submissionsWithLikeStatus}
                currentUserId={currentUserId}
              />
            </section>
          </div>
        </div>
      </main>

      <Footer />
    </div>
  );
}
