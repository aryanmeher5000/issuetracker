"use client";
import { Priority, Status } from "@prisma/client";
import { Flex, Select } from "@radix-ui/themes";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const Filters = () => {
  const { push } = useRouter();

  // Get search params
  const searchParams = useSearchParams();
  const pathName = usePathname();

  //Get current status
  const stat = searchParams.get("status");
  const prio = searchParams.get("priority");
  const currStat =
    stat && Object.values(Status).includes(stat as Status) ? stat : "undefined";
  const currPrio =
    prio && Object.values(Priority).includes(prio as Priority)
      ? stat
      : "undefined";

  //Handle the change in status
  function handleStatusChange(status: string) {
    //Create a params object
    const params = new URLSearchParams(searchParams.toString());
    // Update or delete the status parameter based on selection
    if (status === "undefined") {
      params.delete("status");
    } else {
      params.set("status", status);
    }
    //Delete the page param
    if (params.has("page")) params.delete("page");
    // Push updated query to the router
    const query = params.toString()
      ? `${pathName}?${params.toString()}`
      : pathName;
    push(query);
  }

  function handlePriorityChange(priority: string) {
    const params = new URLSearchParams(searchParams.toString());
    // Update or delete the status parameter based on selection
    if (priority === "undefined") {
      params.delete("priority");
    } else {
      params.set("priority", priority);
    }
    //Delete the page param
    if (params.has("page")) params.delete("page");
    // Push updated query to the router
    const query = params.toString()
      ? `${pathName}?${params.toString()}`
      : pathName;
    push(query);
  }

  return (
    <Flex gap="2">
      <Select.Root onValueChange={handleStatusChange} defaultValue={currPrio}>
        <Select.Trigger placeholder="Filter by status" />
        <Select.Content>
          {/* Option for all statuses */}
          <Select.Item key="undefined" value="undefined">
            All
          </Select.Item>
          {/* Dynamically generate options from Status */}
          {Object.entries(Status).map(([key, value]) => (
            <Select.Item key={key} value={value}>
              {value}
            </Select.Item>
          ))}
        </Select.Content>
      </Select.Root>
      <Select.Root onValueChange={handlePriorityChange} defaultValue={currStat}>
        <Select.Trigger placeholder="Filter by priority" />
        <Select.Content>
          {/* Option for all statuses */}
          <Select.Item key="undefined" value="undefined">
            All
          </Select.Item>
          {/* Dynamically generate options from Status */}
          {Object.entries(Priority).map(([key, value]) => (
            <Select.Item key={key} value={value}>
              {value}
            </Select.Item>
          ))}
        </Select.Content>
      </Select.Root>
    </Flex>
  );
};

export default Filters;
