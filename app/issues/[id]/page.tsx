import prisma from "@/prisma/client";
import { Avatar, Box, Flex, Grid, Text } from "@radix-ui/themes";
import { notFound } from "next/navigation";
import EditIssueButton from "./EditIssueButton";
import IssueDetail from "./IssueDetail";
import DeleteIssueButton from "./DeleteIssueButton";
import { auth } from "@/app/api/auth/auth";
import AssignIssue from "./AssignIssue";
import ReopenIssueButton from "./ReopenIssueButton";
import { Metadata } from "next";

interface Props {
  params: { id: string };
}

const IssueDetailPage = async ({ params }: Props) => {
  // Authenticate the user.
  const session = await auth();
  const { id } = await params;

  const issueId = parseInt(id, 10);

  // Fetch issue details from the database.
  const issueDetail = await prisma.issue.findUnique({
    where: { id: issueId },
    include: {
      assignedToUser: true,
    },
  });

  // If issue not found, return 404.
  if (!issueDetail) {
    return notFound();
  }

  return (
    <Grid columns={{ initial: "1", sm: "5" }} p="4" gap="4">
      {/* Issue Details Section */}
      <Box className="md:col-span-4">
        <IssueDetail issue={issueDetail} />
      </Box>

      {/* Action Buttons */}
      {session && (
        <Flex direction="column" gap="2">
          {issueDetail.status !== "CLOSED" ? (
            <>
              {/* Admin-specific actions */}
              {session.user.role === "ADMIN" ? (
                <>
                  <AssignIssue
                    id={issueId}
                    assignee={issueDetail.assignedToUser!}
                  />
                  <EditIssueButton issueId={issueId} />
                </>
              ) : (
                // Non-admin view of the assigned user
                <Flex align="center" gap="2">
                  <Text>Being handled by:</Text>
                  <Avatar
                    src={issueDetail.assignedToUser?.image || undefined}
                    fallback="?"
                    radius="full"
                    referrerPolicy="no-referrer"
                  />
                  <Text>{issueDetail.assignedToUser?.name || "Unknown"}</Text>
                </Flex>
              )}
            </>
          ) : (
            // If the issue is closed
            <ReopenIssueButton id={issueId} />
          )}

          {/* Delete button (Admin-only) */}
          {session.user.role === "ADMIN" && (
            <DeleteIssueButton issueId={issueId} />
          )}
        </Flex>
      )}
    </Grid>
  );
};

// Metadata generation for the page
export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { id } = params;
  const issueId = parseInt(id, 10);

  const issue = await prisma.issue.findUnique({
    where: { id: issueId },
  });

  return {
    title: issue?.title || "Issue Details",
    description: issue?.description || "Details of the selected issue",
  };
}

export default IssueDetailPage;
