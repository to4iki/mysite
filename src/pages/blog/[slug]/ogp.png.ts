import type { APIRoute, GetStaticPaths } from "astro";
import { SITE_TITLE } from "../../../consts";
import { getVisibleBlogPosts } from "../../../lib/blog";
import { generateOgpImage } from "../../../ogp/generate";

export const getStaticPaths: GetStaticPaths = async () => {
  const posts = await getVisibleBlogPosts();
  return posts.map((post) => ({
    params: { slug: post.id },
    props: { title: post.data.title },
  }));
};

export const GET: APIRoute = async ({ props }) => {
  const png = await generateOgpImage({
    title: props.title,
    siteName: SITE_TITLE,
  });
  return new Response(png, {
    headers: {
      "Content-Type": "image/png",
      "Cache-Control": "public, max-age=31536000, immutable",
    },
  });
};
