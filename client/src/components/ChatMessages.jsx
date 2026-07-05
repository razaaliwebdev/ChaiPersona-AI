import {
  MessageScrollerProvider,
  MessageScroller,
  MessageScrollerViewport,
  MessageScrollerContent,
  MessageScrollerItem,
  MessageScrollerButton,
} from "@/components/ui/message-scroller";
import { MessageBubble } from './MessageBubble';
import { TypingIndicator } from './TypingIndicator';
import { EmptyState } from './EmptyState';

export function ChatMessages({ messages, persona, isTyping, onPromptClick }) {
  if (messages.length === 0) {
    return (
      <div className="flex-1 overflow-y-auto flex items-center justify-center p-4">
        <EmptyState
          onPromptClick={onPromptClick}
          personaName={persona?.name}
        />
      </div>
    );
  }

  return (
    <MessageScrollerProvider>
      <MessageScroller className="flex-1">
        <MessageScrollerViewport className="p-4 custom-scrollbar">
          <MessageScrollerContent className="space-y-6 max-w-4xl mx-auto w-full">
            {messages.map((message, index) => (
              <MessageScrollerItem
                key={message.id}
                messageId={message.id.toString()}
                scrollAnchor={index === messages.length - 1}
              >
                <MessageBubble
                  message={message}
                  persona={persona}
                  isLast={index === messages.length - 1}
                />
              </MessageScrollerItem>
            ))}
            {isTyping && (
              <MessageScrollerItem messageId="typing" scrollAnchor={true}>
                <TypingIndicator persona={persona} />
              </MessageScrollerItem>
            )}
          </MessageScrollerContent>
        </MessageScrollerViewport>
        <MessageScrollerButton />
      </MessageScroller>
    </MessageScrollerProvider>
  );
}
