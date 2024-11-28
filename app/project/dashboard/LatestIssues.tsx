import prisma from "@/prisma/client";
import { Avatar, Card, Flex, Heading, Table } from "@radix-ui/themes";
import { Badge } from "../../components";
import Link from "next/link";
import { getProjectId } from "@/app/lib/getProjectId";

const LatestIssues = async () => {
  const projectId = await getProjectId();

  const issues = await prisma.issue.findMany({
    where: { projectId: projectId },
    orderBy: { createdAt: "desc" },
    take: 5,
    include: { assignedToUser: true },
  });

  return (
    <Card>
      <Heading size="4" mb="4">
        Latest Issues
      </Heading>
      <Table.Root variant="surface">
        <Table.Body>
          {issues.map((issue) => (
            <Table.Row key={issue.id}>
              <Table.Cell>
                <Flex justify="between" align="center">
                  <Flex direction="column" align="start" gap="2">
                    <Link href={`/project/issues/${issue.id}`}>
                      {issue.title}
                    </Link>
                    <Flex gap="1">
                      <Badge status={issue.status} />
                      <Badge priority={issue.priority} />
                    </Flex>
                  </Flex>
                  {issue.assignedToUser && (
                    <Avatar
                      size="2"
                      radius="full"
                      referrerPolicy="no-referrer"
                      src={issue.assignedToUser.image!}
                      fallback="?"
                    />
                  )}
                </Flex>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Card>
  );
};

export default LatestIssues;
