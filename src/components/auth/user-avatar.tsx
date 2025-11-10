
'use client';

import type { User } from 'firebase/auth';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { cn } from '@/lib/utils';
import { User as UserIcon } from 'lucide-react';
import { useAuth } from '@/context/auth-context';

type UserAvatarProps = {
  user?: User | null;
  className?: string;
};

export function UserAvatar({ user: userProp, className }: UserAvatarProps) {
  const { user: authUser } = useAuth();
  const user = userProp === undefined ? authUser : userProp;

  if (!user) {
    return (
      <Avatar className={cn('border-2 border-primary/50', className)}>
        <AvatarFallback>
          <UserIcon className="text-primary" />
        </AvatarFallback>
      </Avatar>
    );
  }

  const fallback = user.displayName
    ? user.displayName.charAt(0).toUpperCase()
    : user.email
    ? user.email.charAt(0).toUpperCase()
    : '?';

  return (
    <Avatar className={className}>
      {user.photoURL && <AvatarImage src={user.photoURL} alt={user.displayName || 'User'} />}
      <AvatarFallback>{fallback}</AvatarFallback>
    </Avatar>
  );
}
