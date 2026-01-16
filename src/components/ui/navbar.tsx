import { auth } from '@/lib/auth';
import { headers } from 'next/headers';
import { NavbarClient } from './navbar-client';
import { prisma } from '@/lib/prisma';

export async function Navbar() {
  const session = await auth.api.getSession({
    headers: await headers(),
  });

  // Fetch the latest role from the database to ensure we have the correct permissions
  // The session object might not always have the up-to-date role from better-auth defaults
  let sessionWithRole = session;

  if (session?.user?.id) {
    const user = await prisma.user.findUnique({
      where: { id: session.user.id },
      select: { role: true },
    });

    if (user) {
      sessionWithRole = {
        ...session,
        user: {
          ...session.user,
          role: user.role || 'USER',
        },
      };
    }
  }

  return <NavbarClient session={sessionWithRole} />;
}
