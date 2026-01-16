'use client';

import { Link } from '@/i18n/routing';
import { type SubmissionStatus } from '@/generated/prisma/client';
import { CheckCircle2, XCircle, Clock } from 'lucide-react';
import { Icons } from '@/components/icons';
import { LikeButton } from '@/components/submissions/like-button';
import { useTranslations } from 'next-intl';

interface Submission {
  id: string;
  status: SubmissionStatus;
  repoUrl: string;
  createdAt: Date;
  authorName: string | null;
  baseModel: string;
  codingTool: string;
  likeCount: number;
  likedByCurrentUser: boolean;
}

interface SubmissionListProps {
  submissions: Submission[];
  currentUserId?: string;
}

export function SubmissionList({ submissions, currentUserId }: SubmissionListProps) {
  const t = useTranslations('BenchmarkDetailPage');

  if (submissions.length === 0) {
    return (
      <div className="bg-surface/30 rounded-2xl border border-dashed border-white/10 py-12 text-center">
        <p className="text-muted">{t('noSubmissions')}</p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {submissions.map((sub) => (
        <div
          key={sub.id}
          className="bg-surface/50 hover:bg-surface group flex flex-col gap-4 rounded-2xl border border-white/5 p-5 transition-all duration-300 hover:border-white/10"
        >
          <div className="flex items-start justify-between">
            <div className="flex items-center gap-3">
              <div
                className={`bg-surface rounded-lg border border-white/5 p-2 ${
                  sub.status === 'APPROVED'
                    ? 'text-green-500'
                    : sub.status === 'REJECTED'
                      ? 'text-red-500'
                      : 'text-yellow-500'
                }`}
              >
                {sub.status === 'APPROVED' && <CheckCircle2 className="h-4 w-4" />}
                {sub.status === 'REJECTED' && <XCircle className="h-4 w-4" />}
                {sub.status === 'PENDING' && <Clock className="h-4 w-4" />}
              </div>
              <div>
                <Link
                  href={`/submissions/${sub.id}`}
                  className="font-heading hover:text-primary text-base font-bold text-white transition-colors"
                >
                  {sub.authorName || 'Anonymous'}
                </Link>
                <div className="text-muted mt-0.5 font-mono text-xs">
                  {new Date(sub.createdAt).toLocaleDateString()}
                </div>
              </div>
            </div>

            <Link
              href={sub.repoUrl}
              target="_blank"
              className="text-muted hover:text-primary -mr-2 p-2 transition-colors"
            >
              <Icons.gitHub className="h-5 w-5" />
            </Link>
          </div>

          <div className="mt-1 flex flex-wrap items-center gap-2">
            <div className="text-muted-foreground rounded-md border border-white/5 bg-white/5 px-2.5 py-1 font-mono text-xs">
              {sub.baseModel}
            </div>
            <div className="text-muted-foreground rounded-md border border-white/5 bg-white/5 px-2.5 py-1 font-mono text-xs">
              {sub.codingTool}
            </div>
            <div className="ml-auto">
              <LikeButton
                submissionId={sub.id}
                initialLiked={sub.likedByCurrentUser}
                initialCount={sub.likeCount}
                userId={currentUserId}
              />
            </div>
          </div>
        </div>
      ))}
    </div>
  );
}
