import { Badge } from "@/app/components";
import { Issue } from "@prisma/client";
import { Heading, Flex, Card, Text, Box } from "@radix-ui/themes";
import React from "react";
import ReactMarkdown from "react-markdown";
import { VscFolderOpened } from "react-icons/vsc";
import { GrInProgress } from "react-icons/gr";
import { FaRegFolderClosed } from "react-icons/fa6";

const IssueDetail = ({ issue }: { issue: Issue }) => {
  const {
    title,
    status,
    priority,
    description,
    createdAt,
    updatedAt,
    inProgression,
  } = issue;

  return (
    <Box className="space-y-4">
      <Heading>{title}</Heading>

      <Flex gap="3" align="center">
        <Badge status={status} />
        <Badge priority={priority} />
      </Flex>

      <Card className="prose max-w-full">
        <ReactMarkdown>{description}</ReactMarkdown>
      </Card>

      <Card className="lg:w-6/12">
        <Flex direction={{ initial: "column" }} gap="6" className="timeline">
          <Heading size="4" weight="bold">
            Timeline
          </Heading>

          <TimelineItem
            color="#FF6961"
            icon={<VscFolderOpened color="white" fontSize="1.5rem" />}
            label="Opened On"
            date={createdAt}
          />
          <TimelineItem
            color="#CF9FFF"
            icon={<GrInProgress color="white" fontSize="1.5rem" />}
            label="In Progress"
            date={inProgression}
          />
          <TimelineItem
            color="#90ee90"
            icon={<FaRegFolderClosed color="white" fontSize="1.5rem" />}
            label="Closed On"
            date={status === "CLOSED" ? updatedAt : undefined}
          />
        </Flex>
      </Card>
    </Box>
  );
};

interface TimelineItemProps {
  color: string;
  icon: React.ReactNode;
  label: string;
  date?: Date | null;
}

const TimelineItem = ({ color, icon, label, date }: TimelineItemProps) => {
  if (!date) return null;

  return (
    <Flex align="center" gap="2" className="timeline-item">
      {/* Icon with circular background */}
      <Box
        style={{
          backgroundColor: color,
          padding: "10px",
          borderRadius: "50%",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          width: "40px",
          height: "40px",
        }}
        className="timeline-icon"
      >
        {icon}
      </Box>

      {/* Label and Date */}
      <Box className="timeline-content" style={{ flex: 1 }}>
        <Text weight="medium" size="3" color="gray">
          {label + ": "}
        </Text>
        <Text size="2" color="gray">
          {date.toDateString()}
        </Text>
      </Box>
    </Flex>
  );
};

export default IssueDetail;
