import { NextResponse } from "next/server";

// Handles Peach verification ping & live payment webhooks
export async function POST(request: Request) {
  try {
    const body = await request.text();
    const payload = body ? JSON.parse(body) : {};
    console.log("PEACH WEBHOOK RECEIVED:", payload);
    return NextResponse.json({ status: "success" }, { status: 200 });
  } catch (error) {
    // Always return 200 so Peach doesn't retry or flag as failed
    return NextResponse.json({ status: "success" }, { status: 200 });
  }
}

// Peach uses GET during initial URL verification
export async function GET() {
  return NextResponse.json({ status: "ok" }, { status: 200 });
}
