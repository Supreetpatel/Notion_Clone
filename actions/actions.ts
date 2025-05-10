"use server";
import { redirect } from "next/navigation";
import { adminDb } from "@/firebase-admin";
import { auth } from "@clerk/nextjs/server";
import liveblocks from "@/lib/liveblocks";

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

export async function deleteDocument(roomId: string) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("User not authenticated");
  }
  console.log("deleteDocument", roomId);
  try {
    //delete the document from firestore
    await adminDb.collection("documents").doc(roomId).delete();
    const query = await adminDb
      .collectionGroup("rooms")
      .where("roomId", "==", roomId)
      .get();
    const batch = adminDb.batch();
    //delete the user from the room
    query.docs.forEach((doc) => {
      batch.delete(doc.ref);
    });
    await batch.commit();
    //delete the room from liveblocks
    await liveblocks.deleteRoom(roomId);
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false };
  }
}

export async function inviteUserToDocument(roomId: string, email: string) {
  const { userId } = await auth();
  if (!userId) {
    throw new Error("User not authenticated");
  }
  console.log("inviteUserToDocument", roomId, email);
  try {
    await adminDb
      .collection("users")
      .doc(email)
      .collection("rooms")
      .doc(roomId)
      .set({
        userId: email,
        role: "editor",
        createdAt: new Date(),
        roomId,
      });
    return { success: true };
  } catch (error) {
    console.error(error);
    return { success: false };
  }
}
