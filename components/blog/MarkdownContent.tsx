import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import rehypeHighlight from "rehype-highlight";
// highlight.js theme — base dark colours; accent overrides applied in globals.css
import "highlight.js/styles/github-dark.css";

/** Extract a YouTube video ID from any common YouTube URL format. */
function getYouTubeId(url: string): string | null {
  const m = url.match(
    /(?:youtube\.com\/(?:watch\?(?:.*&)?v=|embed\/|shorts\/)|youtu\.be\/)([A-Za-z0-9_-]{11})/
  );
  return m ? m[1] : null;
}

/**
 * Renders Notion → notion-to-md markdown into the site theme.
 *
 * - Syntax highlighting via rehype-highlight (highlight.js github-dark theme,
 *   accent colour overrides in .blog-prose in globals.css).
 * - YouTube video blocks: notion-to-md emits them as plain markdown links
 *   ([title](https://youtube.com/watch?v=ID)). We detect those and render an
 *   embedded iframe instead.
 * - External links open in a new tab; internal links don't.
 */
export default function MarkdownContent({ markdown }: { markdown: string }) {
  return (
    <div className="blog-prose">
      <ReactMarkdown
        remarkPlugins={[remarkGfm]}
        rehypePlugins={[rehypeHighlight]}
        components={{
          a: ({ href, children, ...props }) => {
            if (typeof href === "string") {
              const ytId = getYouTubeId(href);
              if (ytId) {
                return (
                  <span className="block my-6 aspect-video w-full overflow-hidden rounded-[14px] border border-border-subtle">
                    <iframe
                      src={`https://www.youtube.com/embed/${ytId}`}
                      title={typeof children === "string" ? children : "Video"}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                      className="h-full w-full"
                      style={{ border: "none" }}
                    />
                  </span>
                );
              }
              const external = /^https?:\/\//.test(href);
              return (
                <a
                  href={href}
                  {...(external ? { target: "_blank", rel: "noopener noreferrer" } : {})}
                  {...props}
                >
                  {children}
                </a>
              );
            }
            return <a {...props}>{children}</a>;
          },
          img: ({ src, alt }) => (
            // eslint-disable-next-line @next/next/no-img-element
            <img src={typeof src === "string" ? src : ""} alt={alt ?? ""} loading="lazy" />
          ),
        }}
      >
        {markdown}
      </ReactMarkdown>
    </div>
  );
}
