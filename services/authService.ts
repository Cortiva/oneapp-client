import axios, { AxiosError, AxiosResponse } from "axios";

const API_BASE_URL =
  process.env.NEXT_PUBLIC_API_BASE_URL || "http://localhost:3000/api";

interface LoginRequest {
  email: string;
  password: string;
}

interface LoginResponse {
  status: number;
  message: string;
  data: {
    token: string;
    user: {
      id: string;
      firstName: string;
      lastName: string;
      email: string;
      accountStatus: string;
      createdAt: string;
      avatar: string;
      lastLogin: string;
      role: string;
      isActive: string;
      staffId: string;
      phoneNumber: string;
      officeLocation: string;
    };
  };
}

export interface User {
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  accountStatus: string;
  createdAt: string;
  avatar: string;
  lastLogin: string;
  role: string;
  isActive: string;
  staffId: string;
  phoneNumber: string;
  officeLocation: string;
}

interface RegisterRequest {
  firstName: string;
  lastName: string;
  email: string;
  password: string;
  staffId: string;
  phoneNumber: string;
  officeLocation: string;
}

interface SendOtpRequest {
  email: string;
}

interface SignOutRequest {
  token: string;
}

interface ConfirmOtpRequest {
  email: string;
  otp: string;
  type: "ONBOARDING" | "PASSWORD";
}

interface ChangePasswordRequest {
  email: string;
  Password: string;
}

interface UpdateUserRequest {
  userId: string;
  firstName?: string;
  lastName?: string;
  phoneNumber?: string;
  officeLocation?: string;
}

interface UpdateUserAvatarRequest {
  userId: string;
  avatar: string;
}

interface ApiError {
  message: string;
  status?: number;
}

// Create axios instance with base config
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    "Content-Type": "application/json",
  },
});

// Helper function to handle errors
const handleError = (error: AxiosError): ApiError => {
  if (error.response) {
    return {
      message: error.response.data?.message || "An error occurred",
      status: error.response.status,
    };
  }
  return { message: error.message || "An error occurred" };
};

// Auth Service
const authService = {
  /**
   * Check if email is available
   * @param email - email address
   * @returns Promise with success message
   */
  checkEmailAvailability: async (email: string): Promise<any> => {
    try {
      const response: AxiosResponse<any> = await api.post("/check-email", {
        email,
      });
      return response.data;
    } catch (error) {
      throw handleError(error as AxiosError);
    }
  },

  /**
   * Login user
   * @param credentials - email and password
   * @returns Promise with user data and token
   */
  login: async (credentials: LoginRequest): Promise<LoginResponse> => {
    try {
      const response: AxiosResponse<LoginResponse> = await api.post(
        "/users/login",
        credentials
      );

      console.log("AS RESP::::: ", response.data);
      return response.data;
    } catch (error) {
      throw handleError(error as AxiosError);
    }
  },

  /**
   * Register new user
   * @param userData
   * @returns Promise with user data and token
   */
  register: async (userData: RegisterRequest): Promise<any> => {
    try {
      const response: AxiosResponse<any> = await api.post(
        "/users/register/user",
        userData
      );
      return response.data;
    } catch (error) {
      throw handleError(error as AxiosError);
    }
  },

  /**
   * Initiate password reset
   * @param email - user's email address
   * @returns Promise with success message
   */
  initiatePasswordReset: async (email: string): Promise<any> => {
    try {
      const response: AxiosResponse<any> = await api.post(
        "/users/password/initiate-reset",
        { email }
      );
      return response.data;
    } catch (error) {
      throw handleError(error as AxiosError);
    }
  },

  /**
   * Resend OTP code
   * @param otpData - email and OTP code
   * @returns Promise with token for password change
   */
  resendOtp: async (email: string): Promise<any> => {
    try {
      const response: AxiosResponse<any> = await api.post("/users/otp/send", {
        email,
      });
      return response.data;
    } catch (error) {
      throw handleError(error as AxiosError);
    }
  },

  /**
   * Confirm OTP code
   * @param otpData - email and OTP code
   * @returns Promise with token for password change
   */
  confirmOtp: async (
    email: string,
    otp: string,
    type: string
  ): Promise<any> => {
    try {
      const response: AxiosResponse<any> = await api.put(
        "/users/otp/verification",
        { email, otp, type }
      );
      return response.data;
    } catch (error) {
      throw handleError(error as AxiosError);
    }
  },

  /**
   * Change user password
   * @param passwordData - email and new password
   * @returns Promise with success message
   */
  changePassword: async (passwordData: ChangePasswordRequest): Promise<any> => {
    try {
      const response: AxiosResponse<any> = await api.put(
        "/users/password/change",
        passwordData
      );
      return response.data;
    } catch (error) {
      throw handleError(error as AxiosError);
    }
  },

  /**
   * Sign user out
   * @param token
   * @returns Promise with success message
   */
  signOut: async (): Promise<any> => {
    try {
      const response: AxiosResponse<any> = await api.get("/users/logout");
      return response.data;
    } catch (error) {
      throw handleError(error as AxiosError);
    }
  },
};

export default authService;
