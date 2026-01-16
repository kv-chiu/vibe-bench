import { Navbar } from '@/components/ui/navbar';
import { Footer } from '@/components/ui/footer';
import { Button } from '@/components/ui/button';
import {
  ArrowRight,
  Box,
  Code2,
  Cpu,
  Database,
  GitBranch,
  Layers,
  Medal,
  Terminal,
  Zap,
} from 'lucide-react';
import { Link } from '@/i18n/routing';
import { useTranslations } from 'next-intl';

export default function Home() {
  const t = useTranslations('HomePage');

  return (
    <div className="relative flex min-h-screen flex-col overflow-hidden">
      <Navbar />

      {/* Decorative Background */}
      <div className="pointer-events-none fixed inset-0 z-0">
        <div className="bg-grid-pattern absolute inset-0 opacity-[0.1]" />
        <div className="bg-primary/10 absolute top-0 left-1/2 h-[500px] w-[1000px] -translate-x-1/2 rounded-full mix-blend-screen blur-[120px]" />
        <div className="bg-accent/5 absolute right-0 bottom-0 h-[600px] w-[800px] rounded-full mix-blend-screen blur-[150px]" />
      </div>

      <main className="relative z-10 flex-1">
        {/* Hero Section */}
        <section className="relative overflow-hidden px-4 pt-32 pb-24 lg:pt-48 lg:pb-32">
          <div className="relative z-10 container mx-auto max-w-7xl">
            <div className="grid items-center gap-12 lg:grid-cols-2">
              {/* Text Content */}
              <div className="space-y-8 text-center lg:text-left">
                <div className="bg-surface border-border/50 text-muted animate-fade-in-up inline-flex items-center gap-2 rounded-full border px-3 py-1 font-mono text-xs">
                  <span className="bg-primary h-2 w-2 animate-pulse rounded-full" />
                  VIBEBENCH PROTOCOL V1.0 LIVE
                </div>

                <h1 className="font-heading text-5xl leading-[1.1] font-bold tracking-tight md:text-7xl">
                  {t('title')}
                </h1>

                <p className="text-muted mx-auto max-w-2xl text-lg leading-relaxed font-light md:text-xl lg:mx-0">
                  {t('subtitle')}
                </p>

                <div className="flex flex-col items-center justify-center gap-4 pt-4 sm:flex-row lg:justify-start">
                  <Link href="#benchmarks">
                    <Button size="lg" className="shadow-glow-orange min-w-[160px]">
                      {t('viewBenchmarks')}
                    </Button>
                  </Link>
                  <Link href="/about">
                    <Button variant="outline" size="lg" className="group min-w-[160px]">
                      {t('howItWorks')}
                      <ArrowRight className="ml-2 h-4 w-4 transition-transform group-hover:translate-x-1" />
                    </Button>
                  </Link>
                </div>

                <div className="flex items-center justify-center gap-8 pt-8 opacity-70 grayscale transition-all duration-500 hover:grayscale-0 lg:justify-start">
                  {/* Trusted By Logos / Tech Stack Placeholders */}
                  <div className="text-muted font-heading flex items-center gap-2 font-medium">
                    <Terminal className="h-5 w-5" /> TypeScript
                  </div>
                  <div className="text-muted font-heading flex items-center gap-2 font-medium">
                    <Database className="h-5 w-5" /> Prisma
                  </div>
                  <div className="text-muted font-heading flex items-center gap-2 font-medium">
                    <Box className="h-5 w-5" /> Next.js
                  </div>
                </div>
              </div>

              {/* 3D Visual */}
              <div className="perspective-1000 relative flex h-[400px] items-center justify-center md:h-[500px]">
                {/* Orbital Rings */}
                <div className="border-primary/20 animate-spin-slow absolute h-[300px] w-[300px] rounded-full border md:h-[450px] md:w-[450px]" />
                <div className="border-accent/20 animate-spin-reverse absolute h-[200px] w-[200px] rounded-full border md:h-[300px] md:w-[300px]" />

                {/* Central Core */}
                <div className="from-primary to-accent relative h-32 w-32 animate-pulse rounded-full bg-linear-to-br opacity-40 blur-2xl" />
                <div className="bg-surface border-primary/30 shadow-glow-orange animate-float relative z-10 flex h-24 w-24 items-center justify-center rounded-2xl border">
                  <Code2 className="text-primary h-10 w-10" />
                </div>

                {/* Floating Cards */}
                <div className="bg-surface/80 animate-float absolute top-1/4 left-10 flex items-center gap-3 rounded-xl border border-white/10 p-4 shadow-xl backdrop-blur-md delay-700 md:left-0">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-green-500/10">
                    <GitBranch className="h-4 w-4 text-green-500" />
                  </div>
                  <div>
                    <div className="text-muted text-xs">Accuracy</div>
                    <div className="font-mono text-sm font-bold">98.4%</div>
                  </div>
                </div>

                <div className="bg-surface/80 animate-float absolute right-10 bottom-1/4 flex items-center gap-3 rounded-xl border border-white/10 p-4 shadow-xl backdrop-blur-md delay-1000 md:right-0">
                  <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-blue-500/10">
                    <Cpu className="h-4 w-4 text-blue-500" />
                  </div>
                  <div>
                    <div className="text-muted text-xs">Latency</div>
                    <div className="font-mono text-sm font-bold">45ms</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Features Bento Grid */}
        <section id="benchmarks" className="relative py-24">
          <div className="container mx-auto max-w-7xl px-4">
            <div className="mb-16 space-y-4 text-center">
              <h2 className="font-heading text-3xl font-bold md:text-5xl">{t('featuresTitle')}</h2>
              <p className="text-muted mx-auto max-w-2xl">{t('featuresSubtitle')}</p>
            </div>

            <div className="grid gap-6 md:grid-cols-3">
              {/* Feature 1: Large Card */}
              <div className="group bg-surface hover:border-primary/30 relative overflow-hidden rounded-3xl border border-white/5 p-8 transition-all md:col-span-2">
                <div className="from-primary/5 absolute inset-0 bg-linear-to-br to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <div className="relative z-10 space-y-4">
                  <div className="bg-primary/10 text-primary flex h-12 w-12 items-center justify-center rounded-xl transition-transform group-hover:scale-110">
                    <Medal className="h-6 w-6" />
                  </div>
                  <h3 className="font-heading text-2xl font-bold">{t('feature1Title')}</h3>
                  <p className="text-muted max-w-md leading-relaxed">{t('feature1Desc')}</p>
                </div>
                <div className="absolute right-0 bottom-0 opacity-10 transition-opacity group-hover:opacity-20">
                  <Medal className="-mr-12 -mb-12 h-64 w-64 rotate-12" />
                </div>
              </div>

              {/* Feature 2 */}
              <div className="group bg-surface hover:border-primary/30 relative overflow-hidden rounded-3xl border border-white/5 p-8 transition-all md:col-span-1">
                <div className="from-accent/5 absolute inset-0 bg-linear-to-br to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <div className="relative z-10 space-y-4">
                  <div className="bg-accent/10 text-accent flex h-12 w-12 items-center justify-center rounded-xl transition-transform group-hover:scale-110">
                    <Zap className="h-6 w-6" />
                  </div>
                  <h3 className="font-heading text-xl font-bold">{t('liveExecution')}</h3>
                  <p className="text-muted text-sm leading-relaxed">{t('liveExecutionDesc')}</p>
                </div>
              </div>

              {/* Feature 3 */}
              <div className="group bg-surface hover:border-primary/30 relative overflow-hidden rounded-3xl border border-white/5 p-8 transition-all md:col-span-1">
                <div className="absolute inset-0 bg-linear-to-br from-blue-500/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <div className="relative z-10 space-y-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-blue-500/10 text-blue-500 transition-transform group-hover:scale-110">
                    <Layers className="h-6 w-6" />
                  </div>
                  <h3 className="font-heading text-xl font-bold">{t('multiModel')}</h3>
                  <p className="text-muted text-sm leading-relaxed">{t('multiModelDesc')}</p>
                </div>
              </div>

              {/* Feature 4: Large Card */}
              <div className="group bg-surface hover:border-primary/30 relative overflow-hidden rounded-3xl border border-white/5 p-8 transition-all md:col-span-2">
                <div className="absolute inset-0 bg-linear-to-br from-purple-500/5 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100" />
                <div className="relative z-10 space-y-4">
                  <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-purple-500/10 text-purple-500 transition-transform group-hover:scale-110">
                    <Terminal className="h-6 w-6" />
                  </div>
                  <h3 className="font-heading text-2xl font-bold">{t('feature2Title')}</h3>
                  <p className="text-muted max-w-md leading-relaxed">{t('feature2Desc')}</p>
                </div>
                <div className="absolute right-0 bottom-0 opacity-10 transition-opacity group-hover:opacity-20">
                  <Terminal className="-mr-12 -mb-12 h-64 w-64 -rotate-12" />
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>

      <Footer />
    </div>
  );
}
