import prisma from "@/prisma/client";
import { Box, Text } from "@radix-ui/themes";
import { auth } from "../api/auth/auth";
import IssuesTable from "../components/IssuesTable";

const DelegatedIssues = async () => {
  // Authenticate the user
  const session = await auth();

  // Fetch delegated issues using Prisma
  const delegatedIssues = await prisma.user.findUnique({
    where: { email: session!.user.email! },
    select: {
      assignedIssues: true, // Select only assigned issues for efficiency
    },
  });

  // Early return if there are no delegated issues
  const issues = delegatedIssues?.assignedIssues || [];
  if (issues.length === 0) {
    return (
      <Box>
        <Text>There are no issues currently delegated to you.</Text>
      </Box>
    );
  }

  // Render the issues table
  return (
    <Box>
      <IssuesTable issues={issues} />
    </Box>
  );
};

export default DelegatedIssues;
