import { Menu, Bot } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { ThemeToggle } from './ThemeToggle';

export function ChatHeader({
  persona,
  theme,
  toggleTheme,
  onMobileMenuClick,
  isMobile,
}) {
  return (
    <div className="sticky top-0 z-10 bg-background/80 backdrop-blur-lg border-b border-border">
      <div className="flex items-center justify-between h-14 px-4">
        {/* Left */}
        <div className="flex items-center gap-3">
          {isMobile && (
            <Button
              variant="ghost"
              size="icon"
              className="size-8"
              onClick={onMobileMenuClick}
            >
              <Menu className="size-5" />
            </Button>
          )}
          <div className="size-8 rounded-full overflow-hidden bg-muted flex items-center justify-center shrink-0 border border-border">
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
          <div>
            <span className="font-semibold text-sm">
              {persona?.name || 'AI Mentor'}
            </span>
            <div className="flex items-center gap-1.5">
              <span className="size-2 rounded-full bg-emerald-500" />
              <span className="text-xs text-emerald-500">Online</span>
            </div>
          </div>
        </div>

        {/* Right */}
        <div className="flex items-center gap-1">
          <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
        </div>
      </div>
    </div>
  );
}
