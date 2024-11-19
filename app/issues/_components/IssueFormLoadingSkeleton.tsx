import { Box, Skeleton } from "@radix-ui/themes";
import React from "react";

const IssueFormLoadingSkeleton = () => {
  return (
    <Box p="4" className="max-w-xl">
      <Skeleton height="2rem" mb="4" />
      <Skeleton height="25rem" mb="4" />
      <Skeleton width="5rem" height="1.5rem" />
    </Box>
  );
};

export default IssueFormLoadingSkeleton;
