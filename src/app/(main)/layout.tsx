'use client';

import * as React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from '@/components/ui/alert-dialog';
import {
  Bot,
  CalendarDays,
  Library,
  MessagesSquare,
  PanelLeft,
  User,
  Shield,
  Siren,
  CalendarCheck,
  FileText,
} from 'lucide-react';
import { Logo } from '@/components/logo';
import { Button } from '@/components/ui/button';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { cn } from '@/lib/utils';
import { useAuth } from '@/context/auth-context';
import { useRouter } from 'next/navigation';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { sendSupportEmail } from '../actions';
import { useToast } from '@/hooks/use-toast';
import { Textarea } from '@/components/ui/textarea';

const navItems = [
  { href: '/', label: 'AI First-Aid', icon: Bot },
  { href: '/scheduling', label: 'Scheduling AI', icon: CalendarCheck },
  { href: '/consultations', label: 'Consultations', icon: FileText },
  { href: '/booking', label: 'Booking', icon: CalendarDays },
  { href: '/resources', label: 'Resource Hub', icon: Library },
  { href: '/forum', label: 'Forum', icon: MessagesSquare },
  { href: '/profile', label: 'Profile', icon: User },
  { href: '/admin', label: 'Admin', icon: Shield },
];

function EmergencyDialog({ isMobile = false }: { isMobile?: boolean }) {
  const { toast } = useToast();
  const [isPending, startTransition] = React.useTransition();
  const { user } = useAuth();
  const [open, setOpen] = React.useState(false);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    const formData = new FormData(event.currentTarget);
    
    // Add user's email to the form data
    if (user?.email) {
      formData.append('fromEmail', user.email);
    }
    
    startTransition(async () => {
      const result = await sendSupportEmail(formData);
      if (result.success) {
        toast({
          title: 'Email Sent!',
          description: 'Your request for support has been sent successfully.',
        });
        setOpen(false);
      } else {
        toast({
          variant: 'destructive',
          title: 'Failed to Send Email',
          description: result.message,
        });
      }
    });
  };

  return (
    <AlertDialog open={open} onOpenChange={setOpen}>
      <AlertDialogTrigger asChild>
        {isMobile ? (
          <Button variant="destructive" size="icon">
            <Siren className="h-5 w-5" />
            <span className="sr-only">SOS</span>
          </Button>
        ) : (
          <Button variant="destructive" className="w-full">
            <Siren className="mr-2 h-4 w-4" />
            SOS - Immediate Help
          </Button>
        )}
      </AlertDialogTrigger>
      <AlertDialogContent>
        <form onSubmit={handleSubmit}>
          <AlertDialogHeader>
            <AlertDialogTitle>Request Immediate Support</AlertDialogTitle>
            <AlertDialogDescription>
              This will send an email to the support team on your behalf. Please describe your situation.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <div className="py-4 space-y-4">
             <div className="grid gap-2">
              <Label htmlFor="toEmail">Support Email</Label>
              <Input 
                id="toEmail"
                name="toEmail"
                type="email"
                defaultValue="support@campus.test"
                placeholder="Enter support email"
                required
              />
             </div>
             <div className="grid gap-2">
              <Label htmlFor="subject">Subject</Label>
              <Input 
                id="subject"
                name="subject"
                defaultValue="Urgent Support Needed"
                placeholder="Subject"
                required
              />
             </div>
            <div className="grid gap-2">
              <Label htmlFor="body">Message</Label>
              <Textarea 
                id="body"
                name="body"
                placeholder="Please describe your situation..."
                required
                rows={4}
              />
            </div>
          </div>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <Button type="submit" disabled={isPending}>
              {isPending ? 'Sending...' : 'Send Support Email'}
            </Button>
          </AlertDialogFooter>
        </form>
      </AlertDialogContent>
    </AlertDialog>
  );
}


export default function MainLayout({ children }: { children: React.ReactNode }) {
  const pathname = usePathname();
  const { user, loading } = useAuth();
  const router = useRouter();

  // The middleware now handles authentication checks, so the redirect logic here is removed.
  // We can still show a loading screen while the initial user state is being determined.
  if (loading) {
    return (
        <div className="flex h-screen w-full items-center justify-center">
            <div className="flex flex-col items-center gap-4">
                <Logo className="h-12 w-12 text-primary animate-pulse" />
                <p className="text-muted-foreground">Loading your experience...</p>
            </div>
      </div>
    );
  }


  const NavLinks = () => (
    <nav className="grid items-start gap-2 text-sm font-medium">
      {navItems.map(({ href, label, icon: Icon }) => (
        <Link
          key={label}
          href={href}
          className={cn(
            'flex items-center gap-3 rounded-lg px-3 py-2 text-muted-foreground transition-all hover:text-primary',
            { 'bg-accent text-primary': pathname === href }
          )}
        >
          <Icon className="h-4 w-4" />
          {label}
        </Link>
      ))}
    </nav>
  );

  return (
    <div className="grid min-h-screen w-full md:grid-cols-[220px_1fr] lg:grid-cols-[280px_1fr]">
      <div className="hidden border-r bg-muted/40 md:block">
        <div className="flex h-full max-h-screen flex-col gap-2">
          <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
            <Link href="/" className="flex items-center gap-2 font-semibold">
              <Logo className="h-8 w-8 text-primary" />
              <span className="font-headline text-lg">CampusMind</span>
            </Link>
          </div>
          <div className="flex-1 overflow-y-auto">
            <div className="grid items-start p-2 text-sm font-medium lg:p-4">
              <NavLinks />
            </div>
          </div>
           <div className="mt-auto p-4">
            <EmergencyDialog />
          </div>
        </div>
      </div>
      <div className="flex flex-col">
        <header className="flex h-14 items-center gap-4 border-b bg-muted/40 px-4 lg:h-[60px] lg:px-6 md:hidden">
          <Sheet>
            <SheetTrigger asChild>
              <Button variant="outline" size="icon" className="shrink-0">
                <PanelLeft className="h-5 w-5" />
                <span className="sr-only">Toggle navigation menu</span>
              </Button>
            </SheetTrigger>
            <SheetContent side="left" className="flex flex-col">
              <div className="flex h-14 items-center border-b px-4 lg:h-[60px] lg:px-6">
                <Link
                  href="/"
                  className="flex items-center gap-2 font-semibold"
                >
                  <Logo className="h-8 w-8 text-primary" />
                  <span className="font-headline text-lg">CampusMind</span>
                </Link>
              </div>
              <div className="mt-4 flex-1 overflow-y-auto">
                <NavLinks />
              </div>
              <div className="mt-auto p-4">
                <EmergencyDialog />
              </div>
            </SheetContent>
          </Sheet>
           <div className="flex items-center gap-2 font-semibold">
              <Logo className="h-8 w-8 text-primary md:hidden" />
              <span className="font-headline text-lg md:hidden">CampusMind</span>
            </div>
             <div className="ml-auto">
                <EmergencyDialog isMobile={true} />
            </div>
        </header>
        <main className="flex-1 overflow-auto p-4 sm:p-6 md:p-8">
          {children}
        </main>
      </div>
    </div>
  );
}
