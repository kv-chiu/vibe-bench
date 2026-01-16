'use client';

import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { CheckCircle2, ArrowLeft, RotateCcw } from 'lucide-react';
import { Link } from '@/i18n/routing';
import confetti from 'canvas-confetti';
import { useParams } from 'next/navigation';
import { useTranslations } from 'next-intl';

export default function SubmissionSuccessPage() {
  const t = useTranslations('SubmitSuccessPage');
  const params = useParams();
  const benchmarkId = params.id as string;

  useEffect(() => {
    // Fire confetti on mount
    const duration = 3 * 1000;
    const animationEnd = Date.now() + duration;
    const defaults = { startVelocity: 30, spread: 360, ticks: 60, zIndex: 0 };

    const randomInRange = (min: number, max: number) => {
      return Math.random() * (max - min) + min;
    };

    const interval: NodeJS.Timeout = setInterval(function () {
      const timeLeft = animationEnd - Date.now();

      if (timeLeft <= 0) {
        return clearInterval(interval);
      }

      const particleCount = 50 * (timeLeft / duration);

      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.1, 0.3), y: Math.random() - 0.2 },
      });
      confetti({
        ...defaults,
        particleCount,
        origin: { x: randomInRange(0.7, 0.9), y: Math.random() - 0.2 },
      });
    }, 250);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex min-h-screen items-center justify-center pt-24 pb-12">
      <div className="mx-auto w-full max-w-md px-4">
        <div className="bg-surface/50 animate-in zoom-in-95 rounded-3xl border border-white/10 p-8 text-center backdrop-blur-xl duration-500 md:p-12">
          <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-full bg-green-500/10 ring-1 ring-green-500/20">
            <CheckCircle2 className="h-10 w-10 text-green-500" />
          </div>

          <h1 className="font-heading mb-3 text-3xl font-bold text-white">{t('title')}</h1>

          <p className="text-muted-foreground mb-8">{t('message')}</p>

          <div className="space-y-3">
            <Link href={`/benchmarks/${benchmarkId}`} className="block">
              <Button size="lg" className="shadow-glow-primary w-full">
                <ArrowLeft className="mr-2 h-4 w-4" />
                {t('backToBenchmark')}
              </Button>
            </Link>

            <Link href={`/benchmarks/${benchmarkId}/submit`} className="block">
              <Button variant="ghost" className="text-muted w-full hover:text-white">
                <RotateCcw className="mr-2 h-4 w-4" />
                {t('submitAnother')}
              </Button>
            </Link>
          </div>
        </div>
      </div>
    </div>
  );
}
