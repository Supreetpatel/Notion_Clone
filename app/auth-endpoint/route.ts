import { adminDb } from "@/firebase-admin";
import liveblocks from "@/lib/liveblocks";
import { auth } from "@clerk/nextjs/server";
import { NextRequest, NextResponse } from "next/server";

export async function POST(req: NextRequest) {
  const authInstance = await auth();
  const token = await authInstance.getToken();
  if (!token) {
    throw new Error("Unauthorized");
  }
  const { sessionClaims } = await auth();
  if (!sessionClaims) {
    throw new Error("Session claims are null");
  }
  const { room } = await req.json();
  const session = liveblocks.prepareSession(sessionClaims.email, {
    userInfo: {
      name: sessionClaims.fullName ?? "Unknown Name",
      email: sessionClaims.email ?? "Unknown Email",
      avatar: sessionClaims.image ?? "Unknown Avatar",
    },
  });
  const usersInRoom = await adminDb
    .collectionGroup("rooms")
    .where("userId", "==", sessionClaims?.email)
    .get();

  const userInRoom = usersInRoom.docs.find((doc) => doc.id === room);
  if (userInRoom?.exists) {
    session.allow(room, session.FULL_ACCESS);
    const { body, status } = await session.authorize();
    return new Response(body, { status });
  } else {
    return NextResponse.json(
      { message: "You are not in this room" },
      { status: 403 }
    );
  }
}
