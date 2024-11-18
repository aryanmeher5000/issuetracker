import prisma from "@/prisma/client";
import { Button, Table } from "@radix-ui/themes";
import Link from "next/link";
import React from "react";
import StatusBadges from "../StatusBadges";

const IssuePage = async () => {
  const issues = await prisma.issue.findMany();

  return (
    <div className="p-4 space-y-4">
      <Button>
        <Link href="/issues/new">New Issue</Link>
      </Button>

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
                {k.title}
                <div className="div md:hidden">
                  {<StatusBadges status={k.status} />}
                </div>
              </Table.Cell>
              <Table.Cell className="hidden md:table-cell">
                {<StatusBadges status={k.status} />}
              </Table.Cell>
              <Table.Cell className="hidden md:table-cell">
                {k.createdAt.toLocaleDateString()}
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </div>
  );
};

export default IssuePage;
