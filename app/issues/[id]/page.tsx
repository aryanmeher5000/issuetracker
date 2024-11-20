import prisma from "@/prisma/client";
import { Box, Flex, Grid } from "@radix-ui/themes";
import { notFound } from "next/navigation";
import EditIssueButton from "./EditIssueButton";
import IssueDetail from "./IssueDetail";
import DeleteIssueButton from "./DeleteIssueButton";
import { auth } from "@/app/api/auth/auth";

const IssueDetailPage = async ({ params }: { params: { id: string } }) => {
  const issueDetail = await prisma.issue.findUnique({
    where: { id: parseInt(params.id) },
  });
  const session = await auth();
  if (!issueDetail) notFound();

  return (
    <Grid columns={{ initial: "1", sm: "5" }} p="4" gap="4">
      <Box className="md:col-span-4">
        <IssueDetail issue={issueDetail} />
      </Box>
      {session && (
        <Flex direction="column" gap="2">
          <EditIssueButton issueId={issueDetail.id} />
          <DeleteIssueButton issueId={issueDetail.id} />
        </Flex>
      )}
    </Grid>
  );
};

export default IssueDetailPage;
