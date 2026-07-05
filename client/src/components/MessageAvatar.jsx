import { cn } from '@/lib/utils';
import { Bot } from 'lucide-react';

export function MessageAvatar({ persona }) {
  return (
    <div
      className={cn(
        'size-8 rounded-full overflow-hidden flex items-center justify-center shrink-0 border border-border bg-muted'
      )}
    >
      {persona?.image ? (
        <img
          src={persona.image}
          alt={persona.name}
          className="size-full object-cover"
        />
      ) : (
        <Bot className="size-4 text-muted-foreground" />
      )}
    </div>
  );
}
