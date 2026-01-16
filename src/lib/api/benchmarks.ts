import { prisma } from '@/lib/prisma';
import { type Benchmark } from '@/generated/prisma/client';

export type BenchmarkWithUser = Benchmark & {
  createdBy: {
    name: string | null;
    image: string | null;
  };
  _count: {
    submissions: number;
  };
};

export async function getBenchmarks() {
  const benchmarks = await prisma.benchmark.findMany({
    where: {
      isActive: true,
    },
    include: {
      createdBy: {
        select: {
          name: true,
          image: true,
        },
      },
      _count: {
        select: {
          submissions: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return benchmarks;
}

export async function getAdminBenchmarks() {
  const benchmarks = await prisma.benchmark.findMany({
    include: {
      createdBy: {
        select: {
          name: true,
          image: true,
        },
      },
      _count: {
        select: {
          submissions: true,
        },
      },
    },
    orderBy: {
      createdAt: 'desc',
    },
  });

  return benchmarks;
}

export async function getBenchmarkById(id: string) {
  const benchmark = await prisma.benchmark.findUnique({
    where: { id },
    include: {
      createdBy: {
        select: {
          name: true,
          image: true,
        },
      },
      submissions: {
        orderBy: {
          createdAt: 'desc',
        },
        select: {
          id: true,
          status: true,
          repoUrl: true,
          createdAt: true,
          authorName: true,
          baseModel: true,
          codingTool: true,
          likeCount: true,
        },
      },
      _count: {
        select: {
          submissions: true,
        },
      },
    },
  });

  return benchmark;
}
