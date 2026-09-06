type MarkdownNode = {
  type: string;
  url?: string;
  value?: string;
  children?: MarkdownNode[];
};

type MarkdownTree = {
  children: MarkdownNode[];
};

type ParagraphNode = MarkdownNode & {
  type: "paragraph";
  children: MarkdownNode[];
};

type LinkNode = MarkdownNode & {
  type: "link";
  url: string;
  children: MarkdownNode[];
};

type TextNode = MarkdownNode & {
  type: "text";
  value: string;
};

type HtmlNode = MarkdownNode & {
  type: "html";
  value: string;
};

type YoutubeEmbed = {
  videoId: string;
  start: number | undefined;
};

const YOUTUBE_HOSTS = new Set([
  "youtube.com",
  "m.youtube.com",
  "music.youtube.com",
  "youtube-nocookie.com",
  "youtu.be",
]);

const VIDEO_ID_PATTERN = /^[\w-]{11}$/;
const START_SECONDS_PATTERN = /^\d+$/;
const PATH_PREFIXES = new Set(["embed", "shorts", "live", "v"]);

const isParagraph = (node: MarkdownNode): node is ParagraphNode => {
  return node.type === "paragraph" && Array.isArray(node.children);
};

const isLink = (node: MarkdownNode): node is LinkNode => {
  return (
    node.type === "link" &&
    typeof node.url === "string" &&
    Array.isArray(node.children)
  );
};

const isText = (node: MarkdownNode): node is TextNode => {
  return node.type === "text" && typeof node.value === "string";
};

const isVideoId = (value: string | null | undefined): value is string => {
  return value !== null && value !== undefined && VIDEO_ID_PATTERN.test(value);
};

const parseStartSeconds = (url: URL): number | undefined => {
  const raw = url.searchParams.get("start") ?? url.searchParams.get("t");
  if (raw === null || !START_SECONDS_PATTERN.test(raw)) {
    return undefined;
  }

  const start = Number(raw);
  return start > 0 ? start : undefined;
};

const getYoutubeEmbed = (href: string): YoutubeEmbed | undefined => {
  let url: URL;
  try {
    url = new URL(href);
  } catch {
    return undefined;
  }

  if (url.protocol !== "http:" && url.protocol !== "https:") {
    return undefined;
  }

  const host = url.hostname.replace(/^www\./, "");
  if (!YOUTUBE_HOSTS.has(host)) {
    return undefined;
  }

  const videoId = getVideoId(host, url);
  if (videoId === undefined) {
    return undefined;
  }

  return { videoId, start: parseStartSeconds(url) };
};

const getVideoId = (host: string, url: URL): string | undefined => {
  if (host === "youtu.be") {
    const id = url.pathname.split("/").find((segment) => segment !== "");
    return isVideoId(id) ? id : undefined;
  }

  const videoParam = url.searchParams.get("v");
  if (isVideoId(videoParam)) {
    return videoParam;
  }

  const segments = url.pathname.split("/").filter((segment) => segment !== "");
  const [prefix, id] = segments;
  if (prefix === undefined || !PATH_PREFIXES.has(prefix)) {
    return undefined;
  }

  return isVideoId(id) ? id : undefined;
};

const getBareUrl = (paragraph: ParagraphNode): string | undefined => {
  const [child] = paragraph.children;
  if (child === undefined || paragraph.children.length !== 1) {
    return undefined;
  }

  if (isLink(child)) {
    const [text] = child.children;
    if (text === undefined || !isText(text) || text.value !== child.url) {
      return undefined;
    }
    return child.url;
  }

  if (isText(child)) {
    const value = child.value.trim();
    return value === "" ? undefined : value;
  }

  return undefined;
};

const createYoutubeEmbedNode = ({ videoId, start }: YoutubeEmbed): HtmlNode => {
  const src = new URL(`https://www.youtube-nocookie.com/embed/${videoId}`);
  if (start !== undefined) {
    src.searchParams.set("start", String(start));
  }

  return {
    type: "html",
    value: `<div class="remark-youtube-embed">
  <iframe src="${src.toString()}" title="YouTube 動画 (${videoId})" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share" referrerpolicy="strict-origin-when-cross-origin" allowfullscreen loading="lazy"></iframe>
</div>`,
  };
};

export const remarkYoutubeEmbed = () => {
  return (tree: MarkdownTree) => {
    tree.children = tree.children.map((node) => {
      if (!isParagraph(node)) {
        return node;
      }

      const href = getBareUrl(node);
      if (href === undefined) {
        return node;
      }

      const embed = getYoutubeEmbed(href);
      if (embed === undefined) {
        return node;
      }

      return createYoutubeEmbedNode(embed);
    });
  };
};
