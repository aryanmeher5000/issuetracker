"use client";
import { Avatar, Skeleton } from "@radix-ui/themes";
import { Responsive } from "@radix-ui/themes/dist/esm/props/prop-def.js";
import { useSession } from "next-auth/react";
import React from "react";

const UserAvatar = ({
  size,
}: {
  size: Responsive<"1" | "2" | "3" | "4" | "5" | "6" | "7" | "8" | "9">;
}) => {
  const { data } = useSession();
  if (!data)
    return (
      <Skeleton
        style={{ borderRadius: "100px" }}
        width="160px"
        height="160px"
      />
    );
  return (
    <Avatar
      src={data!.user!.image!}
      fallback="?"
      referrerPolicy="no-referrer"
      radius="full"
      size={size}
    />
  );
};

export default UserAvatar;
