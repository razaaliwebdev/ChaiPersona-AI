import { motion } from 'framer-motion';
import { Cpu, Container, Code, Shield, Network, Database, Globe, GitBranch } from 'lucide-react';
import { suggestedPrompts } from '@/data/suggestedPrompts';

const iconMap = {
  Cpu,
  Container,
  Code,
  Shield,
  Network,
  Database,
  Globe,
  GitBranch,
};

export function SuggestedPrompts({ onPromptClick }) {
  return (
    <div className="px-4 pb-2">
      <div className="max-w-4xl mx-auto w-full flex flex-wrap gap-2">
        {suggestedPrompts.slice(0, 5).map((prompt) => {
          const Icon = iconMap[prompt.icon] || Code;
          return (
            <motion.button
              key={prompt.id}
              whileHover={{ scale: 1.03 }}
              whileTap={{ scale: 0.97 }}
              onClick={() => onPromptClick(prompt.text)}
              className="flex items-center gap-2 px-3 py-1.5 rounded-full border border-border bg-card hover:bg-muted/50 text-xs text-muted-foreground whitespace-nowrap transition-colors shrink-0"
            >
              <Icon className="size-3" />
              {prompt.text}
            </motion.button>
          );
        })}
      </div>
    </div>
  );
}
