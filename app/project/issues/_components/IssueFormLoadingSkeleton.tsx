import { Flex, Skeleton } from "@radix-ui/themes";
import React from "react";

const IssueFormLoadingSkeleton = () => {
  return (
    <Flex direction="column" gap="4" p="4" className="max-w-xl">
      <Skeleton height="2rem" />
      <Skeleton height="25rem" />
      <Skeleton width="15rem" height="1.5rem" />
      <Skeleton width="7rem" height="1.5rem" />
    </Flex>
  );
};

export default IssueFormLoadingSkeleton;
