'use client';

import { useState } from 'react';
import { useRouter } from '@/i18n/routing';
import { Button } from '@/components/ui/button';
import { createBenchmark, updateBenchmark } from '@/lib/actions/benchmark';
import { useTranslations } from 'next-intl';

interface BenchmarkFormProps {
  benchmark?: {
    id: string;
    title: string;
    description: string | null;
    requirementDoc: string | null;
    prototypeUrl: string | null;
    userStories: string | null;
    isActive: boolean;
  };
}

export function BenchmarkForm({ benchmark }: BenchmarkFormProps) {
  const t = useTranslations('AdminPage');
  const router = useRouter();
  const isEditing = !!benchmark;

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (formData: FormData) => {
    setIsSubmitting(true);
    setError(null);

    try {
      const result = isEditing
        ? await updateBenchmark(benchmark.id, formData)
        : await createBenchmark(formData);

      if (result.success) {
        router.push('/admin/benchmarks');
        router.refresh();
      } else {
        setError(result.error || 'Something went wrong');
      }
    } catch {
      setError('Failed to save benchmark');
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <form action={handleSubmit} className="space-y-6">
      {error && (
        <div className="rounded-xl border border-red-500/20 bg-red-500/10 p-4 text-sm text-red-500">
          {error}
        </div>
      )}

      {/* Title */}
      <div>
        <label className="mb-2 block text-sm font-medium text-white">{t('benchmarkTitle')} *</label>
        <input
          type="text"
          name="title"
          defaultValue={benchmark?.title || ''}
          required
          className="bg-surface placeholder:text-muted focus:border-primary w-full rounded-xl border border-white/10 px-4 py-3 text-white transition-colors focus:outline-none"
          placeholder="e.g., React Dashboard Component"
        />
      </div>

      {/* Description */}
      <div>
        <label className="mb-2 block text-sm font-medium text-white">
          {t('benchmarkDescription')}
        </label>
        <textarea
          name="description"
          defaultValue={benchmark?.description || ''}
          rows={3}
          className="bg-surface placeholder:text-muted focus:border-primary w-full resize-none rounded-xl border border-white/10 px-4 py-3 text-white transition-colors focus:outline-none"
          placeholder="Brief description of the benchmark..."
        />
      </div>

      {/* Requirements Doc */}
      <div>
        <label className="mb-2 block text-sm font-medium text-white">{t('requirementDoc')}</label>
        <textarea
          name="requirementDoc"
          defaultValue={benchmark?.requirementDoc || ''}
          rows={10}
          className="bg-surface placeholder:text-muted focus:border-primary w-full resize-none rounded-xl border border-white/10 px-4 py-3 font-mono text-sm text-white transition-colors focus:outline-none"
          placeholder="# Requirements&#10;&#10;## Overview&#10;Describe the task...&#10;&#10;## Evaluation Criteria&#10;..."
        />
      </div>

      {/* Prototype URL */}
      <div>
        <label className="mb-2 block text-sm font-medium text-white">{t('prototypeUrl')}</label>
        <input
          type="url"
          name="prototypeUrl"
          defaultValue={benchmark?.prototypeUrl || ''}
          className="bg-surface placeholder:text-muted focus:border-primary w-full rounded-xl border border-white/10 px-4 py-3 text-white transition-colors focus:outline-none"
          placeholder="https://..."
        />
      </div>

      {/* User Stories */}
      <div>
        <label className="mb-2 block text-sm font-medium text-white">{t('userStories')}</label>
        <textarea
          name="userStories"
          defaultValue={benchmark?.userStories || ''}
          rows={5}
          className="bg-surface placeholder:text-muted focus:border-primary w-full resize-none rounded-xl border border-white/10 px-4 py-3 text-white transition-colors focus:outline-none"
          placeholder="As a user, I want to..."
        />
      </div>

      {/* Active Toggle (only for editing) */}
      {isEditing && (
        <div className="flex items-center gap-3">
          <input
            type="checkbox"
            name="isActive"
            value="true"
            defaultChecked={benchmark.isActive}
            className="bg-surface text-primary focus:ring-primary h-5 w-5 rounded border-white/10"
          />
          <label className="text-sm font-medium text-white">{t('isActive')}</label>
        </div>
      )}

      {/* Actions */}
      <div className="flex items-center gap-4 pt-4">
        <Button type="submit" disabled={isSubmitting} className="min-w-[120px]">
          {isSubmitting ? '...' : t('save')}
        </Button>
        <Button type="button" variant="outline" onClick={() => router.back()}>
          {t('cancel')}
        </Button>
      </div>
    </form>
  );
}
