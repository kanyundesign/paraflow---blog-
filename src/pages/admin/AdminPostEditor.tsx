import { useState, useEffect, useRef, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { CMSLayout } from '@/components/cms/CMSLayout';
import { usePost, useCreatePost, useUpdatePost } from '@/hooks/use-posts';
import { useCategories } from '@/hooks/use-categories';
import { useAuthors } from '@/hooks/use-authors';
import { MarkdownEditor } from '@/components/cms/MarkdownEditor';
import { NotionImportDialog } from '@/components/cms/NotionImportDialog';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { useToast } from '@/hooks/use-toast';
import { ArrowLeft, Save, Eye, Upload, FileUp, Loader2 } from 'lucide-react';

type PostStatus = 'draft' | 'published';

export default function AdminPostEditor() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  
  const isNew = id === 'new';
  const { data: existingPost, isLoading: postLoading } = usePost(isNew ? undefined : id);
  const { data: categories } = useCategories();
  const { data: authors } = useAuthors();
  const createPost = useCreatePost();
  const updatePost = useUpdatePost();

  const [formData, setFormData] = useState({
    title: '',
    slug: '',
    subtitle: '',
    content: '',
    cover_image_url: '',
    category_id: '',
    author_id: '',
    status: 'draft' as PostStatus,
    tags: '',
  });

  const [notionDialogOpen, setNotionDialogOpen] = useState(false);

  // Track if form has been modified and the created post id for new posts
  const isDirtyRef = useRef(false);
  const createdPostIdRef = useRef<string | null>(null);
  const isSavingRef = useRef(false);
  const hasInitializedRef = useRef(false);

  // Reset initialization when switching between posts (or new/edit)
  useEffect(() => {
    hasInitializedRef.current = false;
    isDirtyRef.current = false;
    createdPostIdRef.current = null;
  }, [id]);

  useEffect(() => {
    // Only initialize once per post id; avoid overwriting user's in-progress edits
    // when the query refetches after auto-save.
    if (existingPost && !hasInitializedRef.current) {
      setFormData({
        title: existingPost.title,
        slug: existingPost.slug,
        subtitle: existingPost.subtitle || '',
        content: existingPost.content,
        cover_image_url: existingPost.cover_image_url || '',
        category_id: existingPost.category_id || '',
        author_id: existingPost.author_id || '',
        status: existingPost.status,
        tags: existingPost.tags?.join(', ') || '',
      });
      hasInitializedRef.current = true;
      isDirtyRef.current = false;
    } else if (isNew && !hasInitializedRef.current) {
      hasInitializedRef.current = true;
      isDirtyRef.current = false;
    }
  }, [existingPost, isNew]);

  // Mark form as dirty when formData changes (after initialization)
  useEffect(() => {
    if (hasInitializedRef.current) {
      isDirtyRef.current = true;
    }
  }, [formData]);

  const generateSlug = (title: string) => {
    return title
      .toLowerCase()
      .replace(/[^\w\s-]/g, '')
      .replace(/\s+/g, '-')
      .replace(/-+/g, '-')
      .trim();
  };

  const formatError = (err: unknown) => {
    if (!err) return 'Unknown error';
    if (typeof err === 'string') return err;
    if (err instanceof Error) return err.message;
    const anyErr = err as any;
    return (
      anyErr?.message ||
      anyErr?.error_description ||
      anyErr?.details ||
      JSON.stringify(anyErr)
    );
  };

  // Store formData in a ref for auto-save to avoid useCallback dependency issues
  const formDataRef = useRef(formData);
  useEffect(() => {
    formDataRef.current = formData;
  }, [formData]);

  // Auto-save as draft function - uses refs to avoid re-creating on every keystroke
  const autoSaveAsDraft = useCallback(async () => {
    const currentFormData = formDataRef.current;
    
    // Only save if dirty and has title, and not already saving
    if (!isDirtyRef.current || isSavingRef.current || !currentFormData.title) {
      return;
    }

    isSavingRef.current = true;

    const tags = currentFormData.tags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const postData = {
      title: currentFormData.title,
      slug: currentFormData.slug || generateSlug(currentFormData.title),
      subtitle: currentFormData.subtitle || null,
      content: currentFormData.content,
      cover_image_url: currentFormData.cover_image_url || null,
      category_id: currentFormData.category_id || null,
      author_id: currentFormData.author_id || null,
      status: 'draft' as PostStatus,
      tags: tags.length ? tags : null,
      published_at: null,
    };

    try {
      if (isNew && !createdPostIdRef.current) {
        // Create new draft
        const result = await createPost.mutateAsync(postData);
        createdPostIdRef.current = result.id;
        console.log('Auto-saved new draft:', result.id);
      } else {
        // Update existing post
        const postId = createdPostIdRef.current || id;
        if (postId) {
          await updatePost.mutateAsync({ id: postId, ...postData });
          console.log('Auto-saved draft:', postId);
        }
      }
      isDirtyRef.current = false;
    } catch (error) {
      console.error('Auto-save failed:', error);
    } finally {
      isSavingRef.current = false;
    }
  }, [isNew, id, createPost, updatePost]);

  // Auto-save when leaving the page
  useEffect(() => {
    return () => {
      // Only auto-save if dirty and has content
      if (isDirtyRef.current && formDataRef.current.title) {
        autoSaveAsDraft();
      }
    };
  }, [autoSaveAsDraft]);

  // Handle browser beforeunload event
  useEffect(() => {
    const handleBeforeUnload = (e: BeforeUnloadEvent) => {
      if (isDirtyRef.current && formDataRef.current.title) {
        e.preventDefault();
        e.returnValue = '';
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    return () => window.removeEventListener('beforeunload', handleBeforeUnload);
  }, []);

  const handleTitleChange = (value: string) => {
    setFormData((prev) => ({
      ...prev,
      title: value,
      slug: isNew && !createdPostIdRef.current ? generateSlug(value) : prev.slug,
    }));
  };

  const handleNotionImport = (data: { title: string; content: string }) => {
    setFormData((prev) => ({
      ...prev,
      title: data.title || prev.title,
      slug: data.title ? generateSlug(data.title) : prev.slug,
      content: data.content || prev.content,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.title) {
      toast({
        title: 'Required Fields Missing',
        description: 'Title is required',
        variant: 'destructive',
      });
      return;
    }

    const tags = formData.tags
      .split(',')
      .map((t) => t.trim())
      .filter(Boolean);

    const postData = {
      title: formData.title,
      slug: formData.slug || generateSlug(formData.title),
      subtitle: formData.subtitle || null,
      content: formData.content,
      cover_image_url: formData.cover_image_url || null,
      category_id: formData.category_id || null,
      author_id: formData.author_id || null,
      status: formData.status,
      tags: tags.length ? tags : null,
      published_at: formData.status === 'published' ? new Date().toISOString() : null,
    };

    try {
      // If we already auto-saved as a new draft, update that instead of creating a new one
      const shouldCreate = isNew && !createdPostIdRef.current;
      const postIdToUpdate = createdPostIdRef.current || id;

      if (shouldCreate) {
        await createPost.mutateAsync(postData);
        toast({
          title: 'Created',
          description: 'Post has been created',
        });
      } else {
        await updatePost.mutateAsync({ id: postIdToUpdate!, ...postData });
        toast({
          title: 'Saved',
          description: 'Post has been updated',
        });
      }
      // Mark as not dirty so we don't auto-save on unmount
      isDirtyRef.current = false;
      navigate('/admin/posts');
    } catch (error) {
      const msg = formatError(error);
      console.error('Failed to save post:', error);
      toast({
        title: 'Error',
        description: msg,
        variant: 'destructive',
      });
    }
  };

  if (!isNew && postLoading) {
    return (
      <CMSLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </CMSLayout>
    );
  }

  const isPending = createPost.isPending || updatePost.isPending;

  return (
    <CMSLayout>
      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-4">
            <Button
              type="button"
              variant="ghost"
              onClick={() => navigate('/admin/posts')}
              className="text-muted-foreground"
            >
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back
            </Button>
            <div>
              <h1 className="text-2xl font-bold text-foreground">
                {isNew ? 'New Post' : 'Edit Post'}
              </h1>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => setNotionDialogOpen(true)}
              className="border-border gap-2"
            >
              <FileUp className="h-4 w-4" />
              Notion Import
            </Button>
            {!isNew && existingPost?.status === 'published' && (
              <Button
                type="button"
                variant="outline"
                onClick={() => window.open(`/blog/${formData.slug}`, '_blank')}
                className="border-border"
              >
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </Button>
            )}
            <Button 
              type="submit" 
              disabled={isPending}
              className="bg-primary text-primary-foreground hover:bg-primary/90"
            >
              {isPending && <Loader2 className="h-4 w-4 mr-2 animate-spin" />}
              <Save className="h-4 w-4 mr-2" />
              Save
            </Button>
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Main Content */}
          <div className="lg:col-span-2 space-y-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Content</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="title" className="text-foreground">Title *</Label>
                  <Input
                    id="title"
                    value={formData.title}
                    onChange={(e) => handleTitleChange(e.target.value)}
                    placeholder="Enter post title"
                    className="bg-background border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="slug" className="text-foreground">URL Slug</Label>
                  <Input
                    id="slug"
                    value={formData.slug}
                    onChange={(e) => setFormData(prev => ({ ...prev, slug: e.target.value }))}
                    placeholder="url-slug"
                    className="bg-background border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label htmlFor="subtitle" className="text-foreground">Subtitle</Label>
                  <Input
                    id="subtitle"
                    value={formData.subtitle}
                    onChange={(e) => setFormData(prev => ({ ...prev, subtitle: e.target.value }))}
                    placeholder="Enter subtitle"
                    className="bg-background border-border"
                  />
                </div>
                <div className="space-y-2">
                  <Label className="text-foreground">Content</Label>
                  <MarkdownEditor
                    value={formData.content}
                    onChange={(value) => setFormData(prev => ({ ...prev, content: value }))}
                    placeholder="Write your content using Markdown..."
                  />
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Sidebar */}
          <div className="space-y-6">
            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Publish Settings</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label className="text-foreground">Status</Label>
                  <Select
                    value={formData.status}
                    onValueChange={(value: PostStatus) => 
                      setFormData(prev => ({ ...prev, status: value }))
                    }
                  >
                    <SelectTrigger className="bg-background border-border">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border-border">
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="published">Published</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-foreground">Category</Label>
                  <Select
                    value={formData.category_id}
                    onValueChange={(value) => 
                      setFormData(prev => ({ ...prev, category_id: value }))
                    }
                  >
                    <SelectTrigger className="bg-background border-border">
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border-border">
                      {(categories || []).map((cat) => (
                        <SelectItem key={cat.id} value={cat.id}>
                          {cat.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="space-y-2">
                  <Label className="text-foreground">Author</Label>
                  <Select
                    value={formData.author_id}
                    onValueChange={(value) => 
                      setFormData(prev => ({ ...prev, author_id: value }))
                    }
                  >
                    <SelectTrigger className="bg-background border-border">
                      <SelectValue placeholder="Select author" />
                    </SelectTrigger>
                    <SelectContent className="bg-popover border-border">
                      {(authors || []).map((author) => (
                        <SelectItem key={author.id} value={author.id}>
                          {author.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Cover Image</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="cover_image_url" className="text-foreground">Image URL</Label>
                  <Input
                    id="cover_image_url"
                    value={formData.cover_image_url}
                    onChange={(e) => setFormData(prev => ({ ...prev, cover_image_url: e.target.value }))}
                    placeholder="https://..."
                    className="bg-background border-border"
                  />
                </div>
                {formData.cover_image_url && (
                  <div className="aspect-video bg-muted rounded-lg overflow-hidden">
                    <img 
                      src={formData.cover_image_url} 
                      alt="Cover preview"
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        (e.target as HTMLImageElement).src = '/placeholder.svg';
                      }}
                    />
                  </div>
                )}
                <Button type="button" variant="outline" className="w-full border-border">
                  <Upload className="h-4 w-4 mr-2" />
                  Upload Image
                </Button>
              </CardContent>
            </Card>

            <Card className="bg-card border-border">
              <CardHeader>
                <CardTitle className="text-foreground">Tags</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <Label htmlFor="tags" className="text-foreground">Tags (comma separated)</Label>
                  <Input
                    id="tags"
                    value={formData.tags}
                    onChange={(e) => setFormData(prev => ({ ...prev, tags: e.target.value }))}
                    placeholder="startup, mvp, validation"
                    className="bg-background border-border"
                  />
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </form>

      <NotionImportDialog
        open={notionDialogOpen}
        onOpenChange={setNotionDialogOpen}
        onImport={handleNotionImport}
      />
    </CMSLayout>
  );
}
