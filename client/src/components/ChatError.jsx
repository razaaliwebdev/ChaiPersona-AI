import { AlertCircle, X } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function ChatError({ message, onDismiss }) {
  if (!message) return null;

  return (
    <div className="px-4 pt-3">
      <div className="max-w-4xl mx-auto flex items-start gap-3 rounded-xl border border-destructive/30 bg-destructive/10 px-4 py-3 text-sm text-destructive">
        <AlertCircle className="size-4 shrink-0 mt-0.5" />
        <p className="flex-1 leading-relaxed">{message}</p>
        <Button
          variant="ghost"
          size="icon"
          className="size-7 shrink-0 text-destructive hover:text-destructive"
          onClick={onDismiss}
        >
          <X className="size-4" />
        </Button>
      </div>
    </div>
  );
}
