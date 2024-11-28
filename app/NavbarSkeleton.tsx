"use client";
import { Flex, Skeleton } from "@radix-ui/themes";
import { IoIosBug } from "react-icons/io";

const NavbarSkeleton = () => {
  const array = [1, 2, 3, 4];
  return (
    <Flex gap="4">
      <IoIosBug className="size-6 text-zinc-800" />
      {array.map((k) => (
        <Skeleton key={k} width="60px" height="8">
          Thing
        </Skeleton>
      ))}
    </Flex>
  );
};

export default NavbarSkeleton;
