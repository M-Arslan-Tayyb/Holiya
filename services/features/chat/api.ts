import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "@/services/rtkQApi";
import {
  SendMessageRequest,
  SendMessageResponse,
  GetSessionsResponse,
  GetMessagesResponse,
} from "./types";

export const chatApi = createApi({
  reducerPath: "chatApi",
  baseQuery: axiosBaseQuery,
  tagTypes: ["Sessions", "Messages"],
  endpoints: (builder) => ({
    // Send message to AI agent
    sendMessage: builder.mutation<SendMessageResponse, SendMessageRequest>({
      query: (data) => ({
        url: "chatbot/ai-agent",
        method: "POST",
        data,
      }),
      // Invalidate sessions after sending first message
      async onQueryStarted(args, { dispatch, queryFulfilled }) {
        try {
          const { data } = await queryFulfilled;
          if (data.data?.first_message) {
            dispatch(chatApi.util.invalidateTags(["Sessions"]));
          }
        } catch (error) {
          // Silent fail
        }
      },
    }),

    // Get all chat sessions for user
    getSessions: builder.query<GetSessionsResponse, { user_id: number }>({
      query: ({ user_id }) => ({
        url: `chatbot/get-sessions?user_id=${user_id}`,
        method: "GET",
      }),
      providesTags: ["Sessions"],
    }),

    // Get messages for a specific session
    getMessages: builder.query<
      GetMessagesResponse,
      { chat_session_id: number }
    >({
      query: ({ chat_session_id }) => ({
        url: `chatbot/get-messages?chat_session_id=${chat_session_id}`,
        method: "GET",
      }),
      providesTags: (result, error, { chat_session_id }) => [
        { type: "Messages", id: chat_session_id },
      ],
    }),
  }),
});

export const {
  useSendMessageMutation,
  useGetSessionsQuery,
  useLazyGetMessagesQuery,
} = chatApi;
