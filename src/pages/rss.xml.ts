import rss from "@astrojs/rss";
import type { APIContext } from "astro";
import { SITE_DESCRIPTION, SITE_TITLE } from "../consts";
import { getVisibleBlogPosts, sortBlogPostsByPubDateDesc } from "../lib/blog";

export const GET = async (context: APIContext) => {
  const posts = sortBlogPostsByPubDateDesc(await getVisibleBlogPosts());
  return rss({
    title: SITE_TITLE,
    description: SITE_DESCRIPTION,
    site: context.site,
    items: posts.map((post) => ({
      title: post.data.title,
      description: post.data.description,
      pubDate: post.data.pubDate,
      categories: post.data.tags,
      link: `/blog/${post.id}/`,
    })),
  });
};
