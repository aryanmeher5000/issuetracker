"use client";
import { Flex, Skeleton } from "@radix-ui/themes";
import { IoIosBug } from "react-icons/io";

const NavbarSkeleton = () => {
  const array = [1, 2, 3, 4];
  return (
    <Flex justify="between" align="center" width="100%">
      <Flex gap="4" justify="between">
        <IoIosBug className="size-6 text-zinc-800" />
        {array.map((k) => (
          <Skeleton key={k} width="60px" height="25px">
            Thing
          </Skeleton>
        ))}
      </Flex>
      <Skeleton width="50px" height="50px" style={{ borderRadius: "25px" }} />
    </Flex>
  );
};

export default NavbarSkeleton;
