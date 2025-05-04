"use client";

import RoomProvider from "@/components/RoomProvider";
import { useAuth } from "@clerk/nextjs";

const DocLayout = ({
  children,
  params: { id },
}: {
  children: React.ReactNode;
  params: { id: string };
}) => {
  const { isSignedIn } = useAuth();
  if (!isSignedIn) {
    return null;
  }
  return <RoomProvider roomId={id}>{children}</RoomProvider>;
};

export default DocLayout;
