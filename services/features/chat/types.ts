import { ApiResponse } from "../auth/types";

export interface SendMessageRequest {
  user_id: number;
  session_id: string;
  user_message: string;
}

export interface SendMessageResponseData {
  ai_response: string;
  safety_checks: boolean;
  first_message?: string;
}

export interface ChatSession {
  chat_session_id: number;
  user_id: number;
  session_id: string;
  created_at: string;
  first_message: {
    message_id: number;
    user_message: string;
    created_at: string;
  } | null;
}

export interface ChatMessage {
  message_id: number;
  chat_session_id: number;
  ai_response: string;
  created_at: string;
  metadata_json: any;
  user_message: string;
}

// API Response types using GenericApiResponse wrapper
export type SendMessageResponse = ApiResponse<SendMessageResponseData>;
export type GetSessionsResponse = ApiResponse<ChatSession[]>;
export type GetMessagesResponse = ApiResponse<ChatMessage[]>;
