export interface IAccessToken {
  token: string;
  expiresIn: number; 
  issuedAt?: number;
}

export interface IRefreshToken {
  token: string;
  expiresIn: number; 
  issuedAt?: number;
}

export interface IToken {
  accessToken: IAccessToken;
  refreshToken: IRefreshToken;
}
