export interface RegisterFormData {
  firstName: string;
  lastName: string;
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
  firstName: string;
  lastName: string;
  email: string;
}

export interface RegisterResponse {
  success: boolean;
  message?: string;
  errors?: FieldError[];
  user?: RegisterUser;
}