import prisma from "@/prisma/client";
import { Box, Grid } from "@radix-ui/themes";
import { notFound } from "next/navigation";
import EditIssueButton from "./EditIssueButton";
import IssueDetail from "./IssueDetail";

interface Props {
  params: { id: string };
}

const IssueDetailPage = async ({ params }: Props) => {
  const issueDetail = await prisma.issue.findUnique({
    where: { id: parseInt(params.id) },
  });

  if (!issueDetail) notFound();

  return (
    <Grid columns={{ initial: "1", md: "2" }} p="4" gap="4">
      <Box>
        <IssueDetail issue={issueDetail} />
      </Box>
      <Box>
        <EditIssueButton issueId={issueDetail.id} />
      </Box>
    </Grid>
  );
};

export default IssueDetailPage;
