// services/baseQuery.ts
import { BaseQueryFn } from "@reduxjs/toolkit/query";
import axios, { AxiosRequestConfig, AxiosError } from "axios";
import { getSession, signOut } from "next-auth/react";

type AxiosBaseQueryArgs = {
  url: string;
  method: "GET" | "POST" | "PATCH" | "DELETE" | "PUT";
  data?: any;
  params?: any;
  customBaseUrl?: string;
  customHeader?: { [key: string]: string };
  responseType?: any;
  customtoken?: string;
  skipContentType?: boolean; // For FormData
};

export const axiosBaseQuery: BaseQueryFn<
  AxiosBaseQueryArgs,
  unknown,
  unknown
> = async ({
  url,
  method,
  data,
  params,
  customBaseUrl,
  customHeader,
  responseType,
  customtoken,
  skipContentType = false,
}) => {
  try {
    // Get the session to access the token
    const session: any = await getSession();
    const token = customtoken || session?.accessToken;

    let headers: Record<string, string> = {
      ...customHeader,
    };

    // Check if data is FormData
    const isFormData =
      typeof FormData !== "undefined" && data instanceof FormData;

    // Only set Content-Type if not FormData and not explicitly skipped
    if (!isFormData && !skipContentType) {
      headers["Content-Type"] = "application/json; charset=UTF-8";
    }

    if (token) {
      headers.Authorization = `Bearer ${token}`;
    }

    const baseUrl =
      customBaseUrl || process.env.NEXT_PUBLIC_API_URL || process.env.API_URL;

    const result = await axios({
      url: baseUrl + url,
      method,
      data,
      params,
      headers,
      responseType,
    } as AxiosRequestConfig);

    return { data: result.data };
  } catch (error: any) {
    // Handle 401 errors by signing out the user
    if (error?.response?.status === 401) {
      console.warn("Access token expired or invalid. Signing out user...");
      await signOut({ redirect: true, callbackUrl: "/login" });
    }

    return {
      error: {
        status: error?.response?.status,
        data: error?.response?.data || error.message,
      },
    };
  }
};
