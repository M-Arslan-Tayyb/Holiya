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

          // UPDATED: Destructure user_id and role
          const {
            access_token,
            user_name,
            user_email,
            user_profile_completion,
            user_id,
            industry,
            role,
            work_env
          } = data.data;

          // Return user object with actual user_id and role
          return {
            id: String(user_id),
            email: user_email,
            name: user_name,
            accessToken: access_token,
            userName: user_name,
            userEmail: user_email,
            userProfileCompletion: user_profile_completion,
            industry,
            role,
            work_env
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
        token.userId = user.id;
        token.userName = user.userName;
        token.userEmail = user.email;
        token.userProfileCompletion = user.userProfileCompletion;
        token.industry = user.industry;
        token.role = user.role;
        token.work_env = user.work_env;
      }

      // Handle session updates
      if (trigger === "update" && session?.user) {
        token.userProfileCompletion =
          session.user.userProfileCompletion ?? token.userProfileCompletion;
        token.userName = session.user.userName ?? token.userName;
        token.industry = session.user.industry ?? token.industry;
        token.role = session.user.role ?? token.role;
        token.work_env = session.user.work_env ?? token.work_env;
      }

      return token;
    },

    async session({ session, token }) {
      // Send properties to the client
      session.accessToken = token.accessToken;
      session.user = {
        id: token.userId,
        email: token.userEmail,
        name: token.userName,
        userName: token.userName,
        userEmail: token.userEmail,
        userProfileCompletion: token.userProfileCompletion,
        industry: token.industry,
        role: token.role,
        work_env: token.work_env,
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
