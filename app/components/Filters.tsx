"use client";
import { Status } from "@prisma/client";
import { Box, Select } from "@radix-ui/themes";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

const Filters = () => {
  const { push } = useRouter();

  // Get search params
  const searchParams = useSearchParams();
  const pathName = usePathname();

  //Get current status
  const stat = searchParams.get("status");
  const currStat =
    stat && Object.values(Status).includes(stat as Status) ? stat : "undefined";

  //Handle the change in status
  function handleValueChange(status: string) {
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

  return (
    <Box>
      <Select.Root onValueChange={handleValueChange} defaultValue={currStat}>
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
    </Box>
  );
};

export default Filters;
