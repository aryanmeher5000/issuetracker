import prisma from "@/prisma/client";
import { Box, Table } from "@radix-ui/themes";
import React from "react";
import delay from "delay";
import IssuesToolbar from "./IssuesToolbar";
import { Badge, Link } from "../components";

const IssuePage = async () => {
  const issues = await prisma.issue.findMany();
  delay(5000);

  return (
    <Box className="p-4 space-y-4">
      <IssuesToolbar />

      <Table.Root variant="surface">
        <Table.Header>
          <Table.Row>
            <Table.ColumnHeaderCell>Issue</Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="hidden md:table-cell">
              Status
            </Table.ColumnHeaderCell>
            <Table.ColumnHeaderCell className="hidden md:table-cell">
              Created
            </Table.ColumnHeaderCell>
          </Table.Row>
        </Table.Header>
        <Table.Body>
          {issues.map((k) => (
            <Table.Row key={k.id}>
              <Table.Cell>
                <Link href={`/issues/${k.id}`}>{k.title}</Link>
                <div className="div md:hidden">
                  {<Badge status={k.status} />}
                </div>
              </Table.Cell>
              <Table.Cell className="hidden md:table-cell">
                {<Badge status={k.status} />}
              </Table.Cell>
              <Table.Cell className="hidden md:table-cell">
                {k.createdAt.toDateString()}
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Box>
  );
};

export default IssuePage;
