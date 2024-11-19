import prisma from "@/prisma/client";
import { Box, Flex, Grid } from "@radix-ui/themes";
import { notFound } from "next/navigation";
import EditIssueButton from "./EditIssueButton";
import IssueDetail from "./IssueDetail";
import DeleteIssueButton from "./DeleteIssueButton";

interface Props {
  params: { id: string };
}

const IssueDetailPage = async ({ params }: Props) => {
  const issueDetail = await prisma.issue.findUnique({
    where: { id: parseInt(params.id) },
  });

  if (!issueDetail) notFound();

  return (
    <Grid columns={{ initial: "1", sm: "5" }} p="4" gap="4">
      <Box className="md:col-span-4">
        <IssueDetail issue={issueDetail} />
      </Box>
      <Flex direction="column" gap="2">
        <EditIssueButton issueId={issueDetail.id} />
        <DeleteIssueButton issueId={issueDetail.id} />
      </Flex>
    </Grid>
  );
};

export default IssueDetailPage;
