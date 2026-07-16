import React, { useState, useEffect } from 'react';
import { Link, useLocation } from 'wouter';
import { Search, Moon, Sun, Menu, X } from 'lucide-react';
import { useTheme } from './ThemeProvider';
import { cn } from '@/lib/utils';

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const { theme, setTheme } = useTheme();
  const [location] = useLocation();

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 20);
    window.addEventListener('scroll', handleScroll, { passive: true });
    return () => window.removeEventListener('scroll', handleScroll);
  }, []);

  const navLinks = [
    { name: 'Home', path: '/' },
    { name: 'Explore', path: '/explore' },
  ];

  return (
    <>
      <header
        className="fixed top-0 left-0 right-0 z-50 border-b border-transparent"
        style={{
          // 400ms backdrop + background — no CSS class easing that snaps
          transition:
            'background-color 400ms cubic-bezier(0.22,1,0.36,1), backdrop-filter 400ms cubic-bezier(0.22,1,0.36,1), box-shadow 400ms cubic-bezier(0.22,1,0.36,1), border-color 400ms cubic-bezier(0.22,1,0.36,1), padding 400ms cubic-bezier(0.22,1,0.36,1)',
          backgroundColor: scrolled ? 'hsl(var(--background) / 0.82)' : 'transparent',
          backdropFilter: scrolled ? 'blur(14px) saturate(1.4)' : 'blur(0px)',
          boxShadow: scrolled ? '0 1px 24px rgba(50,35,25,0.07)' : 'none',
          borderBottomColor: scrolled ? 'hsl(var(--border))' : 'transparent',
          paddingTop: scrolled ? '1rem' : '1.5rem',
          paddingBottom: scrolled ? '1rem' : '1.5rem',
        }}
      >
        <div className="max-w-[1280px] mx-auto px-6 flex items-center justify-between">
          <Link
            href="/"
            className="text-2xl font-serif font-bold text-primary dark:text-primary-foreground tracking-tight"
            style={{ transition: 'opacity 350ms cubic-bezier(0.22,1,0.36,1)' }}
            onMouseEnter={e => ((e.currentTarget as HTMLElement).style.opacity = '0.7')}
            onMouseLeave={e => ((e.currentTarget as HTMLElement).style.opacity = '1')}
          >
            Coffee Diaries
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8">
            <div className="flex gap-6">
              {navLinks.map(link => (
                <Link
                  key={link.path}
                  href={link.path}
                  data-testid={`link-nav-${link.name.toLowerCase()}`}
                  className={cn(
                    'text-sm font-medium tracking-wide relative',
                    // Underline expands left → right, 350ms
                    'after:absolute after:-bottom-1 after:left-0 after:h-[1.5px] after:bg-primary after:origin-left',
                    'after:transition-[transform,opacity] after:duration-[350ms] after:[transition-timing-function:cubic-bezier(0.22,1,0.36,1)]',
                    location === link.path
                      ? 'text-primary after:scale-x-100 after:opacity-100 after:w-full'
                      : 'text-foreground/75 after:scale-x-0 after:opacity-0 after:w-full hover:after:scale-x-100 hover:after:opacity-100',
                  )}
                  style={{ transition: 'color 350ms cubic-bezier(0.22,1,0.36,1)' }}
                >
                  {link.name}
                </Link>
              ))}
            </div>

            <div className="flex items-center gap-4 border-l border-border pl-6">
              <Link
                href="/explore"
                className="text-foreground/75"
                style={{ transition: 'color 350ms cubic-bezier(0.22,1,0.36,1)' }}
                onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = 'hsl(var(--primary))')}
                onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = '')}
              >
                <Search size={20} strokeWidth={1.5} />
              </Link>
              <button
                onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
                className="text-foreground/75"
                style={{ transition: 'color 350ms cubic-bezier(0.22,1,0.36,1)' }}
                onMouseEnter={e => ((e.currentTarget as HTMLElement).style.color = 'hsl(var(--primary))')}
                onMouseLeave={e => ((e.currentTarget as HTMLElement).style.color = '')}
                aria-label="Toggle theme"
              >
                {theme === 'dark' ? (
                  <Sun size={20} strokeWidth={1.5} />
                ) : (
                  <Moon size={20} strokeWidth={1.5} />
                )}
              </button>
            </div>
          </nav>

          {/* Mobile Toggle */}
          <div className="flex items-center gap-4 md:hidden">
            <button
              onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
              className="text-foreground/75"
              style={{ transition: 'color 350ms cubic-bezier(0.22,1,0.36,1)' }}
            >
              {theme === 'dark' ? <Sun size={20} /> : <Moon size={20} />}
            </button>
            <button
              onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
              className="text-foreground/75"
              style={{ transition: 'color 350ms cubic-bezier(0.22,1,0.36,1)' }}
            >
              {mobileMenuOpen ? <X size={24} /> : <Menu size={24} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-40 bg-background pt-24 px-6 md:hidden">
          <nav className="flex flex-col gap-6 text-xl font-serif">
            {navLinks.map(link => (
              <Link
                key={link.path}
                href={link.path}
                onClick={() => setMobileMenuOpen(false)}
                className={cn(
                  'pb-4 border-b border-border',
                  location === link.path ? 'text-primary font-bold' : 'text-foreground/75',
                )}
                style={{ transition: 'color 350ms cubic-bezier(0.22,1,0.36,1)' }}
              >
                {link.name}
              </Link>
            ))}
          </nav>
        </div>
      )}
    </>
  );
}
