import { Navbar } from '@/components/ui/navbar';
import { Footer } from '@/components/ui/footer';
import { SubmitForm } from '@/components/benchmarks/submit-form';
import { Link } from '@/i18n/routing';
import { ArrowLeft } from 'lucide-react';

import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';

export default async function SubmitPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    redirect(`/sign-in?callbackUrl=/benchmarks/${id}/submit`);
  }

  return (
    <div className="bg-background flex min-h-screen flex-col">
      <Navbar />

      <main className="container mx-auto max-w-2xl flex-1 px-4 py-32">
        <div className="mb-8">
          <Link
            href={`/benchmarks/${id}`}
            className="text-muted mb-4 inline-flex items-center text-sm transition-colors hover:text-white"
          >
            <ArrowLeft className="mr-1 h-4 w-4" />
            Back to Benchmark
          </Link>
          <h1 className="font-heading mb-2 text-3xl font-bold text-white">Submit Solution</h1>
          <p className="text-muted">
            Share your implementation details to be listed on the leaderboard.
          </p>
        </div>

        <div className="bg-surface/30 rounded-3xl border border-white/5 p-8 backdrop-blur-sm">
          <SubmitForm benchmarkId={id} />
        </div>
      </main>

      <Footer />
    </div>
  );
}
