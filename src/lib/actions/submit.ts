'use server';

import { z } from 'zod';
import { prisma } from '@/lib/prisma';
import { revalidatePath } from 'next/cache';
import { redirect } from 'next/navigation';
import { getLocale } from 'next-intl/server';

const submissionSchema = z
  .object({
    benchmarkId: z.string(),
    repoUrl: z.string().url('Please enter a valid URL'),
    baseModel: z.string().min(1, 'Base model is required'),
    codingTool: z.string().min(1, 'Coding tool is required'),
    plugins: z.string().min(1, "Plugins are required (enter 'None' if applicable)"),
    authorName: z.string().optional(),
    authorEmail: z.string().email('Invalid email').optional().or(z.literal('')),
    chatLogUrl: z.string().url('Invalid URL').optional().or(z.literal('')),
    chatLogText: z.string().optional(),
    chatLogFiles: z.array(z.string().url()).optional(),
  })
  .refine(
    (data) => {
      const hasUrl = !!data.chatLogUrl;
      const hasText = !!data.chatLogText;
      const hasFiles = data.chatLogFiles && data.chatLogFiles.length > 0;
      return hasUrl || hasText || hasFiles;
    },
    {
      message: 'At least one chat log (URL, Text, or File) is required',
      path: ['chatLogUrl'], // Show error on URL field mostly
    }
  );

export type State = {
  errors?: {
    repoUrl?: string[];
    baseModel?: string[];
    codingTool?: string[];
    plugins?: string[];
    authorName?: string[];
    authorEmail?: string[];
    chatLogUrl?: string[];
    chatLogText?: string[];
    chatLogFiles?: string[];
  };
  message?: string | null;
  fields?: Record<string, string | string[]>;
};

import { auth } from '@/lib/auth';
import { headers } from 'next/headers';

export async function submitSolution(prevState: State, formData: FormData) {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  if (!session) {
    return {
      message: 'You must be logged in to submit a solution.',
      fields: Object.fromEntries(formData.entries()) as Record<string, string>,
    };
  }

  const rawData = {
    benchmarkId: (formData.get('benchmarkId') as string) || '',
    repoUrl: (formData.get('repoUrl') as string) || '',
    baseModel: (formData.get('baseModel') as string) || '',
    codingTool: (formData.get('codingTool') as string) || '',
    plugins: (formData.get('plugins') as string) || '',
    authorName: (formData.get('authorName') as string) || session.user.name || 'Anonymous',
    authorEmail: (formData.get('authorEmail') as string) || session.user.email || '',
    chatLogUrl: (formData.get('chatLogUrl') as string) || '',
    chatLogText: (formData.get('chatLogText') as string) || '',
    chatLogFiles: formData.getAll('chatLogFiles') as string[],
  };

  const validatedFields = submissionSchema.safeParse(rawData);

  if (!validatedFields.success) {
    return {
      errors: validatedFields.error.flatten().fieldErrors,
      message: 'Validation Failed. Please check your inputs.',
      fields: {
        ...rawData,
        plugins: rawData.plugins, // preserve string for input
      },
    };
  }

  const {
    benchmarkId,
    repoUrl,
    baseModel,
    codingTool,
    plugins,
    authorName,
    authorEmail,
    chatLogUrl,
    chatLogText,
    chatLogFiles,
  } = validatedFields.data;

  try {
    await prisma.submission.create({
      data: {
        benchmarkId,
        repoUrl,
        baseModel,
        codingTool,
        // Split plugins by comma and trim
        plugins: plugins
          .split(',')
          .map((p) => p.trim())
          .filter(Boolean),
        authorName: authorName || null,
        authorEmail: authorEmail || null,
        chatLogUrl: chatLogUrl || null,
        chatLogText: chatLogText || null,
        chatLogFiles: chatLogFiles || [],
        userId: session.user.id,
        status: 'PENDING',
      },
    });
  } catch (error) {
    console.error('Database Error:', error);
    return {
      message: 'Database Error: Failed to Create Submission.',
    };
  }

  revalidatePath(`/benchmarks/${benchmarkId}`);
  const locale = await getLocale();
  redirect(`/${locale}/benchmarks/${benchmarkId}/submit/success`);
}
