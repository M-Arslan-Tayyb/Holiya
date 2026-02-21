import { NextAuthOptions } from "next-auth";
import CredentialsProvider from "next-auth/providers/credentials";
import { LoginRequest, LoginResponse } from "@/services/features/auth/types";

export const authOptions: NextAuthOptions = {
  providers: [
    CredentialsProvider({
      name: "credentials",
      credentials: {
        email: { label: "Email", type: "text" },
        password: { label: "Password", type: "password" },
      },
      async authorize(credentials): Promise<any> {
        if (!credentials?.email || !credentials?.password) {
          throw new Error("Please provide both email and password");
        }

        try {
          const loginData: LoginRequest = {
            email: credentials.email,
            password: credentials.password,
          };

          const response = await fetch(`${process.env.API_URL}user/login`, {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
              Accept: "application/json",
            },
            body: JSON.stringify(loginData),
          });

          const data: LoginResponse = await response.json();

          if (!response.ok || !data.succeeded) {
            throw new Error(data.message || "Authentication failed");
          }

          // UPDATED: Destructure user_id as well
          const {
            access_token,
            user_name,
            user_email,
            user_profile_completion,
            user_id, // NEW: Get user_id from response
            industry,
          } = data.data;

          // Return user object with actual user_id
          return {
            id: String(user_id), // UPDATED: Use actual user_id instead of email
            email: user_email,
            name: user_name,
            accessToken: access_token,
            userName: user_name,
            userEmail: user_email,
            userProfileCompletion: user_profile_completion,
            industry,
          };
        } catch (error: any) {
          throw new Error(error.message || "Login failed");
        }
      },
    }),
  ],

  callbacks: {
    async jwt({ token, user, trigger, session }) {
      // Initial sign in
      if (user) {
        token.accessToken = user.accessToken;
        token.userId = user.id; // Now contains actual user_id
        token.userName = user.userName;
        token.userEmail = user.email;
        token.userProfileCompletion = user.userProfileCompletion;
        token.industry = user.industry;
      }

      // Handle session updates
      if (trigger === "update" && session?.user) {
        token.userProfileCompletion =
          session.user.userProfileCompletion ?? token.userProfileCompletion;
        token.userName = session.user.userName ?? token.userName;
        token.industry = session.user.industry ?? token.industry;
      }

      return token;
    },

    async session({ session, token }) {
      // Send properties to the client
      session.accessToken = token.accessToken;
      session.user = {
        id: token.userId, // Actual user_id (e.g., "13")
        email: token.userEmail,
        name: token.userName,
        userName: token.userName,
        userEmail: token.userEmail,
        userProfileCompletion: token.userProfileCompletion,
        industry: token.industry,
      };

      return session;
    },

    async redirect({ url, baseUrl }) {
      return baseUrl;
    },
  },

  pages: {
    signIn: "/login",
    error: "/login",
  },

  session: {
    strategy: "jwt",
    maxAge: 10 * 60 * 60,
  },

  debug: process.env.NODE_ENV === "development",
  secret: process.env.NEXTAUTH_SECRET,
};
