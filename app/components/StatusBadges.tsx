import { Priority, Status } from "@prisma/client";
import { Badge } from "@radix-ui/themes";
import React from "react";

const StatusBadges = ({
  status,
  priority,
}: {
  status?: Status;
  priority?: Priority | null;
}) => {
  // Mapping for status
  const statusMap: Record<
    Status,
    { label: string; color: "red" | "green" | "violet" }
  > = {
    OPEN: { label: "Open", color: "red" },
    CLOSED: { label: "Closed", color: "green" },
    IN_PROGRESS: { label: "In Progress", color: "violet" },
  };

  // Mapping for priority
  const priorityMap: Record<
    Priority,
    { label: string; color: "orange" | "yellow" | "cyan" }
  > = {
    HIGH: { label: "High", color: "orange" },
    MEDIUM: { label: "Medium", color: "yellow" },
    LOW: { label: "Low", color: "cyan" },
  };

  return (
    <>
      {status && (
        <Badge color={statusMap[status].color}>{statusMap[status].label}</Badge>
      )}
      {priority && (
        <Badge color={priorityMap[priority].color}>
          {priorityMap[priority].label}
        </Badge>
      )}
    </>
  );
};

export default StatusBadges;
