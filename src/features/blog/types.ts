export type BlogPost = {
  id: string;
  title: string;
  category: string;
  summary: string;
  date: string;
  likes: number;
  comments: number;
  tags: string[];
};

export type BlogPostDetail = BlogPost & {
  content: string;
};

export type BlogStats = {
  posts: number;
  likes: number;
  comments: number;
};

export type BlogPage = {
  items: BlogPost[];
  page: number;
  last: boolean;
  total: number;
};
