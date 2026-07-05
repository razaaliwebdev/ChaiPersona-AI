import { motion } from 'framer-motion';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import { Prism as SyntaxHighlighter } from 'react-syntax-highlighter';
import { oneDark } from 'react-syntax-highlighter/dist/esm/styles/prism';
import { Copy, Check } from 'lucide-react';
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { MessageAvatar } from './MessageAvatar';
import { MessageActions } from './MessageActions';
import { Button } from '@/components/ui/button';

function CodeBlock({ className, children }) {
  const [copied, setCopied] = useState(false);
  const match = /language-(\w+)/.exec(className || '');
  const language = match ? match[1] : '';
  const code = String(children).replace(/\n$/, '');

  const handleCopy = async () => {
    await navigator.clipboard.writeText(code);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  return (
    <div className="rounded-lg overflow-hidden my-3 border border-border">
      <div className="flex items-center justify-between px-4 py-2 bg-muted/50 border-b border-border">
        <span className="text-xs font-mono text-muted-foreground">
          {language || 'code'}
        </span>
        <Button
          variant="ghost"
          size="icon"
          className="size-7"
          onClick={handleCopy}
        >
          {copied ? (
            <Check className="size-3.5 text-emerald-500" />
          ) : (
            <Copy className="size-3.5" />
          )}
        </Button>
      </div>
      <SyntaxHighlighter
        style={oneDark}
        language={language}
        PreTag="div"
        customStyle={{
          margin: 0,
          borderRadius: 0,
          fontSize: '0.85rem',
        }}
      >
        {code}
      </SyntaxHighlighter>
    </div>
  );
}

const markdownComponents = {
  code({ node, inline, className, children, ...props }) {
    const match = /language-(\w+)/.exec(className || '');
    if (!inline && match) {
      return <CodeBlock className={className}>{children}</CodeBlock>;
    }
    return (
      <code
        className="bg-muted px-1.5 py-0.5 rounded-md text-sm font-mono"
        {...props}
      >
        {children}
      </code>
    );
  },
  p({ children }) {
    return <p className="mb-3 last:mb-0 leading-relaxed">{children}</p>;
  },
  ul({ children }) {
    return <ul className="list-disc list-inside mb-3 space-y-1">{children}</ul>;
  },
  ol({ children }) {
    return (
      <ol className="list-decimal list-inside mb-3 space-y-1">{children}</ol>
    );
  },
  h2({ children }) {
    return <h2 className="text-lg font-semibold mb-2 mt-4">{children}</h2>;
  },
  h3({ children }) {
    return <h3 className="text-base font-semibold mb-2 mt-3">{children}</h3>;
  },
  blockquote({ children }) {
    return (
      <blockquote className="border-l-2 border-primary pl-4 italic text-muted-foreground mb-3">
        {children}
      </blockquote>
    );
  },
  a({ children, href, ...props }) {
    return (
      <a className="text-primary hover:underline" href={href} {...props}>
        {children}
      </a>
    );
  },
  strong({ children }) {
    return <strong className="font-semibold">{children}</strong>;
  },
  table({ children }) {
    return (
      <div className="overflow-x-auto mb-3">
        <table className="min-w-full border border-border">{children}</table>
      </div>
    );
  },
  th({ children }) {
    return (
      <th className="border border-border bg-muted px-3 py-2 text-left text-sm font-medium">
        {children}
      </th>
    );
  },
  td({ children }) {
    return (
      <td className="border border-border px-3 py-2 text-sm">{children}</td>
    );
  },
};

function formatTimestamp(timestamp) {
  return new Date(timestamp).toLocaleTimeString([], {
    hour: '2-digit',
    minute: '2-digit',
  });
}

import {
  Message as MessageRoot,
  MessageContent,
  MessageFooter,
  MessageAvatar as MessageAvatarPrimitive,
} from '@/components/ui/message';
import { Bubble, BubbleContent } from '@/components/ui/bubble';

export function MessageBubble({ message, persona, isLast }) {
  if (message.role === 'user') {
    return (
      <motion.div
        initial={{ opacity: 0, y: 10 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.3 }}
      >
        <MessageRoot align="end" className="gap-3">
          <MessageAvatarPrimitive className="size-8 self-end">
            <div className="size-8 rounded-full bg-primary flex items-center justify-center text-primary-foreground font-semibold text-xs select-none">
              U
            </div>
          </MessageAvatarPrimitive>
          <MessageContent className="max-w-[70%]">
            <Bubble variant="default" align="end" className="rounded-2xl rounded-br-sm select-text overflow-visible">
              <BubbleContent className="px-4 py-2.5 leading-relaxed break-words text-sm">
                {message.content}
              </BubbleContent>
            </Bubble>
            <MessageFooter className="text-[10px] text-muted-foreground/60 select-none">
              {formatTimestamp(message.timestamp)} • Delivered
            </MessageFooter>
          </MessageContent>
        </MessageRoot>
      </motion.div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.3 }}
    >
      <MessageRoot align="start" className="gap-3 group">
        <MessageAvatarPrimitive className="size-8 self-end">
          <MessageAvatar persona={persona} />
        </MessageAvatarPrimitive>
        <MessageContent className="max-w-[80%]">
          <Bubble variant="outline" className="rounded-2xl rounded-bl-sm select-text overflow-visible">
            <BubbleContent className="p-4 leading-relaxed break-words text-foreground">
              <div className="prose prose-sm dark:prose-invert max-w-none">
                <ReactMarkdown
                  remarkPlugins={[remarkGfm]}
                  components={markdownComponents}
                >
                  {message.content}
                </ReactMarkdown>
              </div>
            </BubbleContent>
          </Bubble>
          <MessageFooter className="flex items-center gap-3 text-[10px] text-muted-foreground/60 select-none">
            <span>{formatTimestamp(message.timestamp)}</span>
            <MessageActions content={message.content} />
          </MessageFooter>
        </MessageContent>
      </MessageRoot>
    </motion.div>
  );
}
