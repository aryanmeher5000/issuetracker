"use client";
import { Badge, Link } from "@/app/components";
import { Issue } from "@prisma/client";
import { Flex, Table } from "@radix-ui/themes";
import { useRouter, useSearchParams, usePathname } from "next/navigation";
import { useState } from "react";
import { RiExpandUpDownLine } from "react-icons/ri";

const IssuesTable = ({ issues }: { issues: Issue[] }) => {
  const columns = [
    {
      label: "Issue",
      value: "title",
      class: "cursor-pointer",
    },
    {
      label: "Status",
      value: "status",
      class: "hidden md:table-cell ",
    },
    {
      label: "Priority",
      value: "priority",
      class: "hidden md:table-cell ",
    },
    {
      label: "Created At",
      value: "createdAt",
      class: "cursor-pointer",
    },
  ];

  // Get search params
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathName = usePathname();
  const [arrowOn, setArrowOn] = useState("");

  function handleSort(val: string) {
    const params = new URLSearchParams(searchParams);

    //Check order and orderBy
    if (val === "status") return;

    const ordrBy = searchParams.get("orderBy");
    let ordr = searchParams.get("order");
    if (ordrBy && ordrBy === val) {
      // Toggle the order direction if the same field is clicked
      ordr = ordr === "asc" ? "desc" : "asc";
      params.set("orderBy", val);
      params.set("order", ordr);
    } else {
      // Otherwise, set the new field and default to descending order
      params.set("orderBy", val);
      params.set("order", "desc");
    }

    // Construct the query string and navigate
    setArrowOn(val);
    pathName.slice(pathName.length - 4, pathName.length - 1);
    const query = params.toString() ? `${pathName}?${params.toString()}` : "";
    router.push(query);
  }

  return (
    <Table.Root variant="surface">
      <Table.Header>
        <Table.Row>
          {columns.map((k) => (
            <Table.ColumnHeaderCell
              key={k.value}
              className={k.class}
              onClick={() => handleSort(k.value)}
            >
              <Flex gap="2" align="center">
                {k.label}
                {k.value === arrowOn && <RiExpandUpDownLine />}
              </Flex>
            </Table.ColumnHeaderCell>
          ))}
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {issues?.length > 0 ? (
          issues.map((k) => (
            <Table.Row key={k.id}>
              <Table.Cell>
                <Link href={`/project/issues/${k.id}`}>{k.title}</Link>
                <div className="div md:hidden">
                  {<Badge status={k.status} />}
                </div>
              </Table.Cell>
              <Table.Cell className="hidden md:table-cell">
                {<Badge status={k.status} />}
              </Table.Cell>
              <Table.Cell>
                <Badge priority={k?.priority} />
              </Table.Cell>
              <Table.Cell>{k.createdAt.toDateString()}</Table.Cell>
            </Table.Row>
          ))
        ) : (
          <Table.Row>
            <Table.Cell>No such issues found.</Table.Cell>
          </Table.Row>
        )}
      </Table.Body>
    </Table.Root>
  );
};

export default IssuesTable;
