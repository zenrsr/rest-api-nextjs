export function logMiddleware(req: Request) {
  return {
    response: "logging initiated: \n" + req.method + " " + req.url
  };
}
