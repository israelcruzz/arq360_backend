declare namespace Express {
  interface Request {
    user: {
      sub: string;
      iat: number;
      exp: number;
    };
  }
}
