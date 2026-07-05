import { motion } from 'framer-motion';
import { cn } from '@/lib/utils';
import { Badge } from '@/components/ui/badge';
import { Bot } from 'lucide-react';

export function PersonaCard({ persona, isActive, onSelect }) {
  return (
    <motion.button
      whileHover={{ y: -2, transition: { duration: 0.2 } }}
      whileTap={{ scale: 0.98 }}
      onClick={() => onSelect(persona.id)}
      className={cn(
        'w-full text-left p-4 rounded-2xl border transition-all duration-300 relative overflow-hidden cursor-pointer',
        isActive
          ? 'bg-gradient-to-br from-primary/12 to-primary/2 border-primary/45 shadow-[0_4px_20px_rgba(217,127,54,0.08)]'
          : 'bg-card/25 border-border/30 hover:bg-card/65 hover:border-border/60'
      )}
    >
      {/* Selection Left Accent Bar */}
      {isActive && (
        <div className="absolute left-0 top-0 bottom-0 w-1 bg-primary rounded-r" />
      )}
      
      <div className="flex items-center gap-3.5">
        <div className={cn(
          "size-12 rounded-full overflow-hidden bg-muted flex items-center justify-center shrink-0 border transition-transform duration-300",
          isActive ? "border-primary/50 scale-105" : "border-border/50"
        )}>
          {persona.image ? (
            <img
              src={persona.image}
              alt={persona.name}
              className="size-full object-cover"
            />
          ) : (
            <Bot className="size-6 text-muted-foreground" />
          )}
        </div>
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2">
            <span className={cn(
              "font-bold text-sm truncate transition-colors",
              isActive ? "text-foreground" : "text-foreground/90"
            )}>
              {persona.name}
            </span>
            {persona.status === 'online' && (
              <span className="size-2 rounded-full bg-emerald-500 shrink-0 relative">
                <span className="absolute inset-0 rounded-full bg-emerald-500 animate-ping opacity-75" />
              </span>
            )}
          </div>
        </div>
      </div>
    </motion.button>
  );
}
