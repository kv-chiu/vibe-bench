import { prisma } from '@/lib/prisma';

export async function getAllSubmissions() {
  const submissions = await prisma.submission.findMany({
    where: {
      status: 'APPROVED',
    },
    include: {
      benchmark: {
        select: {
          id: true,
          title: true,
        },
      },
      user: {
        select: {
          name: true,
          image: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return submissions;
}

export async function getSubmissionById(id: string) {
  const submission = await prisma.submission.findUnique({
    where: { id },
    include: {
      benchmark: {
        select: {
          id: true,
          title: true,
          description: true,
        },
      },
      user: {
        select: {
          name: true,
          image: true,
        },
      },
    },
  });

  return submission;
}
