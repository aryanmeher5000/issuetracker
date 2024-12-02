import { Flex, Spinner } from "@radix-ui/themes";
import React from "react";

const DashboardLoading = () => {
  return (
    <Flex width="100%" height="90vh" justify="center" align="center">
      <Spinner size="3" />
    </Flex>
  );
};

export default DashboardLoading;
