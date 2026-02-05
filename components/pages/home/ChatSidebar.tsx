"use client";

import { useState, useEffect } from "react";
import { Trash2, Plus, X, Menu } from "lucide-react";
import gsap from "gsap";

interface ChatSession {
  id: string;
  title: string;
  chat_session_id?: number;
  created_at?: string;
}

interface ChatSidebarProps {
  isVisible: boolean;
  sessions: ChatSession[];
  isLoading: boolean;
  currentSessionId?: string;
  onNewChat: () => void;
  onSelectChat: (sessionId: string, chatSessionId?: number) => void;
}

export function ChatSidebar({
  isVisible,
  sessions,
  isLoading,
  currentSessionId,
  onNewChat,
  onSelectChat,
}: ChatSidebarProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [isMobile, setIsMobile] = useState(false);
  const [hoveredId, setHoveredId] = useState<string | null>(null);

  useEffect(() => {
    const checkMobile = () => setIsMobile(window.innerWidth < 768);
    checkMobile();
    window.addEventListener("resize", checkMobile);
    return () => window.removeEventListener("resize", checkMobile);
  }, []);

  useEffect(() => {
    if (isVisible) {
      const timer = setTimeout(() => {
        gsap.fromTo(
          ".sidebar-container",
          { x: -300, opacity: 0 },
          { x: 0, opacity: 1, duration: 0.6, ease: "power2.out" },
        );
      }, 300);
      return () => clearTimeout(timer);
    }
  }, [isVisible]);

  const handleDeleteChat = (e: React.MouseEvent, sessionId: string) => {
    e.stopPropagation();
    // TODO: Add delete API call
    console.log("Delete chat:", sessionId);
  };

  const handleSelect = (session: ChatSession) => {
    onSelectChat(session.id, session.chat_session_id);
    if (isMobile) setIsOpen(false);
  };

  if (!isVisible) return null;

  if (isMobile) {
    return (
      <>
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="fixed top-20 left-4 z-50 bg-white/60 backdrop-blur-sm p-2.5 rounded-lg shadow-md border border-text-gray/10 hover:bg-white/80 transition-all"
        >
          {isOpen ? (
            <X className="w-5 h-5 text-text-gray/70" />
          ) : (
            <Menu className="w-5 h-5 text-text-gray/70" />
          )}
        </button>

        {isOpen && (
          <>
            <div
              className="fixed inset-0 bg-black/10 backdrop-blur-sm z-40"
              onClick={() => setIsOpen(false)}
            />
            <div className="sidebar-container fixed top-20 left-0 h-[calc(100vh-5rem)] w-72 bg-white/70 backdrop-blur-lg shadow-xl z-50 flex flex-col rounded-r-3xl border-r border-text-gray/5">
              <SidebarContent
                sessions={sessions}
                isLoading={isLoading}
                currentSessionId={currentSessionId}
                hoveredId={hoveredId}
                setHoveredId={setHoveredId}
                onNewChat={onNewChat}
                onDeleteChat={handleDeleteChat}
                onSelectChat={handleSelect}
              />
            </div>
          </>
        )}
      </>
    );
  }

  return (
    <div className="sidebar-container fixed top-30 left-0 h-[calc(100vh-5rem)] w-72 bg-white/50 backdrop-blur-lg shadow-lg flex flex-col rounded-r-3xl border-r border-text-gray/5">
      <SidebarContent
        sessions={sessions}
        isLoading={isLoading}
        currentSessionId={currentSessionId}
        hoveredId={hoveredId}
        setHoveredId={setHoveredId}
        onNewChat={onNewChat}
        onDeleteChat={handleDeleteChat}
        onSelectChat={handleSelect}
      />
    </div>
  );
}

function SidebarContent({
  sessions,
  isLoading,
  currentSessionId,
  hoveredId,
  setHoveredId,
  onNewChat,
  onDeleteChat,
  onSelectChat,
}: {
  sessions: ChatSession[];
  isLoading: boolean;
  currentSessionId?: string;
  hoveredId: string | null;
  setHoveredId: (id: string | null) => void;
  onNewChat: () => void;
  onDeleteChat: (e: React.MouseEvent, sessionId: string) => void;
  onSelectChat: (session: ChatSession) => void;
}) {
  return (
    <>
      <div className="p-4 border-b border-text-gray/30 mt-2">
        <button
          onClick={onNewChat}
          className="w-full flex items-center justify-center gap-2 px-4 py-3 bg-gradient-to-r from-primary/90 to-button/90 rounded-xl text-white font-sans font-medium text-sm hover:shadow-md hover:scale-[1.02] transition-all"
        >
          <Plus className="w-5 h-5" />
          New Chat
        </button>
      </div>

      <div className="flex-1 overflow-y-auto px-3 py-2">
        <h3 className="text-xs font-sans font-semibold text-text-gray uppercase tracking-wider px-3 py-2">
          Recent Chats
        </h3>

        {isLoading ? (
          <div className="px-3 py-4 text-sm text-text-gray/60">Loading...</div>
        ) : sessions.length === 0 ? (
          <div className="px-3 py-4 text-sm text-text-gray/60 italic">
            No chats yet
          </div>
        ) : (
          <div className="space-y-1.5">
            {sessions.map((session) => (
              <div
                key={session.id}
                className={`group relative rounded-xl transition-all duration-200 cursor-pointer ${
                  currentSessionId === session.id
                    ? "bg-primary/8 border border-primary/15 shadow-sm"
                    : "hover:bg-white/40 border border-transparent"
                }`}
                onMouseEnter={() => setHoveredId(session.id)}
                onMouseLeave={() => setHoveredId(null)}
                onClick={() => onSelectChat(session)}
              >
                <div className="flex items-center gap-3 p-3 pr-2">
                  <div className="flex-1 min-w-0">
                    <p
                      className={`text-sm font-sans line-clamp-2 leading-snug ${
                        currentSessionId === session.id
                          ? "text-text-gray font-medium"
                          : "text-text-gray/80"
                      }`}
                    >
                      {session.title}
                    </p>
                  </div>
                  {hoveredId === session.id && (
                    <button
                      onClick={(e) => onDeleteChat(e, session.id)}
                      className="flex-shrink-0 p-2 rounded-lg bg-white/60 hover:bg-red-50 text-text-gray/30 hover:text-red-400 transition-all shadow-sm"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  )}
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      <div className="p-4 border-t border-text-gray/5">
        <div className="text-xs text-text-gray/40 font-sans text-center italic">
          Your health companion
        </div>
      </div>
    </>
  );
}
