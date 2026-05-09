"use client";

import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import type { Components } from "react-markdown";
import type { AnchorHTMLAttributes } from "react";

interface BlogContentProps {
  content: string;
}

const components: Components = {
  a: ({
    href,
    children,
    ...props
  }: AnchorHTMLAttributes<HTMLAnchorElement>) => {
    const isExternal = href?.startsWith("http");
    return (
      <a
        href={href}
        {...props}
        {...(isExternal
          ? { target: "_blank", rel: "noopener noreferrer" }
          : {})}
      >
        {children}
      </a>
    );
  },
};

export function BlogContent({ content }: BlogContentProps) {
  return (
    <div className="prose prose-orange max-w-none dark:prose-invert prose-headings:font-bold prose-a:text-orange-600 prose-a:no-underline hover:prose-a:underline prose-img:rounded-xl">
      <ReactMarkdown remarkPlugins={[remarkGfm]} components={components}>
        {content}
      </ReactMarkdown>
    </div>
  );
}
