export interface RegisterFormData {
  fullName: string;
  email: string;
  password: string;
  confirmPassword: string;
}

export interface FieldError {
  field: string;
  message: string;
}

export interface RegisterUser {
  id: number;
  fullName: string;
  email: string;
}

export interface RegisterResponse {
  success: boolean;
  message?: string;
  errors?: FieldError[];
  user?: RegisterUser;
}

export interface GoogleSignInPending {
  requiresSignupCompletion: true;
  pendingToken: string;
  email: string;
}

export interface CompleteGoogleSignupFormData {
  fullName: string;
  email: string;
}
