import { useState } from 'react';
import { Link } from 'react-router-dom';
import { CMSLayout } from '@/components/cms/CMSLayout';
import { usePosts, useUpdatePost, useDeletePost } from '@/hooks/use-posts';
import { useCategories } from '@/hooks/use-categories';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
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
import { Plus, Search, Pencil, Trash2, Eye, Loader2 } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { Switch } from '@/components/ui/switch';
import { format } from 'date-fns';

export default function AdminPosts() {
  const { data: posts, isLoading: postsLoading } = usePosts();
  const { data: categories } = useCategories();
  const updatePost = useUpdatePost();
  const deletePost = useDeletePost();
  const { toast } = useToast();
  const [search, setSearch] = useState('');

  const filteredPosts = (posts || []).filter(post =>
    post.title.toLowerCase().includes(search.toLowerCase()) ||
    (post.subtitle?.toLowerCase().includes(search.toLowerCase()) ?? false)
  );

  const getCategoryName = (categoryId: string | null) => {
    if (!categoryId) return '-';
    return categories?.find(c => c.id === categoryId)?.label || '-';
  };

  const formatError = (err: unknown) => {
    if (!err) return 'Unknown error';
    if (typeof err === 'string') return err;
    if (err instanceof Error) return err.message;
    const anyErr = err as any;
    return anyErr?.message || anyErr?.details || JSON.stringify(anyErr);
  };

  const handleDelete = async (id: string, title: string) => {
    try {
      await deletePost.mutateAsync(id);
      toast({
        title: 'Deleted',
        description: `Post "${title}" has been deleted`,
      });
    } catch (error) {
      console.error('Failed to delete post:', error);
      toast({
        title: 'Error',
        description: formatError(error),
        variant: 'destructive',
      });
    }
  };

  const handleStatusToggle = async (id: string, currentStatus: string, slug: string) => {
    const newStatus = currentStatus === 'published' ? 'draft' : 'published';
    try {
      await updatePost.mutateAsync({
        id,
        status: newStatus,
        published_at: newStatus === 'published' ? new Date().toISOString() : null,
      });
      toast({
        title: newStatus === 'published' ? 'Published' : 'Unpublished',
        description: `Post has been ${newStatus === 'published' ? 'published' : 'set to draft'}`,
        action: newStatus === 'published' ? (
          <Button
            variant="outline"
            size="sm"
            onClick={() => window.open(`/blog/${slug}`, '_blank')}
          >
            View
          </Button>
        ) : undefined,
      });
    } catch (error) {
      console.error('Failed to update status:', error);
      toast({
        title: 'Error',
        description: formatError(error),
        variant: 'destructive',
      });
    }
  };

  if (postsLoading) {
    return (
      <CMSLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </CMSLayout>
    );
  }

  return (
    <CMSLayout>
      <div className="space-y-6">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">Posts</h1>
            <p className="text-muted-foreground">Manage all blog posts</p>
          </div>
          <Link to="/admin/posts/new">
            <Button className="bg-primary text-primary-foreground hover:bg-primary/90">
              <Plus className="h-4 w-4 mr-2" />
              New Post
            </Button>
          </Link>
        </div>

        {/* Search */}
        <div className="relative max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
          <Input
            placeholder="Search posts..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-10 bg-background border-border"
          />
        </div>

        {/* Posts Table */}
        <div className="bg-card border border-border rounded-lg overflow-hidden">
          <Table>
            <TableHeader>
              <TableRow className="border-border hover:bg-transparent">
                <TableHead className="text-muted-foreground">Title</TableHead>
                <TableHead className="text-muted-foreground">Category</TableHead>
                <TableHead className="text-muted-foreground">Status</TableHead>
                <TableHead className="text-muted-foreground">Updated</TableHead>
                <TableHead className="text-muted-foreground text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {filteredPosts.map((post) => (
                <TableRow key={post.id} className="border-border">
                  <TableCell>
                    <div>
                      <p className="font-medium text-foreground">{post.title}</p>
                      <p className="text-sm text-muted-foreground truncate max-w-xs">
                        {post.subtitle || '-'}
                      </p>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {getCategoryName(post.category_id)}
                  </TableCell>
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Switch
                        checked={post.status === 'published'}
                        onCheckedChange={() => handleStatusToggle(post.id, post.status, post.slug)}
                        disabled={updatePost.isPending}
                      />
                      <span className="text-sm text-muted-foreground">
                        {post.status === 'published' ? 'Published' : 'Draft'}
                      </span>
                    </div>
                  </TableCell>
                  <TableCell className="text-muted-foreground">
                    {format(new Date(post.updated_at), 'yyyy-MM-dd')}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex items-center justify-end gap-2">
                      <Link to={`/blog/${post.slug}`} target="_blank">
                        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                          <Eye className="h-4 w-4" />
                        </Button>
                      </Link>
                      <Link to={`/admin/posts/${post.id}`}>
                        <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-foreground">
                          <Pencil className="h-4 w-4" />
                        </Button>
                      </Link>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="icon" className="text-muted-foreground hover:text-destructive">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent className="bg-card border-border">
                          <AlertDialogHeader>
                            <AlertDialogTitle className="text-foreground">Confirm Delete</AlertDialogTitle>
                            <AlertDialogDescription className="text-muted-foreground">
                              Are you sure you want to delete "{post.title}"? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel className="border-border">Cancel</AlertDialogCancel>
                            <AlertDialogAction
                              onClick={() => handleDelete(post.id, post.title)}
                              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </TableCell>
                </TableRow>
              ))}
              {filteredPosts.length === 0 && (
                <TableRow>
                  <TableCell colSpan={5} className="text-center py-8 text-muted-foreground">
                    No posts found
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </div>
      </div>
    </CMSLayout>
  );
}
