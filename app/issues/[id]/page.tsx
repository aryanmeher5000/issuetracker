import StatusBadges from "@/app/StatusBadges";
import prisma from "@/prisma/client";
import { Box, Card, Flex, Heading, Text } from "@radix-ui/themes";
import { notFound } from "next/navigation";
import React from "react";
import ReactMarkdown from "react-markdown";

interface Props {
  params: { id: string };
}

const IssueDetailPage = async ({ params }: Props) => {
  const issueDetail = await prisma.issue.findUnique({
    where: { id: parseInt(params.id) },
  });

  if (!issueDetail) notFound();

  return (
    <Box className="p-4 max-w-2xl">
      <Heading className="mb-4">{issueDetail.title}</Heading>

      <Flex gap="3" align="center" className="mb-4">
        <StatusBadges status={issueDetail.status} />
        <Text>{issueDetail.createdAt.toDateString()}</Text>
      </Flex>

      <Card className="prose">
        <ReactMarkdown>{issueDetail.description}</ReactMarkdown>
      </Card>
    </Box>
  );
};

export default IssueDetailPage;
