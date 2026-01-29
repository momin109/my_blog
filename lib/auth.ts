export type AdminJwtPayload = {
  sub: string; // admin id
  role: "admin";
  iat?: number;
  exp?: number;
};
