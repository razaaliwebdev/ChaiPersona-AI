import { useState, useRef } from 'react';
import { SendHorizontal, Paperclip, Mic } from 'lucide-react';
import { Button } from '@/components/ui/button';

export function MessageInput({ onSend, disabled }) {
  const [value, setValue] = useState('');
  const textareaRef = useRef(null);

  const handleInput = (e) => {
    setValue(e.target.value);
    const textarea = textareaRef.current;
    if (textarea) {
      textarea.style.height = 'auto';
      textarea.style.height = `${textarea.scrollHeight}px`;
    }
  };

  const handleSend = () => {
    const trimmed = value.trim();
    if (!trimmed) return;
    onSend(trimmed);
    setValue('');
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSend();
    }
  };

  return (
    <div className="sticky bottom-0 p-4 bg-background/80 backdrop-blur-lg border-t border-border">
      <div className="max-w-4xl mx-auto w-full flex items-end gap-2 bg-card border border-border rounded-2xl px-3 py-2">
        <Button
          variant="ghost"
          size="icon"
          className="size-8 shrink-0 opacity-50"
          disabled
        >
          <Paperclip className="size-4" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="size-8 shrink-0 opacity-50"
          disabled
        >
          <Mic className="size-4" />
        </Button>
        <textarea
          ref={textareaRef}
          value={value}
          onChange={handleInput}
          onKeyDown={handleKeyDown}
          placeholder="Type your message..."
          rows={1}
          disabled={disabled}
          className="flex-1 bg-transparent resize-none outline-none text-foreground placeholder:text-muted-foreground max-h-36 min-h-[40px] py-2 text-sm leading-relaxed"
        />
        <Button
          variant="default"
          size="icon"
          className="size-8 shrink-0"
          disabled={!value.trim() || disabled}
          onClick={handleSend}
        >
          <SendHorizontal className="size-4" />
        </Button>
      </div>
    </div>
  );
}
