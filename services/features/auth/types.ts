// Request Types
export interface LoginRequest {
  email: string;
  password: string;
}

export interface SignupRequest {
  name: string;
  email: string;
  password: string;
  phone_no: string;
  invitation_code?: string;
}

// Response Types
export interface LoginData {
  access_token: string;
  user_name: string;
  user_email: string;
  user_profile_completion: boolean;
  user_id: number;
}

export interface ApiResponse<T> {
  data: T;
  succeeded: boolean;
  message: string;
  httpStatusCode: number;
}

export interface LoginResponse extends ApiResponse<LoginData> {}

export interface SignupResponse extends ApiResponse<number> {}

export interface QuestionnaireRequest {
  user_id: number;
  questioner: {
    profile: string;
  };
}

// User Type for Session
export interface AuthUser {
  id: string;
  email: string;
  name: string;
  accessToken: string;
  userName: string;
  userEmail: string;
  userProfileCompletion: boolean;
  user_id?: number;
}
