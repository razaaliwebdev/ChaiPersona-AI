import { useState } from 'react';
import { useChat } from '@/hooks/useChat';
import { useTheme } from '@/hooks/useTheme';
import { useMobile } from '@/hooks/useMobile';
import { personas } from '@/data/personas';
import { Sidebar } from './Sidebar';
import { ChatHeader } from './ChatHeader';
import { ChatMessages } from './ChatMessages';
import { MessageInput } from './MessageInput';
import { ChatError } from './ChatError';
import { SuggestedPrompts } from './SuggestedPrompts';
import { Sheet, SheetContent } from '@/components/ui/sheet';

export function ChatLayout() {
  const chat = useChat();
  const { theme, toggleTheme } = useTheme();
  const isMobile = useMobile();
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleSendMessage = (content) => {
    chat.sendMessage(content);
  };

  const handleSelectPersona = (personaId) => {
    chat.switchPersona(personaId);
    setSidebarOpen(false);
  };

  const handleNewChat = () => {
    chat.clearConversation();
  };

  const handlePromptClick = (text) => {
    chat.sendMessage(text);
  };

  return (
    <div className="flex h-screen w-screen bg-background text-foreground overflow-hidden">
      {/* Desktop Sidebar */}
      {!isMobile && (
        <Sidebar
          personas={personas}
          activePersona={chat.activePersona}
          onSelectPersona={handleSelectPersona}
          onNewChat={handleNewChat}
          onClearChat={chat.clearConversation}
          theme={theme}
          toggleTheme={toggleTheme}
        />
      )}

      {/* Mobile Sidebar Sheet */}
      {isMobile && (
        <Sheet open={sidebarOpen} onOpenChange={setSidebarOpen}>
          <SheetContent side="left" className="p-0 w-80" showCloseButton={false}>
            <Sidebar
              personas={personas}
              activePersona={chat.activePersona}
              onSelectPersona={handleSelectPersona}
              onNewChat={handleNewChat}
              onClearChat={chat.clearConversation}
              theme={theme}
              toggleTheme={toggleTheme}
            />
          </SheetContent>
        </Sheet>
      )}

      {/* Main Chat Area */}
      <div className="flex-1 flex flex-col min-w-0">
        <ChatHeader
          persona={chat.activePersona}
          theme={theme}
          toggleTheme={toggleTheme}
          onMobileMenuClick={() => setSidebarOpen(true)}
          isMobile={isMobile}
        />

        <ChatMessages
          messages={chat.messages}
          persona={chat.activePersona}
          isTyping={chat.isTyping}
          onPromptClick={handlePromptClick}
        />

        <ChatError message={chat.error} onDismiss={chat.dismissError} />

        {chat.messages.length > 0 && (
          <SuggestedPrompts onPromptClick={handlePromptClick} />
        )}

        <MessageInput
          onSend={handleSendMessage}
          disabled={chat.isTyping}
        />
      </div>
    </div>
  );
}
