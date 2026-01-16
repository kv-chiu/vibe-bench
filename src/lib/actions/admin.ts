'use server';

import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';

async function checkAdmin() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session || session.user.role !== 'ADMIN') {
    throw new Error('Unauthorized');
  }

  return session;
}

export async function approveSubmission(submissionId: string) {
  await checkAdmin();

  await prisma.submission.update({
    where: { id: submissionId },
    data: { status: 'APPROVED' },
  });

  revalidatePath('/admin');
  revalidatePath('/dashboard');
  revalidatePath('/benchmarks'); // Update public lists if needed
}

export async function rejectSubmission(submissionId: string) {
  await checkAdmin();

  await prisma.submission.update({
    where: { id: submissionId },
    data: { status: 'REJECTED' },
  });

  revalidatePath('/admin');
  revalidatePath('/dashboard');
}
