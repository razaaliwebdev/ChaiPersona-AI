import { motion } from 'framer-motion';
import { Sparkles, Code, Server, Network, Container, ChevronRight } from 'lucide-react';
import { suggestedPrompts } from '@/data/suggestedPrompts';

const iconMap = {
  Code,
  Server,
  Network,
  Container,
};

export function EmptyState({ onPromptClick, personaName }) {
  return (
    <div className="flex-1 flex flex-col items-center justify-center px-6 py-16 max-w-xl mx-auto w-full relative">
      {/* Decorative Glow Background */}
      <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-72 h-72 bg-primary/5 blur-[120px] rounded-full pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className="text-center w-full z-10"
      >
        <motion.div
          animate={{ y: [0, -6, 0] }}
          transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
          className="inline-flex items-center justify-center size-20 rounded-3xl bg-primary/10 border border-primary/20 shadow-[0_0_30px_rgba(217,127,54,0.15)] mb-8 relative"
        >
          <Sparkles className="size-10 text-primary" />
          <div className="absolute inset-0 rounded-3xl border border-primary/30 animate-pulse" />
        </motion.div>

        <h1 className="text-3xl font-extrabold tracking-tight mb-3 bg-gradient-to-b from-foreground to-foreground/75 bg-clip-text text-transparent">
          Chai Persona AI
        </h1>
        <p className="text-sm text-muted-foreground max-w-sm mx-auto mb-10 leading-relaxed">
          Start a learning session with <span className="text-primary font-medium">{personaName || 'your mentor'}</span>. Click a topic below or type a query to begin.
        </p>
      </motion.div>

      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 w-full z-10">
        {suggestedPrompts.slice(0, 4).map((prompt, index) => {
          const Icon = iconMap[prompt.icon] || Code;
          return (
            <motion.button
              key={prompt.id}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.08 * index, ease: [0.16, 1, 0.3, 1] }}
              whileHover={{ y: -3, transition: { duration: 0.2 } }}
              onClick={() => onPromptClick(prompt.text)}
              className="group flex items-center justify-between p-4 rounded-2xl border border-border/40 bg-card/30 hover:bg-card/75 hover:border-primary/40 hover:shadow-[0_4px_20px_rgba(217,127,54,0.05)] text-left transition-all duration-300 backdrop-blur-sm cursor-pointer"
            >
              <div className="flex items-center gap-4.5">
                <div className="size-11 rounded-xl bg-primary/8 border border-primary/15 flex items-center justify-center shrink-0 transition-colors group-hover:bg-primary/15">
                  <Icon className="size-5 text-primary" />
                </div>
                <div className="flex flex-col">
                  <span className="text-sm font-semibold text-foreground leading-snug">
                    {prompt.text}
                  </span>
                  <span className="text-[11px] text-muted-foreground/80 mt-0.5">
                    Click to ask mentor
                  </span>
                </div>
              </div>
              <ChevronRight className="size-4 text-muted-foreground/45 group-hover:text-primary transition-all transform group-hover:translate-x-1" />
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
