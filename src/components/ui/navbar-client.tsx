'use client';

// use standard Link for logo? No, use i18n Link
import { Link as I18nLink, usePathname, useRouter } from '@/i18n/routing';
import { Button } from './button';
import { FileCode2, Languages, ChevronDown, Check } from 'lucide-react';
import { signIn, signOut } from '@/lib/auth-client';
import { cn } from '@/lib/utils';
import { Session } from '@/lib/auth';
import { useState } from 'react';
import { useLocale, useTranslations } from 'next-intl';

interface NavbarClientProps {
  session: Session | null;
}

export function NavbarClient({ session }: NavbarClientProps) {
  const t = useTranslations('Navbar');
  const locale = useLocale();
  const pathname = usePathname();
  const router = useRouter();

  const navItems = [
    { label: t('benchmarks'), href: '/benchmarks' },
    { label: t('submissions'), href: '/submissions' },
    { label: t('about'), href: '/about' },
  ];

  const [isSigningOut, setIsSigningOut] = useState(false);
  const [isLangMenuOpen, setIsLangMenuOpen] = useState(false);

  // Function to switch language
  const switchLanguage = (newLocale: string) => {
    router.replace(pathname, { locale: newLocale });
    setIsLangMenuOpen(false);
  };

  const handleSignOut = async () => {
    try {
      setIsSigningOut(true);
      await signOut();
      router.refresh();
      router.push('/');
    } catch (error) {
      console.error('Sign out failed', error);
    } finally {
      setIsSigningOut(false);
    }
  };

  return (
    <nav className="bg-background/50 fixed top-0 right-0 left-0 z-50 border-b border-white/5 backdrop-blur-xl">
      <div className="container mx-auto flex h-16 items-center justify-between px-4 sm:px-8">
        {/* Logo */}
        <I18nLink href="/" className="group flex items-center gap-2">
          <div className="bg-primary/20 border-primary/50 group-hover:shadow-glow-orange flex h-8 w-8 items-center justify-center rounded-lg border transition-all duration-300">
            <FileCode2 className="text-primary h-5 w-5" />
          </div>
          <span className="font-heading group-hover:text-primary text-lg font-bold tracking-tight text-white transition-colors">
            VibeBench
            <span className="text-primary">.ai</span>
          </span>
        </I18nLink>

        {/* Desktop Nav */}
        <div className="hidden items-center gap-8 md:flex">
          {navItems.map((item) => (
            <I18nLink
              key={item.href}
              href={item.href}
              className={cn(
                'hover:text-primary text-sm font-medium transition-colors',
                pathname === item.href ? 'text-primary' : 'text-muted'
              )}
            >
              {item.label}
            </I18nLink>
          ))}
        </div>

        {/* Auth / Actions - Fixed width containers to prevent layout shift */}
        <div className="flex items-center gap-3">
          {/* Language Dropdown - Fixed 90px */}
          <div className="relative w-[90px]">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsLangMenuOpen(!isLangMenuOpen)}
              className="text-muted w-full justify-between px-3 hover:text-white"
            >
              <Languages className="h-4 w-4 shrink-0" />
              <span className="flex-1 text-center">{locale === 'en' ? 'EN' : '中文'}</span>
              <ChevronDown
                className={cn(
                  'h-3 w-3 shrink-0 opacity-50 transition-transform',
                  isLangMenuOpen && 'rotate-180'
                )}
              />
            </Button>

            {isLangMenuOpen && (
              <>
                {/* Backdrop to close menu */}
                <div className="fixed inset-0 z-40" onClick={() => setIsLangMenuOpen(false)} />
                <div className="absolute top-full right-0 z-50 mt-2 w-32 overflow-hidden rounded-lg border border-white/10 bg-[#0A0A0A] py-1 shadow-xl">
                  <button
                    onClick={() => switchLanguage('en')}
                    className="flex w-full items-center justify-between px-4 py-2 text-left text-sm text-gray-300 hover:bg-white/5 hover:text-white"
                  >
                    <span>English</span>
                    {locale === 'en' && <Check className="text-primary h-3 w-3" />}
                  </button>
                  <button
                    onClick={() => switchLanguage('zh')}
                    className="flex w-full items-center justify-between px-4 py-2 text-left text-sm text-gray-300 hover:bg-white/5 hover:text-white"
                  >
                    <span>中文</span>
                    {locale === 'zh' && <Check className="text-primary h-3 w-3" />}
                  </button>
                </div>
              </>
            )}
          </div>

          {session ? (
            <div className="flex items-center gap-3">
              {/* Sign Out - Fixed 100px */}
              <div className="hidden w-[100px] sm:block">
                <Button
                  variant="ghost"
                  size="sm"
                  className="w-full justify-center whitespace-nowrap"
                  onClick={handleSignOut}
                  disabled={isSigningOut}
                >
                  {isSigningOut ? t('signingOut') : t('signOut')}
                </Button>
              </div>

              {/* Dashboard - Fixed 100px */}
              <div className="w-[100px]">
                <I18nLink href="/dashboard" className="block">
                  <Button
                    variant={pathname === '/dashboard' ? 'primary' : 'ghost'}
                    size="sm"
                    className="w-full justify-center"
                  >
                    {t('dashboard')}
                  </Button>
                </I18nLink>
              </div>

              {/* Admin - Fixed 80px */}
              {session.user.role === 'ADMIN' && (
                <div className="w-[80px]">
                  <I18nLink href="/admin" className="block">
                    <Button
                      variant={pathname === '/admin' ? 'primary' : 'ghost'}
                      size="sm"
                      className={cn(
                        'w-full justify-center',
                        pathname === '/admin' ? '' : 'text-red-400 hover:text-red-300'
                      )}
                    >
                      {t('admin')}
                    </Button>
                  </I18nLink>
                </div>
              )}
            </div>
          ) : (
            /* Sign In - Fixed 80px */
            <div className="w-[80px]">
              <Button
                variant="outline"
                size="sm"
                className="w-full justify-center"
                onClick={() => signIn.social({ provider: 'github' })}
              >
                {t('signIn')}
              </Button>
            </div>
          )}
        </div>
      </div>
    </nav>
  );
}
