'use server';

import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';
import crypto from 'crypto';

/**
 * Generate a fingerprint for anti-spam protection
 * Combines IP address and User-Agent to create a unique hash
 */
async function generateFingerprint(userId?: string): Promise<string> {
  const headersList = await headers();
  const ip = headersList.get('x-forwarded-for') || headersList.get('x-real-ip') || 'unknown';
  const userAgent = headersList.get('user-agent') || 'unknown';

  // If user is logged in, include userId for stronger fingerprint
  const fingerprintSource = userId ? `${userId}-${ip}-${userAgent}` : `${ip}-${userAgent}`;

  return crypto.createHash('sha256').update(fingerprintSource).digest('hex').slice(0, 32);
}

/**
 * Toggle like status for a submission
 * Returns the new like count and whether the user has liked
 */
export async function toggleLike(submissionId: string, userId?: string) {
  try {
    const fingerprint = await generateFingerprint(userId);

    // Check if already liked
    const existingLike = await prisma.like.findUnique({
      where: {
        submissionId_fingerprint: {
          submissionId,
          fingerprint,
        },
      },
    });

    if (existingLike) {
      // Unlike: Remove the like
      await prisma.$transaction([
        prisma.like.delete({
          where: { id: existingLike.id },
        }),
        prisma.submission.update({
          where: { id: submissionId },
          data: { likeCount: { decrement: 1 } },
        }),
      ]);

      revalidatePath('/benchmarks');
      revalidatePath('/dashboard');

      return { success: true, liked: false };
    } else {
      // Like: Add new like
      await prisma.$transaction([
        prisma.like.create({
          data: {
            submissionId,
            fingerprint,
          },
        }),
        prisma.submission.update({
          where: { id: submissionId },
          data: { likeCount: { increment: 1 } },
        }),
      ]);

      revalidatePath('/benchmarks');
      revalidatePath('/dashboard');

      return { success: true, liked: true };
    }
  } catch (error) {
    console.error('Failed to toggle like:', error);
    return { success: false, error: 'Failed to toggle like' };
  }
}

/**
 * Check if current user has liked a submission
 */
export async function checkLiked(submissionId: string, userId?: string): Promise<boolean> {
  try {
    const fingerprint = await generateFingerprint(userId);

    const like = await prisma.like.findUnique({
      where: {
        submissionId_fingerprint: {
          submissionId,
          fingerprint,
        },
      },
    });

    return !!like;
  } catch {
    return false;
  }
}
