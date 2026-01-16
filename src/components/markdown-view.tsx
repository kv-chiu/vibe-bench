import ReactMarkdown from 'react-markdown';
import { cn } from '@/lib/utils';

interface MarkdownViewProps {
  content: string;
  className?: string;
}

export function MarkdownView({ content, className }: MarkdownViewProps) {
  return (
    <article
      className={cn(
        'prose prose-invert max-w-none',
        'prose-headings:font-heading prose-headings:font-bold prose-headings:tracking-tight',
        'prose-h1:text-3xl prose-h2:text-2xl prose-h3:text-xl',
        'prose-p:text-muted prose-p:leading-relaxed',
        'prose-a:text-primary prose-a:no-underline hover:prose-a:underline',
        'prose-code:text-primary prose-code:bg-secondary/10 prose-code:px-1 prose-code:rounded-sm prose-code:font-mono prose-code:before:content-none prose-code:after:content-none',
        'prose-pre:bg-surface prose-pre:border prose-pre:border-white/5 prose-pre:shadow-sm',
        'prose-li:text-muted',
        'prose-strong:text-white',
        className
      )}
    >
      <ReactMarkdown>{content}</ReactMarkdown>
    </article>
  );
}
