"use client";
import { Priority, Status } from "@prisma/client";
import { Flex, Select } from "@radix-ui/themes";
import { usePathname, useRouter, useSearchParams } from "next/navigation";

// Reusable Select Component
const FilterSelect = ({
  value,
  options,
  onChange,
}: {
  label: string;
  value: string;
  options: Record<string, string>;
  onChange: (value: string) => void;
}) => (
  <Select.Root onValueChange={onChange} defaultValue={value}>
    <Select.Trigger />
    <Select.Content>
      <Select.Item key="undefined" value="undefined">
        All
      </Select.Item>
      {Object.entries(options).map(([key, val]) => (
        <Select.Item key={key} value={val}>
          {val}
        </Select.Item>
      ))}
    </Select.Content>
  </Select.Root>
);

const Filters = () => {
  const { push } = useRouter();
  const searchParams = useSearchParams();
  const pathName = usePathname();

  // Memoize current filter values
  const currStat =
    searchParams.get("status") &&
    Object.values(Status).includes(searchParams.get("status") as Status)
      ? searchParams.get("status")
      : "undefined";

  const currPrio =
    searchParams.get("priority") &&
    Object.values(Priority).includes(searchParams.get("priority") as Priority)
      ? searchParams.get("priority")
      : "undefined";

  // Generic function to handle filter changes
  const handleFilterChange = (type: "status" | "priority", value: string) => {
    const params = new URLSearchParams(searchParams.toString());

    // Update or delete the filter parameter
    if (value === "undefined") {
      params.delete(type);
    } else {
      params.set(type, value);
    }

    // Remove the page param to reset pagination
    params.delete("page");

    // Update the URL
    const query = params.toString()
      ? `${pathName}?${params.toString()}`
      : pathName;
    push(query);
  };

  return (
    <Flex gap="2">
      {/* Status Filter */}
      <FilterSelect
        label="Status"
        value={currStat!}
        options={Status}
        onChange={(status) => handleFilterChange("status", status)}
      />

      {/* Priority Filter */}
      <FilterSelect
        label="Priority"
        value={currPrio!}
        options={Priority}
        onChange={(priority) => handleFilterChange("priority", priority)}
      />
    </Flex>
  );
};

export default Filters;
