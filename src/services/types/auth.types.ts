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

export interface ICompanyPayload {
  name: string;
  rc_number: string;
  user: IprofileUser;
}

export interface IprofileUser {
  firstName: string;
  lastName: string;
  middleName: string;
  email: string;
  phoneNumber: string;
  password?: string;
  confirmPassword?: string;
  role: string;
  no?: string;
  authorizer?: any;
  addressId?: string
}

export interface IAddressPayload {
  street: string;
  no: string;
  town: string;
  state: string;
  country: string;
  hq?: boolean;
  authorizer?: any;
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
  data?: any
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

export interface IBlacklistPayload{
  bvn: string;
  email?: string;
  firstName: string;
  middleName: string;
  lastName: string;
  image: string;
  phoneNumber?: string;
}

export interface IPaginate{
  limit: number;
  offset: number;
}
