export interface IsignIn {
  email: string;
  password: string;
}

export interface IsignUp {
  email: string;
  password: string;
  confirmPassword: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
  middleName?: string;
}

export interface Iactivate {
  otp: string;
  authorizer: AuthPayload;
}

export interface ServiceRes {
  success: boolean;
  message?: string;
  token?: string;
  options?: any;
}

export interface IforgotPassword {
  email: string;
}

export interface IchangePassword {
  otp: string;
  password: string;
  confirmPassword: string;
  email: string;
}

export interface AuthPayload {
  id: string;
  email: string;
  status: string;
  iat?: number;
}
