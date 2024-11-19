import { Status } from "@prisma/client";
import { Badge } from "@radix-ui/themes";
import React from "react";

const StatusBadges = ({ status }: { status: Status }) => {
  const statusMap: Record<
    Status,
    { label: string; color: "red" | "green" | "violet" }
  > = {
    OPEN: { label: "Open", color: "red" },
    CLOSED: { label: "Closed", color: "green" },
    IN_PROGRESS: { label: "In Progress", color: "violet" },
  };
  return (
    <Badge color={statusMap[status].color}>{statusMap[status].label}</Badge>
  );
};

export default StatusBadges;
