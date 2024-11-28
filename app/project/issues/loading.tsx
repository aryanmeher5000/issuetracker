import React from "react";
import IssueTableSkeleton from "../../components/IssueTableSkeleton";
import { Box, Flex, Skeleton } from "@radix-ui/themes";

const loading = () => {
  return (
    <Box className="p-4 space-y-4">
      <Skeleton width="100px" height="30px" />
      <Flex gap="2">
        <Skeleton width="80px" height="30px" />
        <Skeleton width="80px" height="30px" />
      </Flex>
      <IssueTableSkeleton />
      <Flex justify="center">
        <Skeleton width="250px" height="30px" />
      </Flex>
    </Box>
  );
};

export default loading;
