export type JwtPayload = {
  email: string;
  exp: number;
  iat: number;
  roles: string[];
  sub: string;
  username: string;
};
