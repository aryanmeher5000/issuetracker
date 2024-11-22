"use client";
import { Status } from "@prisma/client";
import { Box, Select } from "@radix-ui/themes";

const Filters = () => {
  return (
    <Box className="space-x-4">
      <Select.Root>
        <Select.Trigger placeholder="Filter by status" />
        <Select.Content>
          <Select.Item key="null" value={"undefined"}>
            All
          </Select.Item>
          {Object.entries(Status).map((k) => (
            <Select.Item key={k[0]} value={k[1]}>
              {k[1]}
            </Select.Item>
          ))}
        </Select.Content>
      </Select.Root>
    </Box>
  );
};

export default Filters;
