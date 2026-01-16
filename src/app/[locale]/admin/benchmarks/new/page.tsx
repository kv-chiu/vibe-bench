import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { redirect } from 'next/navigation';
import { Navbar } from '@/components/ui/navbar';
import { Footer } from '@/components/ui/footer';
import { BenchmarkForm } from '@/components/admin/benchmark-form';
import { getTranslations } from 'next-intl/server';

export default async function NewBenchmarkPage() {
  const t = await getTranslations('AdminPage');
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || session.user.role !== 'ADMIN') {
    redirect('/');
  }

  return (
    <div className="bg-background flex min-h-screen flex-col">
      <Navbar />

      <main className="container mx-auto max-w-3xl flex-1 px-4 py-32">
        <div className="mb-8">
          <h1 className="font-heading mb-2 text-3xl font-bold text-white">
            {t('createBenchmark')}
          </h1>
        </div>

        <div className="bg-surface/30 rounded-3xl border border-white/5 p-8">
          <BenchmarkForm />
        </div>
      </main>

      <Footer />
    </div>
  );
}
