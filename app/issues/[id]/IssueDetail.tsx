import { Badge } from "@/app/components";
import { Issue } from "@prisma/client";
import { Heading, Flex, Card, Text, Box } from "@radix-ui/themes";
import React from "react";
import ReactMarkdown from "react-markdown";

const IssueDetail = ({ issue }: { issue: Issue }) => {
  return (
    <Box className="space-y-4">
      <Heading className="mb-4">{issue.title}</Heading>

      <Flex gap="3" align="center">
        <Badge status={issue.status} />
        <Text weight="medium" size="2">
          Created: {issue.createdAt.toLocaleDateString()}
        </Text>
        {issue.deadline ? (
          <Text weight="medium" size="2">
            Deadline: {issue.deadline?.toLocaleDateString()}
          </Text>
        ) : null}
        {issue.status === "CLOSED" ? (
          <Text weight="medium" size="2">
            Closed: {issue.updatedAt.toLocaleDateString()}
          </Text>
        ) : null}
      </Flex>

      <Card className="prose max-w-full">
        <ReactMarkdown>{issue.description}</ReactMarkdown>
      </Card>
    </Box>
  );
};

export default IssueDetail;
