import { Box, Flex, Skeleton } from "@radix-ui/themes";
import IssueTableSkeleton from "../components/IssueTableSkeleton";

const DelegatedIssueLoading = () => {
  return (
    <Box className="space-y-4">
      <Skeleton width="120px" height="30px" />
      <IssueTableSkeleton />
      <Flex justify="center">
        <Skeleton width="250px" height="30px" />
      </Flex>
    </Box>
  );
};

export default DelegatedIssueLoading;
