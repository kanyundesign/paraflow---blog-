// CMS Mock Data for local development

export type PostStatus = 'draft' | 'published' | 'archived';

export interface CMSCategory {
  id: string;
  name: string;
  slug: string;
  description: string;
  createdAt: string;
}

export interface CMSAuthor {
  id: string;
  name: string;
  avatar: string;
  email: string;
  bio?: string;
}

export interface CMSPost {
  id: string;
  title: string;
  slug: string;
  subtitle: string;
  content: string;
  coverImage: string;
  categoryId: string;
  authorId: string;
  status: PostStatus;
  tags: string[];
  createdAt: string;
  updatedAt: string;
  publishedAt: string | null;
}

// Mock data
export const mockCategories: CMSCategory[] = [
  { id: '1', name: 'Insight', slug: 'insight', description: 'Industry insights and analysis', createdAt: '2024-01-01' },
  { id: '2', name: 'Stories', slug: 'stories', description: 'User stories and case studies', createdAt: '2024-01-01' },
  { id: '3', name: 'Features', slug: 'features', description: 'Product features', createdAt: '2024-01-01' },
  { id: '4', name: 'Engineering', slug: 'engineering', description: 'Tech and engineering', createdAt: '2024-01-01' },
];

export const mockAuthors: CMSAuthor[] = [
  { id: '1', name: 'Ryan Chen', avatar: '/src/assets/blog/avatar-ryan.png', email: 'ryan@paraflow.io', bio: 'Founder & CEO of Paraflow' },
];

export const mockPosts: CMSPost[] = [
  {
    id: '1',
    title: 'Why We Built Paraflow',
    slug: 'why-we-built-paraflow',
    subtitle: 'The story behind our mission to democratize workflow automation',
    content: '# Why We Built Paraflow\n\nThis is the content of the blog post...',
    coverImage: '/src/assets/blog/cover-why-we-built-paraflow.svg',
    categoryId: '2',
    authorId: '1',
    status: 'published',
    tags: ['startup', 'mission'],
    createdAt: '2024-03-15',
    updatedAt: '2024-03-15',
    publishedAt: '2024-03-15',
  },
  {
    id: '2',
    title: 'The Coffee Test: How We Validate Startup Ideas',
    slug: 'coffee-test-validate-startup-ideas',
    subtitle: 'A simple framework for testing if your startup idea is worth pursuing',
    content: '# The Coffee Test\n\nThis is the content...',
    coverImage: '/src/assets/blog/cover-coffee-test.svg',
    categoryId: '1',
    authorId: '1',
    status: 'published',
    tags: ['startup', 'validation'],
    createdAt: '2024-03-10',
    updatedAt: '2024-03-10',
    publishedAt: '2024-03-10',
  },
  {
    id: '3',
    title: 'Building an MVP in 30 Days',
    slug: 'building-mvp-30-days',
    subtitle: 'Our journey from idea to launch in just one month',
    content: '# Building an MVP\n\nThis is the content...',
    coverImage: '/src/assets/blog/cover-startup-mvp.svg',
    categoryId: '1',
    authorId: '1',
    status: 'draft',
    tags: ['mvp', 'startup'],
    createdAt: '2024-03-05',
    updatedAt: '2024-03-08',
    publishedAt: null,
  },
];

// Helper functions
export const getCategoryById = (id: string) => mockCategories.find(c => c.id === id);
export const getAuthorById = (id: string) => mockAuthors.find(a => a.id === id);
