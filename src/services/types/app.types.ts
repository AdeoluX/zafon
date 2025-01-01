export interface IsignIn {
  email: string;
  password: string;
  isAdmin: boolean;
}

export interface IbvnVerification {
  bvn: string;
  dob: string;
}

export interface Isubscribe {
  amount: number;
  authorizer: IAuthorizer;
}

export interface Ipayment {
  assetUserId?: string;
  amount: number;
  assetId: string;
  type: 'FUND' | 'SUBSCRIBE';
  endDate?: Date;
  authorizer: IAuthorizer;
}

export interface IRedemption {
  unitToRedeem?: number;
  amount?: number;
  authorizer: IAuthorizer;
}

export interface IAuthorizer {
  id: string
}

export interface IsignUp {
  email: string;
  password: string;
  confirmPassword: string;
  phoneNumber: string;
  firstName: string;
  lastName: string;
  middleName?: string;
  isAdmin: boolean;
}
export interface ServiceRes {
  success: boolean;
  message?: string;
  token?: string;
  options?: any;
  data?: any
}
export interface AuthPayload {
  id: string;
  email: string;
  status: string;
  iat?: number;
}
export interface IPaginate{
  limit: number;
  offset: number;
}

export interface Ipagination {
  page: number;
  perPage: number;
  skip: number;
}

export interface IAsset {
  name: string;
  unitPrice: number;
  rate: number;
  type: "fund" | "bond" | "contribution" | "token" | "lock";
}

export interface IdateFilter {
  startDate: Date;
  endDate: Date;
}

export interface IQuerySearch {
  search: string;
  status?: string; 
}

export interface IQuery extends Ipagination, IdateFilter, IQuerySearch {}

export interface ICreateTeam {
  name?: string;
  coach?: string;
}

export interface ICreateFixture{
  awayTeam: string;
  homeTeam: string;
  kickOffTime: Date;
  awayTeamGoals?: number;
  homeTeamGoals?: number;
}