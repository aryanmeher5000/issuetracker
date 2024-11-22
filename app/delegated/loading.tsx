import { Box, Skeleton } from "@radix-ui/themes";
import IssueTableSkeleton from "../components/IssueTableSkeleton";

const DelegatedIssueLoading = () => {
  return (
    <Box className="space-y-4">
      <Skeleton width="120px" height="30px" />
      <IssueTableSkeleton />
    </Box>
  );
};

export default DelegatedIssueLoading;
