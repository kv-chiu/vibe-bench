import { betterAuth } from 'better-auth';
import { prismaAdapter } from 'better-auth/adapters/prisma';
import { prisma } from './prisma';
import { setGlobalDispatcher, ProxyAgent } from 'undici';

if (process.env.HTTPS_PROXY || process.env.HTTP_PROXY) {
  const proxyUrl = process.env.HTTPS_PROXY || process.env.HTTP_PROXY;
  if (proxyUrl) {
    const dispatcher = new ProxyAgent(proxyUrl);
    setGlobalDispatcher(dispatcher);
    console.log(`[Proxy] Global dispatcher set to use proxy: ${proxyUrl}`);
  }
}

const ALLOWED_ADMIN_EMAILS = (process.env.ADMIN_EMAILS || '').split(',').filter(Boolean);

export const auth = betterAuth({
  database: prismaAdapter(prisma, {
    provider: 'postgresql',
  }),
  socialProviders: {
    github: {
      clientId: process.env.GITHUB_CLIENT_ID!,
      clientSecret: process.env.GITHUB_CLIENT_SECRET!,
    },
  },
  session: {
    expiresIn: 60 * 60 * 24 * 7, // 7 days
    updateAge: 60 * 60 * 24, // 1 day
  },
  databaseHooks: {
    user: {
      create: {
        before: async (user) => {
          // Check if user should be admin
          const isAdmin = ALLOWED_ADMIN_EMAILS.includes(user.email);
          return {
            data: {
              ...user,
              role: isAdmin ? 'ADMIN' : 'USER',
            },
          };
        },
      },
    },
  },
  user: {
    additionalFields: {
      role: {
        type: 'string',
        required: false,
        defaultValue: 'USER',
      },
    },
  },
});

export type Session = typeof auth.$Infer.Session;
