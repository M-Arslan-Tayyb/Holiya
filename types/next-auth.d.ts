import "next-auth";
import "next-auth/jwt";

declare module "next-auth" {
  interface Session {
    accessToken: string;
    user: {
      id: string; // Now using actual user_id from API
      email: string;
      name: string;
      userName: string;
      userEmail: string;
      userProfileCompletion: boolean;
      industry: string;
    };
  }

  interface User {
    id: string; // Actual user_id from API
    email: string;
    name: string;
    accessToken: string;
    userName: string;
    userEmail: string;
    userProfileCompletion: boolean;
    industry: string;
  }
}

declare module "next-auth/jwt" {
  interface JWT {
    accessToken: string;
    userId: string; // Actual user_id from API
    userName: string;
    userEmail: string;
    userProfileCompletion: boolean;
    industry: string;
  }
}
