import { NextResponse } from "next/server";
import { authMiddleware } from "./middlewares/api/authMiddleware";
import { logMiddleware } from "./middlewares/logMiddleware";

export const config = {
  matcher: "/api/:path*"
};

export default function middleware(req: Request) {
  if (req.url.includes("/api/blogs")) {
    const logResult = logMiddleware(req);
    console.log(logResult);
  }

  const authResult = authMiddleware(req);
  if (!authResult?.isValid) {
    return new NextResponse(JSON.stringify({ message: "Unauthorized" }), {
      status: 401
    });
  }
  return NextResponse.next();
}
