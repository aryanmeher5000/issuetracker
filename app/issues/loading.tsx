import { Skeleton, Table } from "@radix-ui/themes";
import React from "react";
import IssuesToolbar from "./IssuesToolbar";

const loading = () => {
  const issues = [1, 2, 3, 4, 5];
  return (
    <div className="p-4 space-y-4">
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
            <Table.Row key={k}>
              <Table.Cell>
                <Skeleton></Skeleton>
                <div className="div md:hidden">
                  <Skeleton></Skeleton>
                </div>
              </Table.Cell>
              <Table.Cell className="hidden md:table-cell">
                <Skeleton></Skeleton>
              </Table.Cell>
              <Table.Cell className="hidden md:table-cell">
                <Skeleton></Skeleton>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </div>
  );
};

export default loading;
