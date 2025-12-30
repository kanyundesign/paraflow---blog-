import { useQuery } from '@tanstack/react-query';
import { supabase } from '@/integrations/supabase/client';

export interface PublishedPost {
  id: string;
  slug: string;
  title: string;
  subtitle: string | null;
  content: string;
  cover_image_url: string | null;
  published_at: string | null;
  tags: string[] | null;
  category: {
    id: string;
    slug: string;
    label: string;
  } | null;
  author: {
    id: string;
    name: string;
    avatar_url: string | null;
  } | null;
}

export function usePublishedPosts(categorySlug?: string) {
  return useQuery({
    queryKey: ['published-posts', categorySlug],
    queryFn: async () => {
      let query = supabase
        .from('posts')
        .select(`
          id,
          slug,
          title,
          subtitle,
          content,
          cover_image_url,
          published_at,
          tags,
          category:categories(id, slug, label),
          author:authors(id, name, avatar_url)
        `)
        .eq('status', 'published')
        .order('published_at', { ascending: false });

      if (categorySlug) {
        query = query.eq('categories.slug', categorySlug);
      }

      const { data, error } = await query;
      
      if (error) throw error;
      
      // Filter by category if specified (since the join filter doesn't work directly)
      if (categorySlug && data) {
        return data.filter(post => post.category?.slug === categorySlug) as PublishedPost[];
      }
      
      return data as PublishedPost[];
    },
  });
}

export function usePublishedPost(slug: string | undefined) {
  return useQuery({
    queryKey: ['published-post', slug],
    queryFn: async () => {
      if (!slug) return null;
      
      const { data, error } = await supabase
        .from('posts')
        .select(`
          id,
          slug,
          title,
          subtitle,
          content,
          cover_image_url,
          published_at,
          tags,
          category:categories(id, slug, label),
          author:authors(id, name, avatar_url)
        `)
        .eq('slug', slug)
        .eq('status', 'published')
        .single();
      
      if (error) throw error;
      return data as PublishedPost;
    },
    enabled: !!slug,
  });
}
