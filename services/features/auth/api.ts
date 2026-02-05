import { createApi } from "@reduxjs/toolkit/query/react";
import { axiosBaseQuery } from "@/services/rtkQApi";
import {
  LoginRequest,
  LoginResponse,
  QuestionnaireRequest,
  SignupRequest,
  SignupResponse,
} from "./types";

export const authApi = createApi({
  reducerPath: "authApi",
  baseQuery: axiosBaseQuery,
  endpoints: (builder) => ({
    login: builder.mutation<LoginResponse, LoginRequest>({
      query: (credentials) => ({
        url: "user/login",
        method: "POST",
        data: credentials,
      }),
    }),
    signup: builder.mutation<SignupResponse, SignupRequest>({
      query: (userData) => ({
        url: "user/signUp",
        method: "POST",
        data: userData,
      }),
    }),
    completeProfile: builder.mutation<any, QuestionnaireRequest>({
      query: (data) => ({
        url: "user/user/questioner",
        method: "POST",
        data,
      }),
    }),
  }),
});

export const {
  useLoginMutation,
  useSignupMutation,
  useCompleteProfileMutation,
} = authApi;
