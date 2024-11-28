"use client";
import useProject from "@/app/store";
import { Issue, User } from "@prisma/client";
import { Avatar, Box, Card, Flex, Grid, Text } from "@radix-ui/themes";
import AssignIssue from "./AssignIssue";
import DeleteIssueButton from "./DeleteIssueButton";
import EditIssueButton from "./EditIssueButton";
import IssueDetail from "./IssueDetail";
import ReopenIssueButton from "./ReopenIssueButton";
import { useSession } from "next-auth/react";
import TakeLeadButton from "./TakeLeadButton";
import LeaveLeadButton from "./LeaveLeadButton";
import DetailPageLoading from "./loading";

const IssueInfo = ({
  issueDetail,
  assignedTo,
}: {
  issueDetail: Issue;
  assignedTo?: User;
}) => {
  const { isAdmin, project } = useProject();
  const { data } = useSession();

  if (!project) return <DetailPageLoading />;

  return (
    <Grid columns={{ initial: "1", sm: "5" }} p="4" gap="4">
      {/* Issue Details Section */}
      <Box className="md:col-span-4">
        <IssueDetail issue={issueDetail} />
      </Box>

      <Flex gap="3" direction="column">
        {/*If type organization and user admin show assign issue button*/}
        {project.type === "ORGANIZATION" && isAdmin && (
          <AssignIssue id={issueDetail.id} assignee={assignedTo} />
        )}
        {project.type === "GROUP" && !assignedTo && (
          <TakeLeadButton id={issueDetail.id} />
        )}
        {project.type === "GROUP" && assignedTo && (
          <LeaveLeadButton id={issueDetail.id} />
        )}

        {/*If admin or assignedtouserid show edit issue button*/}
        {(isAdmin || assignedTo?.email === data?.user?.email) && (
          <EditIssueButton issueId={issueDetail.id} />
        )}

        {issueDetail.status === "CLOSED" &&
          (assignedTo?.email === data?.user?.email || isAdmin) && (
            <ReopenIssueButton id={issueDetail.id} />
          )}
        {(isAdmin || assignedTo?.email === data.user.email) && (
          <DeleteIssueButton issueId={issueDetail.id} />
        )}

        {/*Person working on this issue*/}
        {assignedTo && (
          <Card>
            <Flex align="center" gap="1">
              <Avatar
                src={assignedTo?.image}
                fallback="?"
                radius="full"
                size="4"
              />
              <Text>
                {assignedTo?.name.length > 50
                  ? assignedTo.name
                  : assignedTo.name.slice(0, 50)}
              </Text>
            </Flex>
          </Card>
        )}
      </Flex>
    </Grid>
  );
};

export default IssueInfo;
