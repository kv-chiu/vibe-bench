import 'dotenv/config';
import { prisma } from '../src/lib/prisma';
import { Prisma, SubmissionStatus } from '../src/generated/prisma/client';

async function main() {
  console.log('🌱 Starting seed...');

  // 1. Create System Admin User
  const adminEmail = process.env.ADMIN_EMAILS
    ? process.env.ADMIN_EMAILS.split(',')[0]
    : 'admin@vibebench.ai';
  console.log(`Creating/Updating admin: ${adminEmail}`);

  const adminUser = await prisma.user.upsert({
    where: { email: adminEmail },
    update: {},
    create: {
      email: adminEmail,
      name: 'VibeBench System',
      image: 'https://avatars.githubusercontent.com/u/12345678?v=4',
      emailVerified: true,
      createdAt: new Date(),
      updatedAt: new Date(),
    },
  });

  console.log(`👤 System user ensured: ${adminUser.email}`);

  // 2. Create Benchmarks with strict typing
  const benchmarks: Prisma.BenchmarkCreateInput[] = [
    {
      title: 'Python Data Analysis Agent',
      description:
        'Build a Python agent capable of loading a CSV, cleaning data, and generating matplotlib visualizations based on natural language queries.',
      isActive: true,
      createdBy: { connect: { id: adminUser.id } },
      submissions: {
        create: [
          {
            baseModel: 'gpt-4-turbo',
            codingTool: 'cursor',
            repoUrl: 'https://github.com/example/python-agent',
            status: SubmissionStatus.APPROVED,
            authorName: 'DevOne',
            plugins: [],
            chatLogFiles: [],
            userId: adminUser.id,
          },
          {
            baseModel: 'claude-3.5-sonnet',
            codingTool: 'windsurf',
            repoUrl: 'https://github.com/example/sonnet-agent',
            status: SubmissionStatus.APPROVED,
            authorName: 'DevTwo',
            plugins: [],
            chatLogFiles: [],
            userId: adminUser.id,
          },
        ],
      },
    },
    {
      title: 'React Dashboard Component',
      description:
        'Generate a responsive dashboard component using Tailwind CSS, including a sidebar, header, and data charts (Recharts). Must be fully typed.',
      isActive: true,
      createdBy: { connect: { id: adminUser.id } },
    },
    {
      title: 'Golang REST API Service',
      description:
        'Implement a high-performance REST API in Go using Gin or Chi. Requirements: JWT Auth, PostgreSQL integration, and >80% test coverage.',
      isActive: true,
      createdBy: { connect: { id: adminUser.id } },
    },
    {
      title: 'Legacy PHP Migration',
      description:
        'Refactor a legacy PHP 5.6 script to modern PHP 8.2, maintaining functionality while fixing security vulnerabilities.',
      isActive: false, // Archived
      createdBy: { connect: { id: adminUser.id } },
    },
    {
      title: 'Prompt Engineering Challenge',
      description:
        'Optimize a system prompt to make a local Llama 3 model output valid JSON consistently for complex reasoning tasks.',
      isActive: true,
      createdBy: { connect: { id: adminUser.id } },
    },
  ];

  for (const data of benchmarks) {
    const benchmark = await prisma.benchmark.upsert({
      where: { id: data.title.toLowerCase().replace(/\s+/g, '-') },
      update: {}, // No updates, just ensure existence
      create: data,
    });
    console.log(`✅ Benchmark upserted: ${benchmark.title}`);
  }

  console.log('🌱 Seed finished.');
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async (e) => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
