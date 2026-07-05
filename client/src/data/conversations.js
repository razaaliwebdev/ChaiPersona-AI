let messageCounter = 0;

export const sampleConversation = [];

export function createMessage(role, content) {
  messageCounter += 1;
  return {
    id: `${Date.now()}-${messageCounter}`,
    role,
    content,
    timestamp: new Date(),
  };
}
