"use client";

import {
  useState,
  useEffect,
  useRef,
  useLayoutEffect,
  useCallback,
} from "react";
import Image from "next/image";
import gsap from "gsap";
import { HoliyaLogo } from "@/components/custom/HoliyaLogo";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { ChatSidebar } from "@/components/pages/home/ChatSidebar";
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
  const { data: session, status, update } = useSession();

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

      // Check success using data.success or fallback to checking if data exists
      const isSuccess =
        result.success ?? (result.data?.ai_response ? true : false);

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
      if (isNewChat && result.data.first_message) {
        const newSession: ChatSession = {
          id: sessionId,
          title: result.data.first_message,
          created_at: new Date().toISOString(),
        };
        setChatSessions((prev) => [newSession, ...prev]);
        setIsNewChat(false);
      }
    } catch (error: any) {
      // Remove loading message and show error
      setMessages((prev) => prev.filter((m) => !m.isLoading));
      toast.error(error.message || "Failed to send message");
    }
  };

  // Handle selecting a chat from sidebar
  const handleSelectChat = useCallback(
    async (sessionId: string, chatSessionId?: number) => {
      setCurrentSessionId(sessionId);
      setIsNewChat(false);

      if (chatSessionId) {
        // Load messages from API
        try {
          const result = await fetchMessages({
            chat_session_id: chatSessionId,
          }).unwrap();

          // Check if successful
          const isSuccess = result.success ?? (result.data ? true : false);

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
        // New chat - show welcome message
        setMessages([
          {
            role: "ai",
            content:
              "Hello! I'm Eva, your health companion. How can I help you today?",
          },
        ]);
      }
    },
    [fetchMessages],
  );

  // Handle new chat button
  const handleNewChat = () => {
    setCurrentSessionId("new");
    setIsNewChat(true);
    setMessages([
      {
        role: "ai",
        content:
          "Hello! I'm Eva, your health companion. How can I help you today?",
      },
    ]);
  };

  // Initial load - show new chat
  useEffect(() => {
    if (step === 3 && messages.length === 0) {
      handleNewChat();
    }
  }, [step, messages.length]);

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  return (
    <div className="flex flex-col min-h-screen overflow-hidden relative">
      {/* Header */}
      <div className="pt-4 md:pt-8 px-4 md:px-8 z-50 fixed">
        <Image
          src="/holiya-text-logo-with-des.svg"
          alt="Holiya"
          width={160}
          height={40}
          className="h-10 md:h-14 w-auto object-contain"
        />
      </div>

      {/* Sidebar */}
      <ChatSidebar
        isVisible={step === 3}
        sessions={chatSessions}
        isLoading={isLoadingSessions}
        currentSessionId={currentSessionId}
        onNewChat={handleNewChat}
        onSelectChat={handleSelectChat}
      />

      {/* Avatar */}
      {(step === 2 || step === 3) && (
        <div
          ref={avatarRef}
          className={` mt-26 px-4 md:px-8 pt-4 flex items-center gap-3 transition-all duration-300 ${
            step === 3 ? "md:ml-56 ml-6" : "ml-6 md:ml-16"
          }`}
        >
          <Avatar className="md:w-12 md:h-12 h-10 w-10">
            <AvatarImage src="/holiya-doctor-image.jpg" alt="Eva" />
            <AvatarFallback className="bg-primary text-white text-xs">
              EV
            </AvatarFallback>
          </Avatar>
          <div className="flex flex-col leading-tight">
            <span className="text-lg font-sans text-text-gray font-medium leading-tight">
              Hello!
            </span>
            <span className="text-sm italic font-serif text-text-gray/80">
              {session?.user.userName}
            </span>
          </div>
        </div>
      )}

      {/* Main Content */}
      <div
        className={` flex-1 flex flex-col items-center w-full px-4 relative overflow-hidden transition-all duration-300 ${
          step === 3 ? "md:ml-72 max-w-4xl" : "max-w-2xl mx-auto"
        }`}
      >
        {/* STEP 1 */}
        {step === 1 && (
          <div className="flex flex-col items-center justify-center flex-1 w-full">
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
            className="flex flex-col items-center w-full flex-1 justify-center opacity-0"
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

        {/* STEP 3: Chat Interface */}
        {step === 3 && (
          <div
            ref={step3ContainerRef}
            className="flex flex-col w-full flex-1 pt-6 opacity-0 relative"
          >
            {/* Chat Messages */}
            <div className="chat-container flex-1 overflow-y-auto space-y-4 px-2 pb-32 flex flex-col min-h-0">
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
                      className="self-end bg-white/60 rounded-2xl p-4 max-w-[70%] md:max-w-[60%] text-sm text-text-gray border border-text-gray/20"
                    >
                      {msg.content}
                    </div>
                  ) : (
                    <div
                      key={msg.id || idx}
                      className="self-start bg-white/60 rounded-2xl p-4 border border-text-gray/20 max-w-[70%] md:max-w-[60%] text-sm text-text-gray"
                    >
                      {msg.isLoading ? (
                        <div className="flex items-center gap-2">
                          <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce" />
                          <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce delay-100" />
                          <div className="w-2 h-2 bg-primary/60 rounded-full animate-bounce delay-200" />
                        </div>
                      ) : (
                        <div className="markdown-content">
                          <ReactMarkdown remarkPlugins={[remarkGfm]}>
                            {msg.content}
                          </ReactMarkdown>
                        </div>
                      )}
                    </div>
                  ),
                )
              )}
              <div ref={messagesEndRef} />
            </div>

            {/* Input Section */}
            <div className="input-section fixed bottom-0 left-0 right-0 w-full bg-gradient-to-t from-[#fdf6f0] via-[#fdf6f0] to-transparent pb-6 pt-8 px-4 flex flex-col items-center gap-3 z-40">
              <div className="max-w-md w-full flex flex-col items-center gap-3">
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
                  {isSending && (
                    <div className="absolute right-3 top-1/2 -translate-y-1/2">
                      <div className="w-5 h-5 border-2 border-primary/30 border-t-primary rounded-full animate-spin" />
                    </div>
                  )}
                </div>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
