import { useState } from 'react';
import { CMSLayout } from '@/components/cms/CMSLayout';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { useToast } from '@/hooks/use-toast';
import { useUsersWithRoles, useAssignRole, useRemoveRole, UserWithProfile } from '@/hooks/use-user-roles';
import { useCMSAuth } from '@/contexts/CMSAuthContext';
import { Shield, ShieldAlert, UserX, Loader2 } from 'lucide-react';
import { format } from 'date-fns';

export default function AdminUsers() {
  const { user: currentUser } = useCMSAuth();
  const { data: users, isLoading, error } = useUsersWithRoles();
  const assignRole = useAssignRole();
  const removeRole = useRemoveRole();
  const { toast } = useToast();
  
  const [selectedUser, setSelectedUser] = useState<UserWithProfile | null>(null);
  const [showRemoveDialog, setShowRemoveDialog] = useState(false);

  const handleRoleChange = async (userId: string, role: string) => {
    if (role === 'none') {
      const user = users?.find(u => u.user_id === userId);
      if (user) {
        setSelectedUser(user);
        setShowRemoveDialog(true);
      }
      return;
    }

    try {
      await assignRole.mutateAsync({ userId, role: role as 'admin' | 'editor' });
      toast({
        title: 'Role Updated',
        description: 'User role has been updated successfully.',
      });
    } catch (error: any) {
      toast({
        title: 'Update Failed',
        description: error.message || 'Unable to update user role.',
        variant: 'destructive',
      });
    }
  };

  const handleRemoveRole = async () => {
    if (!selectedUser) return;

    try {
      await removeRole.mutateAsync(selectedUser.user_id);
      toast({
        title: 'Role Removed',
        description: 'User role has been removed successfully.',
      });
    } catch (error: any) {
      toast({
        title: 'Removal Failed',
        description: error.message || 'Unable to remove user role.',
        variant: 'destructive',
      });
    } finally {
      setShowRemoveDialog(false);
      setSelectedUser(null);
    }
  };

  const getRoleBadge = (role: 'admin' | 'editor' | null) => {
    switch (role) {
      case 'admin':
        return <Badge className="bg-primary/10 text-primary border-primary/20"><Shield className="h-3 w-3 mr-1" />Admin</Badge>;
      case 'editor':
        return <Badge className="bg-blue-500/10 text-blue-600 border-blue-500/20"><ShieldAlert className="h-3 w-3 mr-1" />Editor</Badge>;
      default:
        return <Badge variant="outline" className="text-muted-foreground"><UserX className="h-3 w-3 mr-1" />No Role</Badge>;
    }
  };

  if (error) {
    return (
      <CMSLayout>
        <div className="text-center py-12">
          <p className="text-destructive">Failed to load user list: {error.message}</p>
          <p className="text-sm text-muted-foreground mt-2">
            Please ensure you have admin privileges to view this page.
          </p>
        </div>
      </CMSLayout>
    );
  }

  return (
    <CMSLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">User Role Management</h1>
          <p className="text-muted-foreground mt-1">
            Manage user access permissions and role assignments
          </p>
        </div>

        {/* Info Card */}
        <div className="bg-muted/50 rounded-lg p-4 border border-border">
          <h3 className="font-medium text-foreground mb-2">Role Descriptions</h3>
          <ul className="text-sm text-muted-foreground space-y-1">
            <li><strong>Admin</strong>: Full access, can manage all content and user roles</li>
            <li><strong>Editor</strong>: Can create, edit, and publish posts, categories, and authors</li>
            <li><strong>No Role</strong>: Cannot access the CMS admin panel</li>
          </ul>
        </div>

        {isLoading ? (
          <div className="flex items-center justify-center py-12">
            <Loader2 className="h-8 w-8 animate-spin text-primary" />
          </div>
        ) : users && users.length > 0 ? (
          <div className="border border-border rounded-lg overflow-hidden">
            <Table>
              <TableHeader>
                <TableRow className="bg-muted/50">
                  <TableHead>User</TableHead>
                  <TableHead>Current Role</TableHead>
                  <TableHead>Registered</TableHead>
                  <TableHead className="text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {users.map((user) => (
                  <TableRow key={user.user_id}>
                    <TableCell>
                      <div>
                        <p className="font-medium text-foreground">
                          {user.display_name || 'No name set'}
                        </p>
                        <p className="text-sm text-muted-foreground">{user.email}</p>
                      </div>
                    </TableCell>
                    <TableCell>{getRoleBadge(user.role)}</TableCell>
                    <TableCell className="text-muted-foreground">
                      {format(new Date(user.created_at), 'yyyy-MM-dd HH:mm')}
                    </TableCell>
                    <TableCell className="text-right">
                      <Select
                        value={user.role || 'none'}
                        onValueChange={(value) => handleRoleChange(user.user_id, value)}
                        disabled={user.user_id === currentUser?.id}
                      >
                        <SelectTrigger className="w-32">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="admin">Admin</SelectItem>
                          <SelectItem value="editor">Editor</SelectItem>
                          <SelectItem value="none">No Role</SelectItem>
                        </SelectContent>
                      </Select>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        ) : (
          <div className="text-center py-12 border border-dashed border-border rounded-lg">
            <p className="text-muted-foreground">No users found</p>
            <p className="text-sm text-muted-foreground mt-1">
              Users will appear here after registration
            </p>
          </div>
        )}
      </div>

      {/* Remove Role Confirmation Dialog */}
      <AlertDialog open={showRemoveDialog} onOpenChange={setShowRemoveDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Remove User Role</AlertDialogTitle>
            <AlertDialogDescription>
              Are you sure you want to remove the role from <strong>{selectedUser?.email}</strong>?
              They will no longer be able to access the CMS admin panel.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleRemoveRole}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              Confirm Remove
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </CMSLayout>
  );
}