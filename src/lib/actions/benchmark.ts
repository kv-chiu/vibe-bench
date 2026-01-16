'use server';

import { auth } from '@/lib/auth';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { headers } from 'next/headers';

/**
 * Check if current user is admin
 */
async function requireAdmin() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || session.user.role !== 'ADMIN') {
    throw new Error('Unauthorized');
  }

  return session;
}

/**
 * Create a new benchmark
 */
export async function createBenchmark(formData: FormData) {
  const session = await requireAdmin();

  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const requirementDoc = formData.get('requirementDoc') as string;
  const prototypeUrl = formData.get('prototypeUrl') as string;
  const userStories = formData.get('userStories') as string;

  if (!title) {
    return { success: false, error: 'Title is required' };
  }

  try {
    const benchmark = await prisma.benchmark.create({
      data: {
        title,
        description: description || null,
        requirementDoc: requirementDoc || null,
        prototypeUrl: prototypeUrl || null,
        userStories: userStories || null,
        isActive: true,
        createdById: session.user.id,
      },
    });

    revalidatePath('/benchmarks');
    revalidatePath('/admin');

    return { success: true, benchmarkId: benchmark.id };
  } catch (error) {
    console.error('Failed to create benchmark:', error);
    return { success: false, error: 'Failed to create benchmark' };
  }
}

/**
 * Update an existing benchmark
 */
export async function updateBenchmark(id: string, formData: FormData) {
  await requireAdmin();

  const title = formData.get('title') as string;
  const description = formData.get('description') as string;
  const requirementDoc = formData.get('requirementDoc') as string;
  const prototypeUrl = formData.get('prototypeUrl') as string;
  const userStories = formData.get('userStories') as string;
  const isActive = formData.get('isActive') === 'true';

  if (!title) {
    return { success: false, error: 'Title is required' };
  }

  try {
    await prisma.benchmark.update({
      where: { id },
      data: {
        title,
        description: description || null,
        requirementDoc: requirementDoc || null,
        prototypeUrl: prototypeUrl || null,
        userStories: userStories || null,
        isActive,
      },
    });

    revalidatePath('/benchmarks');
    revalidatePath('/admin');

    return { success: true };
  } catch (error) {
    console.error('Failed to update benchmark:', error);
    return { success: false, error: 'Failed to update benchmark' };
  }
}

/**
 * Delete a benchmark
 */
export async function deleteBenchmark(id: string) {
  await requireAdmin();

  try {
    await prisma.benchmark.delete({
      where: { id },
    });

    revalidatePath('/benchmarks');
    revalidatePath('/admin');

    return { success: true };
  } catch (error) {
    console.error('Failed to delete benchmark:', error);
    return { success: false, error: 'Failed to delete benchmark' };
  }
}
