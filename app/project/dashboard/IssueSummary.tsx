import { Card, Flex, Text } from "@radix-ui/themes";
import Link from "next/link";

interface Props {
  open: number;
  closed: number;
  inProgress: number;
}

const IssueSummary = ({ open, closed, inProgress }: Props) => {
  const statuses = [
    { label: "Open Issues", value: "OPEN", count: open },
    { label: "In Progress Issues", value: "IN_PROGRESS", count: inProgress },
    { label: "Closed Issues", value: "CLOSED", count: closed },
  ];

  return (
    <Flex gap="4">
      {statuses.map((status) => (
        <Card key={status.value}>
          <Flex direction="column" gap="2" align="center">
            <Link
              className="text-sm font-medium"
              href={`/project/issues?status=${status.value}`}
            >
              {status.label}
            </Link>
            <Text size="5" className="font-bold">
              {status.count}
            </Text>
          </Flex>
        </Card>
      ))}
    </Flex>
  );
};

export default IssueSummary;
