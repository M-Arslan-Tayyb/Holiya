// Generate unique session ID for new chats
export const generateSessionId = (): string => {
  return `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`;
};

// Check if session is new (no backend ID yet)
export const isNewSession = (sessionId: string): boolean => {
  return sessionId.startsWith("new-") || sessionId.includes("-");
};
