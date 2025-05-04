"use server";
import { redirect } from "next/navigation";
import { adminDb } from "@/firebase-admin";
import { auth } from "@clerk/nextjs/server";

export async function createNewDocument() {
  const { userId } = await auth();
  if (!userId) {
    redirect("/sign-in");
  }
  const { sessionClaims } = await auth();
  const docCollectionRef = adminDb.collection("documents");
  const docRef = await docCollectionRef.add({
    title: "New Doc",
  });
  await adminDb
    .collection("users")
    .doc(sessionClaims?.email ?? "unknown")
    .collection("rooms")
    .doc(docRef.id)
    .set({
      userId: sessionClaims?.email ?? "unknown",
      role: "owner",
      createdAt: new Date(),
      roomId: docRef.id,
    });
  return { docId: docRef.id };
}
