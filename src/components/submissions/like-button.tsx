'use client';

import { useState, useTransition } from 'react';
import { Heart } from 'lucide-react';
import { toggleLike } from '@/lib/actions/like';
import { cn } from '@/lib/utils';

interface LikeButtonProps {
  submissionId: string;
  initialLiked: boolean;
  initialCount: number;
  userId?: string;
}

export function LikeButton({ submissionId, initialLiked, initialCount, userId }: LikeButtonProps) {
  const [liked, setLiked] = useState(initialLiked);
  const [count, setCount] = useState(initialCount);
  const [isPending, startTransition] = useTransition();

  const handleClick = () => {
    // Optimistic update
    const newLiked = !liked;
    setLiked(newLiked);
    setCount((prev) => (newLiked ? prev + 1 : prev - 1));

    startTransition(async () => {
      const result = await toggleLike(submissionId, userId);

      if (!result.success) {
        // Revert on failure
        setLiked(!newLiked);
        setCount((prev) => (newLiked ? prev - 1 : prev + 1));
      }
    });
  };

  return (
    <button
      onClick={handleClick}
      disabled={isPending}
      className={cn(
        'inline-flex items-center gap-1.5 rounded-full px-3 py-1.5 text-sm font-medium transition-all duration-200',
        'focus:ring-primary/50 border focus:ring-2 focus:outline-none',
        liked
          ? 'border-red-500/30 bg-red-500/10 text-red-500 hover:bg-red-500/20'
          : 'text-muted border-white/10 bg-white/5 hover:bg-white/10 hover:text-white',
        isPending && 'cursor-not-allowed opacity-50'
      )}
      title={liked ? 'Unlike' : 'Like'}
    >
      <Heart className={cn('h-4 w-4 transition-all', liked && 'scale-110 fill-current')} />
      <span className="tabular-nums">{count}</span>
    </button>
  );
}
