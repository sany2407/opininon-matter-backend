export interface Category {
  id: number;
  name: string;
  description: string | null;
  created_at: string;
}

export interface Blog {
  id: number;
  title: string;
  content: string;
  slug: string;
  published_date: string | null;
  category_id: number | null;
  status: 'draft' | 'published';
  updated_at: string;
  created_at: string;
}

export interface NewsletterSubscriber {
  id: number;
  email: string;
  subscribed_at: string;
}

export interface AdminUser {
  id: number;
  username: string;
  password_hash: string;
  created_at: string;
}

export interface JwtPayload {
  userId: number;
  username: string;
}
