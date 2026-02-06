"use client";

import {
  useState,
  useEffect,
  useRef,
  useLayoutEffect,
  useCallback,
} from "react";
import gsap from "gsap";
import { HoliyaLogo } from "@/components/custom/HoliyaLogo";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChatSidebar } from "@/components/pages/home/ChatSidebar";
import { Header } from "@/components/common/UserDropdown";
import { useSession } from "next-auth/react";
import {
  useSendMessageMutation,
  useGetSessionsQuery,
  useLazyGetMessagesQuery,
} from "@/services/features/chat/api";
import { generateSessionId } from "@/lib/chatUtils";
import { toast } from "sonner";
import { ChatSession as ApiChatSession } from "@/services/features/chat/types";
import ReactMarkdown from "react-markdown";
import remarkGfm from "remark-gfm";
import { ArrowUp, Copy, Check } from "lucide-react";

// Local interface for component state
interface Message {
  role: "user" | "ai";
  content: string;
  id?: number;
  isLoading?: boolean;
}

interface ChatSession {
  id: string;
  title: string;
  chat_session_id?: number;
  created_at?: string;
}

export default function HomePage() {
  const { data: authSession } = useSession();
  const [step, setStep] = useState<1 | 2 | 3>(1);
  const [isAnimating, setIsAnimating] = useState(false);
  const [inputValue, setInputValue] = useState("");
  const [currentSessionId, setCurrentSessionId] = useState<string>("new");
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatSessions, setChatSessions] = useState<ChatSession[]>([]);
  const [isNewChat, setIsNewChat] = useState(true);
  const [copiedId, setCopiedId] = useState<number | null>(null);
  const { data: session } = useSession();

  const messagesEndRef = useRef<HTMLDivElement>(null);
  const step1TextRef = useRef<HTMLDivElement>(null);
  const step2TextRef = useRef<HTMLDivElement>(null);
  const step3ContainerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const avatarRef = useRef<HTMLDivElement>(null);

  // RTK Query hooks
  const [sendMessage, { isLoading: isSending }] = useSendMessageMutation();
  const { data: sessionsData, isLoading: isLoadingSessions } =
    useGetSessionsQuery(
      { user_id: Number(authSession?.user?.id) || 0 },
      { skip: !authSession?.user?.id },
    );
  const [fetchMessages, { isFetching: isLoadingMessages }] =
    useLazyGetMessagesQuery();

  // Load sessions from API
  useEffect(() => {
    if (sessionsData?.data) {
      const sessions: ChatSession[] = sessionsData.data.map(
        (session: ApiChatSession) => ({
          id: session.session_id,
          title: session.first_message?.user_message || "New conversation",
          chat_session_id: session.chat_session_id,
          created_at: session.created_at,
        }),
      );
      setChatSessions(sessions);
    }
  }, [sessionsData]);

  // Auto-scroll to bottom
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  // Welcome animation sequence
  useEffect(() => {
    if (step !== 1 || isAnimating) return;

    const timer = setTimeout(() => {
      setIsAnimating(true);
      const tl = gsap.timeline({
        onComplete: () => {
          setStep(2);
          setIsAnimating(false);
        },
      });

      tl.to(step1TextRef.current, {
        opacity: 0,
        filter: "blur(8px)",
        y: -30,
        duration: 0.6,
        ease: "power2.inOut",
      });

      tl.fromTo(
        avatarRef.current,
        { opacity: 0, x: -20 },
        { opacity: 1, x: 0, duration: 0.5, ease: "power2.out" },
        "-=0.3",
      );

      tl.to(
        logoRef.current,
        { scale: 0.5, duration: 0.6, ease: "power2.inOut" },
        "-=0.4",
      );
    }, 2000);

    return () => clearTimeout(timer);
  }, [step, isAnimating]);

  useEffect(() => {
    if (step !== 2 || isAnimating) return;

    const timer = setTimeout(() => {
      setIsAnimating(true);
      const tl = gsap.timeline({
        onComplete: () => {
          setStep(3);
          setIsAnimating(false);
        },
      });

      tl.to(step2TextRef.current, {
        opacity: 0,
        filter: "blur(8px)",
        y: -20,
        duration: 0.6,
        ease: "power2.inOut",
      });

      tl.to(
        logoRef.current,
        { opacity: 0, scale: 0.5, duration: 0.4, ease: "power2.inOut" },
        "-=0.3",
      );
    }, 4000);

    return () => clearTimeout(timer);
  }, [step, isAnimating]);

  useLayoutEffect(() => {
    if (step !== 2 || !step2TextRef.current) return;
    gsap.fromTo(
      step2TextRef.current,
      { opacity: 0, y: 40, filter: "blur(8px)" },
      {
        opacity: 1,
        y: 0,
        filter: "blur(0px)",
        duration: 1,
        ease: "power3.out",
        delay: 0.2,
      },
    );
  }, [step]);

  useLayoutEffect(() => {
    if (step !== 3 || !step3ContainerRef.current) return;
    const tl = gsap.timeline();
    tl.fromTo(
      step3ContainerRef.current,
      { opacity: 0 },
      { opacity: 1, duration: 0.5 },
    );
    tl.fromTo(
      ".chat-container",
      { opacity: 0 },
      { opacity: 1, duration: 0.5 },
      "-=0.3",
    );
    tl.fromTo(
      ".input-section",
      { y: 20, opacity: 0 },
      { y: 0, opacity: 1, duration: 0.5, ease: "power2.out" },
      "-=0.2",
    );
  }, [step]);

  // Handle sending message
  const handleSendMessage = async () => {
    if (!inputValue.trim() || !authSession?.user?.id) return;

    const userMsg = inputValue.trim();
    setInputValue("");

    // Optimistically add user message
    const tempUserMsg: Message = { role: "user", content: userMsg };
    setMessages((prev) => [...prev, tempUserMsg]);

    // Add loading state for AI
    const loadingMsg: Message = { role: "ai", content: "", isLoading: true };
    setMessages((prev) => [...prev, loadingMsg]);

    try {
      const sessionId =
        currentSessionId === "new" ? generateSessionId() : currentSessionId;

      // Update current session if new
      if (currentSessionId === "new") {
        setCurrentSessionId(sessionId);
        setIsNewChat(true);
      }

      const result = await sendMessage({
        user_id: Number(authSession.user.id),
        session_id: sessionId,
        user_message: userMsg,
      }).unwrap();

      const isSuccess =
        result.succeeded ?? (result.data?.ai_response ? true : false);

      if (!isSuccess) {
        throw new Error(result.message || "Failed to send message");
      }

      // Replace loading with actual response
      setMessages((prev) => {
        const withoutLoading = prev.filter((m) => !m.isLoading);
        return [
          ...withoutLoading,
          {
            role: "ai",
            content: result.data.ai_response,
            id: Date.now(),
          },
        ];
      });

      // If this was a new chat, add to sidebar optimistically
      if (isNewChat) {
        const newSession: ChatSession = {
          id: sessionId,
          title: userMsg,
          created_at: new Date().toISOString(),
        };
        setChatSessions((prev) => [newSession, ...prev]);
        setIsNewChat(false);
      }
    } catch (error: any) {
      setMessages((prev) => prev.filter((m) => !m.isLoading));
      toast.error(error.message || "Failed to send message");
    }
  };

  // Handle selecting a chat from sidebar
  const handleSelectChat = useCallback(
    async (sessionId: string, chatSessionId?: number) => {
      setCurrentSessionId(sessionId);
      setIsNewChat(false);

      if (chatSessionId && sessionId !== "new") {
        try {
          const result = await fetchMessages({
            chat_session_id: chatSessionId,
          }).unwrap();

          const isSuccess = result.succeeded ?? (result.data ? true : false);

          if (isSuccess && result.data) {
            const loadedMessages: Message[] = result.data.flatMap((msg) => [
              { role: "user", content: msg.user_message, id: msg.message_id },
              { role: "ai", content: msg.ai_response, id: msg.message_id + 1 },
            ]);
            setMessages(loadedMessages);
          } else {
            throw new Error(result.message || "Failed to load messages");
          }
        } catch (error: any) {
          toast.error(error.message || "Failed to load chat history");
          setMessages([]);
        }
      } else {
        setMessages([
          {
            role: "ai",
            content: `Hello! I'm ${"HoliyaAi"}, your health companion. How can I help you today?`,
          },
        ]);
      }
    },
    [fetchMessages, session?.user?.userName],
  );

  // Handle new chat button
  const handleNewChat = () => {
    setCurrentSessionId("new");
    setIsNewChat(true);
    setMessages([
      {
        role: "ai",
        content: `Hello! I'm ${"HoliyaAi"}, your health companion. How can I help you today?`,
      },
    ]);
  };

  // Handle delete session from local state
  const handleDeleteSession = (sessionId: string) => {
    setChatSessions((prev) => prev.filter((s) => s.id !== sessionId));
    if (currentSessionId === sessionId) {
      handleNewChat();
    }
    toast.success("Chat removed");
  };

  // Handle copy to clipboard
  const handleCopy = async (content: string, id: number) => {
    try {
      await navigator.clipboard.writeText(content);
      setCopiedId(id);
      setTimeout(() => setCopiedId(null), 2000);
      toast.success("Copied to clipboard");
    } catch {
      toast.error("Failed to copy");
    }
  };

  // Initial load - show new chat
  useEffect(() => {
    if (step === 3 && messages.length === 0) {
      handleNewChat();
    }
  }, [step, messages.length, session?.user?.userName]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      if (isSending) return;
      handleSendMessage();
    }
  };

  // Custom markdown components
  const markdownComponents = {
    p: ({ children }: any) => (
      <p className="mb-2 last:mb-0 leading-relaxed whitespace-pre-wrap">
        {children}
      </p>
    ),
    strong: ({ children }: any) => (
      <strong className="font-semibold text-text-gray">{children}</strong>
    ),
    ul: ({ children }: any) => (
      <ul className="list-disc pl-4 mb-2 space-y-1">{children}</ul>
    ),
    li: ({ children }: any) => <li className="leading-relaxed">{children}</li>,
    hr: () => <hr className="my-3 border-text-gray/20" />,
    em: ({ children }: any) => (
      <em className="italic font-serif">{children}</em>
    ),
  };

  return (
    <div className="flex flex-col min-h-screen bg-transparent">
      {/* Header Component */}
      <Header />

      {/* Spacer for fixed header - reduced height */}
      <div className="h-16 md:h-20" aria-hidden="true" />

      {/* Sidebar */}
      <ChatSidebar
        isVisible={step === 3}
        sessions={chatSessions}
        isLoading={isLoadingSessions}
        currentSessionId={currentSessionId}
        onNewChat={handleNewChat}
        onSelectChat={handleSelectChat}
        onDeleteSession={handleDeleteSession}
      />

      {(step === 2 || step === 3) && (
        <div
          ref={avatarRef}
          className={`flex gap-3 items-center mt-6 px-4 transition-all duration-300 ${
            step === 3 ? "ml-8 md:ml-72 lg:ml-80 pt-2" : "ml-0 pt-4"
          }`}
        >
          <Avatar className="md:w-12 md:h-12 h-10 w-10">
            <AvatarImage
              src="/holiya-user-image2.jpg"
              alt={"HoliyaAi"}
              className="object-cover" // Ensures the image fills the circle without stretching
            />
            <AvatarFallback className="bg-gray-800 text-white text-xs font-bold">
              {"HL"}
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col leading-tight">
            <span className="text-lg font-sans text-text-gray font-medium leading-tight">
              Hello!
            </span>
            <span className="text-sm italic font-serif text-text-gray/80">
              {"HoliyaAi"}
            </span>
          </div>
        </div>
      )}

      {/* Main Content - FIXED RESPONSIVE LAYOUT */}
      <div
        className={`flex-1 flex flex-col transition-all duration-300 ${
          step === 3 ? "md:ml-72 lg:ml-80" : ""
        }`}
      >
        <div
          className={`w-full h-full mx-auto px-3 sm:px-4 ${
            step === 3
              ? "max-w-4xl" // Unified max-width for readability
              : "max-w-2xl pt-8"
          }`}
        >
          {/* STEP 1 */}
          {step === 1 && (
            <div className="flex flex-col items-center justify-center flex-1 w-full min-h-[60vh]">
              <div ref={logoRef}>
                <HoliyaLogo size="md" />
              </div>
              <div ref={step1TextRef} className="mt-6 text-center">
                <h1 className="text-3xl md:text-4xl font-sans text-text-gray font-medium">
                  Hello!
                </h1>
                <p className="text-sm md:text-base text-text-gray font-medium mt-2">
                  I'm here to support your{" "}
                  <span className="italic font-serif">health journey</span>.
                </p>
              </div>
            </div>
          )}

          {/* STEP 2 */}
          {step === 2 && (
            <div
              ref={step2TextRef}
              className="flex flex-col items-center w-full flex-1 justify-center min-h-[60vh] opacity-0"
            >
              <div className="text-center mb-4">
                <h2 className="text-2xl md:text-3xl font-sans text-text-gray leading-tight">
                  How are you
                  <br />
                  feeling today?
                </h2>
                <p className="text-xs md:text-sm text-text-gray font-medium leading-relaxed mt-2">
                  You can share your symptoms, ask questions,
                  <br />
                  or tell me what's{" "}
                  <span className="italic font-serif">on your mind</span>.
                </p>
              </div>
              <div ref={logoRef}>
                <HoliyaLogo size="sm" />
              </div>
            </div>
          )}

          {/* STEP 3: Chat Interface - FIXED */}
          {step === 3 && (
            <div
              ref={step3ContainerRef}
              className="flex flex-col h-full pt-2 md:pt-4 opacity-0"
            >
              {/* Chat Messages - Fixed responsive widths */}
              <div className="flex-1 overflow-y-auto space-y-3 md:space-y-4 pb-36 md:pb-44 lg:pb-48 w-full">
                {isLoadingMessages ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-pulse text-text-gray/60">
                      Loading messages...
                    </div>
                  </div>
                ) : (
                  messages.map((msg, idx) =>
                    msg.role === "user" ? (
                      <div
                        key={msg.id || idx}
                        className={`flex w-full ${
                          msg.role === "user" ? "justify-end" : "justify-start"
                        }`}
                      >
                        <div className="bg-white/60 rounded-2xl p-3 sm:p-4 max-w-[85%] sm:max-w-[80%] md:max-w-[75%] lg:max-w-[70%] text-sm text-text-gray border border-text-gray/20">
                          {msg.content}
                        </div>
                      </div>
                    ) : (
                      <div
                        key={msg.id || idx}
                        className="flex justify-start w-full"
                      >
                        <div className="bg-white/60 rounded-2xl p-3 sm:p-4 border border-text-gray/20 max-w-[85%] sm:max-w-[80%] md:max-w-[75%] lg:max-w-[70%] text-sm text-text-gray relative group">
                          {msg.isLoading ? (
                            <div className="flex items-center gap-2 py-2">
                              <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" />
                              <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce delay-100" />
                              <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce delay-200" />
                            </div>
                          ) : (
                            <div className="markdown-content pr-8">
                              <ReactMarkdown
                                remarkPlugins={[remarkGfm]}
                                components={markdownComponents}
                              >
                                {msg.content}
                              </ReactMarkdown>
                            </div>
                          )}

                          {/* Copy button */}
                          {!msg.isLoading && (
                            <button
                              onClick={() =>
                                handleCopy(msg.content, msg.id || idx)
                              }
                              className="absolute top-2 right-2 p-1.5 rounded-md bg-white/50 hover:bg-white/80 text-text-gray/40 hover:text-primary transition-all opacity-0 group-hover:opacity-100"
                              title="Copy response"
                            >
                              {copiedId === (msg.id || idx) ? (
                                <Check className="w-3.5 h-3.5 text-green-600" />
                              ) : (
                                <Copy className="w-3.5 h-3.5" />
                              )}
                            </button>
                          )}
                        </div>
                      </div>
                    ),
                  )
                )}
                <div ref={messagesEndRef} />
              </div>

              {/* Input Section - Fixed positioning */}
              <div className="input-section fixed bottom-0 left-0 right-0 md:left-72 w-full md:w-[calc(100%-18rem)] bg-gradient-to-t from-[#fdf6f0] via-[#fdf6f0] to-transparent pb-6 pt-8 px-4 flex flex-col items-center gap-3 z-40">
                <div className="w-full max-w-full sm:max-w-lg md:max-w-xl lg:max-w-2xl flex flex-col items-center gap-3">
                  <HoliyaLogo size="xs" />
                  <div className="w-full relative">
                    <input
                      type="text"
                      value={inputValue}
                      onChange={(e) => setInputValue(e.target.value)}
                      onKeyDown={handleKeyDown}
                      placeholder="Share your symptoms or ask a question..."
                      disabled={isSending}
                      className="w-full px-4 py-3 pr-12 rounded-md bg-white text-text-gray text-sm placeholder:text-text-gray focus:outline-none border border-text-gray/20 focus:border-primary/60 focus:ring-1 focus:ring-primary/60 transition-all disabled:opacity-60"
                    />

                    {/* Send button */}
                    <button
                      onClick={() => handleSendMessage()}
                      disabled={!inputValue.trim() || isSending}
                      className="absolute right-3 top-1/2 -translate-y-1/2 p-1.5 rounded-full bg-primary/10 hover:bg-primary/20 text-primary disabled:opacity-40 disabled:cursor-not-allowed transition-all"
                    >
                      {isSending ? (
                        <div className="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                      ) : (
                        <ArrowUp className="w-4 h-4" />
                      )}
                    </button>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
