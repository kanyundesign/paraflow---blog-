import { CMSLayout } from '@/components/cms/CMSLayout';
import { usePosts } from '@/hooks/use-posts';
import { useCategories } from '@/hooks/use-categories';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { FileText, FolderOpen, TrendingUp, FileEdit, Loader2 } from 'lucide-react';
import { Link } from 'react-router-dom';
import { format } from 'date-fns';

export default function AdminDashboard() {
  const { data: posts, isLoading: postsLoading } = usePosts();
  const { data: categories, isLoading: categoriesLoading } = useCategories();

  if (postsLoading || categoriesLoading) {
    return (
      <CMSLayout>
        <div className="flex items-center justify-center h-64">
          <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" />
        </div>
      </CMSLayout>
    );
  }

  const publishedPosts = (posts || []).filter(p => p.status === 'published').length;
  const draftPosts = (posts || []).filter(p => p.status === 'draft').length;

  const stats = [
    { 
      label: 'Total Posts', 
      value: (posts || []).length, 
      icon: FileText, 
      color: 'text-primary',
      link: '/admin/posts'
    },
    { 
      label: 'Published', 
      value: publishedPosts, 
      icon: TrendingUp, 
      color: 'text-category-stories',
      link: '/admin/posts?status=published'
    },
    { 
      label: 'Drafts', 
      value: draftPosts, 
      icon: FileEdit, 
      color: 'text-category-engineering',
      link: '/admin/posts?status=draft'
    },
    { 
      label: 'Categories', 
      value: (categories || []).length, 
      icon: FolderOpen, 
      color: 'text-category-insight',
      link: '/admin/categories'
    },
  ];

  const recentPosts = (posts || []).slice(0, 5);

  return (
    <CMSLayout>
      <div className="space-y-6">
        <div>
          <h1 className="text-2xl font-bold text-foreground">Dashboard</h1>
          <p className="text-muted-foreground">Welcome to Paraflow CMS</p>
        </div>

        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => (
            <Link key={stat.label} to={stat.link}>
              <Card className="bg-card border-border hover:border-primary/50 transition-colors cursor-pointer">
                <CardContent className="pt-6">
                  <div className="flex items-center justify-between">
                    <div>
                      <p className="text-muted-foreground text-sm">{stat.label}</p>
                      <p className="text-3xl font-bold text-foreground mt-1">{stat.value}</p>
                    </div>
                    <stat.icon className={`h-10 w-10 ${stat.color} opacity-80`} />
                  </div>
                </CardContent>
              </Card>
            </Link>
          ))}
        </div>

        {/* Recent Posts */}
        <Card className="bg-card border-border">
          <CardHeader className="flex flex-row items-center justify-between">
            <CardTitle className="text-foreground">Recent Posts</CardTitle>
            <Link 
              to="/admin/posts" 
              className="text-sm text-primary hover:underline"
            >
              View All
            </Link>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {recentPosts.map((post) => (
                <Link 
                  key={post.id} 
                  to={`/admin/posts/${post.id}`}
                  className="flex items-center justify-between p-3 rounded-lg hover:bg-muted transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <h3 className="text-foreground font-medium truncate">{post.title}</h3>
                    <p className="text-sm text-muted-foreground">
                      {format(new Date(post.updated_at), 'yyyy-MM-dd')}
                    </p>
                  </div>
                  <span className={`px-2 py-1 rounded text-xs font-medium ${
                    post.status === 'published' 
                      ? 'bg-primary/10 text-primary' 
                      : 'bg-muted text-muted-foreground'
                  }`}>
                    {post.status === 'published' ? 'Published' : 'Draft'}
                  </span>
                </Link>
              ))}
              {recentPosts.length === 0 && (
                <p className="text-center text-muted-foreground py-8">No posts yet</p>
              )}
            </div>
          </CardContent>
        </Card>
      </div>
    </CMSLayout>
  );
}
