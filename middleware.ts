import { NextResponse } from "next/server"
import type { NextRequest } from "next/server"

export function middleware(request: NextRequest) {
  // Always allow requests to proceed in preview mode
  return NextResponse.next()
}

export const config = {
  matcher: ["/api/:path*"],
}
