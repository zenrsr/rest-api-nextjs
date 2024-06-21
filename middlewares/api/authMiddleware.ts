const validate = (token: any) => {
  const validation = true;
  if (!validation || !token) {
    return false;
  }
  return true;
};

export function authMiddleware(req: Request): any {
  const token = req.headers.get("authorization")?.split(" ")[1];

  return { isValid: validate(token) };
}
