export interface IUser {
  id: string;
  name: string;
  email: string;
  avatar?: string;
  isEmailVerified: boolean;
  createdAt: string;
}

export interface INote {
  id: string;
  title: string;
  content: string;
  createdAt: string;
  updatedAt: string;
  userId: string;
}

export interface LoginFormData {
  email: string;
  password: string;
}

export interface SignupFormData {
  name: string;
  email: string;
  password: string;
}

export interface OTPFormData {
//   email: string;
  otp: string;
}

export interface NoteFormData {
  title: string;
  content: string;
}

export interface ApiResponse<T = any> {
  success: boolean;
  message: string;
  data?: T;
  user?: IUser;
  token?: string;
  notes?: INote[];
  note?: INote;
  pagination?: {
    page: number;
    limit: number;
    total: number;
    pages: number;
  };
}