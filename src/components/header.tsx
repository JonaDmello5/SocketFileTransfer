'use client';

import { FileTerminal, Menu } from 'lucide-react';
import Link from 'next/link';
import { Button } from './ui/button';
import { ThemeSwitcher } from './theme-switcher';
import { Sheet, SheetContent, SheetTrigger } from './ui/sheet';
import { usePathname } from 'next/navigation';

export default function Header() {
  const pathname = usePathname();

  const navLinks = [
    { href: '/dashboard', label: 'Dashboard' },
    { href: '/setup', label: 'Setup Guide' },
  ];

  const NavContent = () => (
    <>
      {navLinks.map((link) => (
        <Button key={link.href} variant={pathname === link.href ? 'secondary' : 'ghost'} asChild>
          <Link href={link.href}>{link.label}</Link>
        </Button>
      ))}
    </>
  );

  return (
    <header className="sticky top-0 z-50 w-full border-b bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
      <div className="container flex h-16 items-center">
        <div className="mr-4 hidden md:flex">
          <Link href="/" className="mr-6 flex items-center space-x-2">
            <FileTerminal className="h-6 w-6 text-primary" />
            <span className="hidden font-bold sm:inline-block font-headline">SocketFileTransfer</span>
          </Link>
          <nav className="flex items-center space-x-6 text-sm font-medium">
            <NavContent />
          </nav>
        </div>

        <Sheet>
          <SheetTrigger asChild>
            <Button variant="ghost" size="icon" className="md:hidden">
              <Menu className="h-5 w-5" />
              <span className="sr-only">Toggle Menu</span>
            </Button>
          </SheetTrigger>
          <SheetContent side="left" className="pr-0">
            <Link href="/" className="mr-6 flex items-center space-x-2 mb-6">
              <FileTerminal className="h-6 w-6 text-primary" />
              <span className="font-bold font-headline">SocketFileTransfer</span>
            </Link>
            <div className="flex flex-col space-y-3">
              <NavContent />
            </div>
          </SheetContent>
        </Sheet>
        
        <div className="flex flex-1 items-center justify-end space-x-4">
          <ThemeSwitcher />
        </div>
      </div>
    </header>
  );
}
