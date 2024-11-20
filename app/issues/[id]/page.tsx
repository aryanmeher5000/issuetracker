import prisma from "@/prisma/client";
import { Box, Flex, Grid } from "@radix-ui/themes";
import { notFound } from "next/navigation";
import EditIssueButton from "./EditIssueButton";
import IssueDetail from "./IssueDetail";
import DeleteIssueButton from "./DeleteIssueButton";
import { auth } from "@/app/api/auth/auth";
import AssignIssue from "./AssignIssue";

const IssueDetailPage = async ({ params }: { params: { id: string } }) => {
  const issueId = parseInt(params.id); // Parse `id` synchronously.
  if (isNaN(issueId)) {
    notFound(); // Handle invalid `id`.
  }

  // Fetch issue details from the database.
  const issueDetail = await prisma.issue.findUnique({
    where: { id: issueId },
    include: {
      assignedToUser: {},
    },
  });

  // Authenticate the user.
  const session = await auth();

  // If issue not found, return 404.
  if (!issueDetail) {
    notFound();
  }

  return (
    <Grid columns={{ initial: "1", sm: "5" }} p="4" gap="4">
      <Box className="md:col-span-4">
        <IssueDetail issue={issueDetail} />
      </Box>

      {session && (
        <Flex direction="column" gap="2">
          {session.user.role === "ADMIN" && (
            <AssignIssue
              id={parseInt(params.id)}
              assignee={issueDetail.assignedToUser!}
            />
          )}
          <EditIssueButton issueId={issueDetail.id} />
          {session.user.role === "ADMIN" && (
            <DeleteIssueButton issueId={issueDetail.id} />
          )}
        </Flex>
      )}
    </Grid>
  );
};

export default IssueDetailPage;
