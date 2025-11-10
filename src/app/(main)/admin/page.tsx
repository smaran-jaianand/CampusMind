
// src/app/(main)/admin/page.tsx
'use client';
import { useEffect, useState } from 'react';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Switch } from '@/components/ui/switch';
import { getAllUsers, updateUserDisabledStatus } from '@/app/actions';
import { useAuth } from '@/context/auth-context';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UserAvatar } from '@/components/auth/user-avatar';
import { Skeleton } from '@/components/ui/skeleton';
import { useToast } from '@/hooks/use-toast';

type UserRecord = {
  uid: string;
  email?: string;
  displayName?: string;
  photoURL?: string;
  disabled: boolean;
};

export default function AdminPage() {
  const { user: currentUser } = useAuth();
  const [users, setUsers] = useState<UserRecord[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
   const { toast } = useToast();

  useEffect(() => {
    async function fetchUsers() {
      try {
        setLoading(true);
        const fetchedUsers = await getAllUsers();
        setUsers(fetchedUsers);
      } catch (err: any) {
        setError(err.message || 'Failed to fetch users.');
      } finally {
        setLoading(false);
      }
    }
    if (currentUser?.email === 'admin@campusmind.app') {
      fetchUsers();
    }
  }, [currentUser]);

  const handleUserToggle = async (uid: string, disabled: boolean) => {
    try {
        setUsers(users.map(u => u.uid === uid ? {...u, disabled: disabled} : u));
        await updateUserDisabledStatus(uid, disabled);
        toast({
            title: 'Success',
            description: `User has been ${disabled ? 'disabled' : 'enabled'}.`
        });
    } catch (err: any) {
        setUsers(users.map(u => u.uid === uid ? {...u, disabled: !disabled} : u));
        toast({
            variant: 'destructive',
            title: 'Error',
            description: err.message || 'Failed to update user status.'
        });
    }
  };


  if (currentUser?.email !== 'admin@campusmind.app') {
    return (
      <main className="flex flex-1 flex-col items-center justify-center gap-4 p-4 lg:gap-6 lg:p-6">
         <Card className="w-full max-w-lg text-center">
            <CardHeader>
                <CardTitle>Access Denied</CardTitle>
                <CardDescription>
                You do not have permission to view this page.
                </CardDescription>
            </CardHeader>
            <CardContent>
                <p>Please contact an administrator if you believe this is an error.</p>
            </CardContent>
         </Card>
      </main>
    );
  }

  if (error) {
     return (
      <main className="flex flex-1 flex-col items-center justify-center gap-4 p-4 lg:gap-6 lg:p-6">
         <Card className="w-full max-w-lg text-center border-destructive">
            <CardHeader>
                <CardTitle>An Error Occurred</CardTitle>
            </CardHeader>
            <CardContent>
                <p className='text-destructive'>{error}</p>
            </CardContent>
         </Card>
      </main>
    );
  }

  return (
    <main className="flex flex-1 flex-col gap-4 p-4 lg:gap-6 lg:p-6">
      <div className="flex items-center">
        <h1 className="text-lg font-semibold md:text-2xl">Admin Dashboard</h1>
      </div>
      <Card>
        <CardHeader>
          <CardTitle>User Management</CardTitle>
          <CardDescription>
            View and manage all users in the system.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead>User</TableHead>
                <TableHead>Email</TableHead>
                <TableHead>Status</TableHead>
                <TableHead className="text-right">Enabled</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {loading ? (
                Array.from({ length: 5 }).map((_, i) => (
                    <TableRow key={i}>
                        <TableCell><Skeleton className="h-10 w-48" /></TableCell>
                        <TableCell><Skeleton className="h-10 w-48" /></TableCell>
                        <TableCell><Skeleton className="h-10 w-24" /></TableCell>
                        <TableCell className="text-right"><Skeleton className="h-10 w-12 ml-auto" /></TableCell>
                    </TableRow>
                ))
              ) : (
                users.map((user) => (
                  <TableRow key={user.uid}>
                    <TableCell>
                      <div className="flex items-center gap-3">
                        <UserAvatar user={user} className="h-8 w-8" />
                        <span className="font-medium">
                          {user.displayName || 'N/A'}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell>{user.email}</TableCell>
                    <TableCell>
                      <Badge variant={user.disabled ? 'destructive' : 'default'}>
                        {user.disabled ? 'Disabled' : 'Active'}
                      </Badge>
                    </TableCell>
                    <TableCell className="text-right">
                       <Switch
                        checked={!user.disabled}
                        onCheckedChange={(checked) => handleUserToggle(user.uid, !checked)}
                        disabled={user.email === 'admin@campusmind.app'}
                      />
                    </TableCell>
                  </TableRow>
                ))
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </main>
  );
}
