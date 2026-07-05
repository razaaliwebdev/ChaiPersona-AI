import { Bot, Plus, Trash2 } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Separator } from '@/components/ui/separator';
import { ThemeToggle } from './ThemeToggle';
import { PersonaCard } from './PersonaCard';

const GithubIcon = (props) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    strokeLinecap="round"
    strokeLinejoin="round"
    {...props}
  >
    <path d="M15 22v-4a4.8 4.8 0 0 0-1-3.5c3 0 6-2 6-5.5.08-1.25-.27-2.48-1-3.5.28-1.15.28-2.35 0-3.5 0 0-1 0-3 1.5-2.64-.5-5.36-.5-8 0C6 2 5 2 5 2c-.3 1.15-.3 2.35 0 3.5A5.403 5.403 0 0 0 4 9c0 3.5 3 5.5 6 5.5-.39.49-.68 1.05-.85 1.65-.17.6-.22 1.23-.15 1.85v4" />
    <path d="M9 18c-4.51 2-5-2-7-2" />
  </svg>
);

export function Sidebar({
  personas,
  activePersona,
  onSelectPersona,
  onNewChat,
  onClearChat,
  theme,
  toggleTheme,
}) {
  return (
    <div className="h-full flex flex-col bg-[var(--sidebar-bg)] border-r border-dashed border-border/40 relative transition-all duration-300 select-none shrink-0 overflow-x-hidden w-80">
      {/* Logo */}
      <div className="p-4 flex items-center gap-2.5 border-b border-border/10 justify-start">
        <div className="size-8 rounded-xl bg-primary/10 border border-primary/20 flex items-center justify-center shrink-0">
          <Bot className="size-5 text-primary" />
        </div>
        <span className="text-lg font-extrabold tracking-tight bg-gradient-to-r from-primary to-amber-500 bg-clip-text text-transparent">
          Chai Persona
        </span>
      </div>

      {/* Persona Selector List */}
      <div className="flex-1 overflow-y-auto p-3 space-y-3 custom-scrollbar">
        <p className="text-[10px] font-bold text-muted-foreground/60 uppercase tracking-widest pl-2 mb-2">
          Mentors
        </p>
        <div className="space-y-3">
          {personas.map((persona) => {
            const isActive = activePersona?.id === persona.id;

            return (
              <PersonaCard
                key={persona.id}
                persona={persona}
                isActive={isActive}
                onSelect={() => onSelectPersona(persona.id)}
              />
            );
          })}
        </div>
      </div>

      <Separator className="bg-border/10" />

      {/* Navigation Options */}
      <div className="p-4 space-y-2">
        <Button
          variant="ghost"
          className="w-full justify-start gap-2.5 rounded-xl cursor-pointer hover:bg-primary/8 hover:text-primary transition-all duration-200 py-5"
          onClick={onNewChat}
        >
          <Plus className="size-4" />
          <span className="text-xs font-semibold">New Chat</span>
        </Button>
        <Button
          variant="ghost"
          className="w-full justify-start gap-2.5 rounded-xl cursor-pointer text-destructive/80 hover:text-destructive hover:bg-destructive/10 transition-all duration-200 py-5"
          onClick={onClearChat}
        >
          <Trash2 className="size-4" />
          <span className="text-xs font-semibold">Clear Conversation</span>
        </Button>
      </div>

      <Separator className="bg-border/10" />

      {/* Footer */}
      <div className="p-4 bg-card/10">
        <div className="flex items-center justify-between px-1">
          <span className="text-[10px] font-medium text-muted-foreground/50">v1.0.0</span>
          <div className="flex items-center gap-2">
            <Button variant="ghost" size="icon" className="size-8 rounded-full hover:bg-muted/50 cursor-pointer">
              <GithubIcon className="size-4 text-muted-foreground/70 hover:text-foreground transition-colors" />
            </Button>
            <ThemeToggle theme={theme} toggleTheme={toggleTheme} />
          </div>
        </div>
      </div>
    </div>
  );
}
