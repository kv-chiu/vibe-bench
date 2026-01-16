import { Navbar } from '@/components/ui/navbar';
import { Footer } from '@/components/ui/footer';
import { Button } from '@/components/ui/button';
import { ArrowRight, Github, Target, Upload, CheckCircle, Code2 } from 'lucide-react';
import { Link } from '@/i18n/routing';
import { getTranslations } from 'next-intl/server';

export default async function AboutPage() {
  const t = await getTranslations('AboutPage');

  return (
    <div className="bg-background flex min-h-screen flex-col">
      <Navbar />

      <main className="container mx-auto max-w-5xl flex-1 px-4 py-32">
        {/* Hero */}
        <div className="animate-fade-in-up mb-20 text-center">
          <h1 className="font-heading mb-6 text-4xl font-bold tracking-tight md:text-6xl">
            {t('title')}
          </h1>
          <p className="text-muted mx-auto max-w-2xl text-xl leading-relaxed">{t('subtitle')}</p>
        </div>

        {/* Mission Section */}
        <section className="mb-20">
          <div className="bg-surface/50 rounded-3xl border border-white/5 p-8 md:p-12">
            <div className="mb-6 flex items-center gap-4">
              <div className="bg-primary/10 flex h-12 w-12 items-center justify-center rounded-xl">
                <Target className="text-primary h-6 w-6" />
              </div>
              <h2 className="font-heading text-2xl font-bold md:text-3xl">{t('missionTitle')}</h2>
            </div>
            <p className="text-muted text-lg leading-relaxed">{t('missionText')}</p>
          </div>
        </section>

        {/* How It Works */}
        <section className="mb-20">
          <h2 className="font-heading mb-12 text-center text-2xl font-bold md:text-3xl">
            {t('howItWorksTitle')}
          </h2>

          <div className="grid gap-6 md:grid-cols-3">
            {/* Step 1 */}
            <div className="group relative">
              <div className="bg-surface hover:border-primary/30 h-full rounded-2xl border border-white/5 p-6 transition-all">
                <div className="bg-primary/10 text-primary mb-4 flex h-10 w-10 items-center justify-center rounded-full font-bold">
                  1
                </div>
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-blue-500/10">
                  <Code2 className="h-5 w-5 text-blue-500" />
                </div>
                <h3 className="mb-2 text-lg font-bold">{t('step1Title')}</h3>
                <p className="text-muted text-sm leading-relaxed">{t('step1Desc')}</p>
              </div>
            </div>

            {/* Step 2 */}
            <div className="group relative">
              <div className="bg-surface hover:border-primary/30 h-full rounded-2xl border border-white/5 p-6 transition-all">
                <div className="bg-primary/10 text-primary mb-4 flex h-10 w-10 items-center justify-center rounded-full font-bold">
                  2
                </div>
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-green-500/10">
                  <Upload className="h-5 w-5 text-green-500" />
                </div>
                <h3 className="mb-2 text-lg font-bold">{t('step2Title')}</h3>
                <p className="text-muted text-sm leading-relaxed">{t('step2Desc')}</p>
              </div>
            </div>

            {/* Step 3 */}
            <div className="group relative">
              <div className="bg-surface hover:border-primary/30 h-full rounded-2xl border border-white/5 p-6 transition-all">
                <div className="bg-primary/10 text-primary mb-4 flex h-10 w-10 items-center justify-center rounded-full font-bold">
                  3
                </div>
                <div className="mb-4 flex h-10 w-10 items-center justify-center rounded-lg bg-purple-500/10">
                  <CheckCircle className="h-5 w-5 text-purple-500" />
                </div>
                <h3 className="mb-2 text-lg font-bold">{t('step3Title')}</h3>
                <p className="text-muted text-sm leading-relaxed">{t('step3Desc')}</p>
              </div>
            </div>
          </div>
        </section>

        {/* Open Source Section */}
        <section className="mb-20">
          <div className="from-primary/5 to-accent/5 border-primary/20 rounded-3xl border bg-linear-to-br p-8 text-center md:p-12">
            <div className="mx-auto mb-6 flex h-16 w-16 items-center justify-center rounded-2xl bg-white/5">
              <Github className="h-8 w-8 text-white" />
            </div>
            <h2 className="font-heading mb-4 text-2xl font-bold md:text-3xl">
              {t('openSourceTitle')}
            </h2>
            <p className="text-muted mx-auto mb-8 max-w-2xl text-lg leading-relaxed">
              {t('openSourceText')}
            </p>
            <div className="flex flex-col items-center justify-center gap-4 sm:flex-row">
              <a href="https://github.com" target="_blank" rel="noopener noreferrer">
                <Button variant="outline" size="lg" className="min-w-[180px]">
                  <Github className="mr-2 h-4 w-4" />
                  {t('viewOnGitHub')}
                </Button>
              </a>
              <Link href="/benchmarks">
                <Button size="lg" className="min-w-[180px]">
                  {t('getStarted')}
                  <ArrowRight className="ml-2 h-4 w-4" />
                </Button>
              </Link>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
