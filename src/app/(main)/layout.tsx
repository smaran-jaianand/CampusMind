
'use client';

import Link from 'next/link';
import {
  Book,
  Bot,
  LifeBuoy,
  MessageSquare,
  PanelLeft,
  Settings,
  ShieldCheck,
  User,
} from 'lucide-react';

import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
  SidebarInset,
  SidebarMenu,
  SidebarMenuButton,
  SidebarMenuItem,
  SidebarProvider,
  SidebarTrigger,
} from '@/components/ui/sidebar';
import { useAuth } from '@/context/auth-context';
import { Logo } from '@/components/logo';
import { UserAvatar } from '@/components/auth/user-avatar';
import { usePathname } from 'next/navigation';
import { ThemeToggle } from '@/components/theme-toggle';

const navItems = [
  { href: '/chat', icon: MessageSquare, label: 'AI First-Aid' },
  { href: '/booking', icon: Book, label: 'Booking' },
  { href: '/resources', icon: LifeBuoy, label: 'Resources' },
  { href: '/forum', icon: Bot, label: 'Forum' },
  { href: '/admin', icon: ShieldCheck, label: 'Admin', adminOnly: true },
];

export default function MainLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const { user } = useAuth();
  const pathname = usePathname();
  const isAdmin = user?.email === 'admin@mannan.app';

  return (
    <SidebarProvider>
      <Sidebar side="left" variant="sidebar" collapsible="offcanvas">
        <SidebarHeader className="border-b">
          <div className="flex w-full items-center justify-between p-2">
            <Link href="/chat" className="flex items-center gap-2">
              <Logo className="h-8 w-8 text-primary" />
              <span className="font-headline text-xl">Mannan</span>
            </Link>
            <ThemeToggle />
          </div>
        </SidebarHeader>
        <SidebarContent className="p-2">
          <SidebarMenu>
            {navItems.map(
              (item) =>
                (!item.adminOnly || isAdmin) && (
                  <SidebarMenuItem key={item.href}>
                    <SidebarMenuButton
                      asChild
                      isActive={pathname.startsWith(item.href)}
                    >
                      <Link href={item.href}>
                        <item.icon />
                        <span>{item.label}</span>
                      </Link>
                    </SidebarMenuButton>
                  </SidebarMenuItem>
                )
            )}
          </SidebarMenu>
        </SidebarContent>
        <div className="mt-auto flex flex-col gap-2 p-2">
          <SidebarMenu>
            <SidebarMenuItem>
              <SidebarMenuButton asChild isActive={pathname.startsWith('/profile')}>
                <Link href="/profile">
                  <UserAvatar />
                  <span className="truncate">
                    {user?.displayName || user?.email || 'Profile'}
                  </span>
                </Link>
              </SidebarMenuButton>
            </SidebarMenuItem>
          </SidebarMenu>
        </div>
      </Sidebar>
      <SidebarInset>
        <header className="flex h-14 w-full items-center justify-between border-b bg-background/95 px-4 backdrop-blur supports-[backdrop-filter]:bg-background/60 md:hidden">
          <Link href="/chat" className="flex items-center gap-2">
            <Logo className="h-6 w-6 text-primary" />
            <span className="font-headline text-lg">Mannan</span>
          </Link>
          <SidebarTrigger>
            <PanelLeft />
          </SidebarTrigger>
        </header>
        {children}
      </SidebarInset>
    </SidebarProvider>
  );
}
