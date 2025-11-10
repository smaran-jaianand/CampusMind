import { Logo } from '@/components/logo';

export default function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <div className="flex min-h-screen flex-col items-center justify-center bg-muted/40 p-4">
      <div className="mb-8 flex items-center gap-2 text-primary">
        <Logo className="h-10 w-10" />
        <h1 className="font-headline text-3xl">CampusMind</h1>
      </div>
      {children}
    </div>
  );
}
