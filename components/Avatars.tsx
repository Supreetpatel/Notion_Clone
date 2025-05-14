"use client";
import { useOthers, useSelf } from "@liveblocks/react/suspense";

const Avatars = () => {
  const others = useOthers();
  const self = useSelf();
  return <div></div>;
};

export default Avatars;
