import { type CollectionEntry, getCollection } from "astro:content";

export type BlogPost = CollectionEntry<"blog">;

const isVisibleBlogPost = (post: BlogPost): boolean => {
  return !import.meta.env.PROD || post.data.draft !== true;
};

export const sortBlogPostsByPubDateDesc = (posts: BlogPost[]): BlogPost[] => {
  return [...posts].sort(
    (a, b) => b.data.pubDate.valueOf() - a.data.pubDate.valueOf(),
  );
};

export const getVisibleBlogPosts = async (): Promise<BlogPost[]> => {
  return getCollection("blog", isVisibleBlogPost);
};
