import { Flex, Spinner } from "@radix-ui/themes";
import React from "react";

const DashboardLoading = () => {
  return (
    <Flex width="80vw" height="80vh" justify="center" align="center">
      <Spinner size="3" />
    </Flex>
  );
};

export default DashboardLoading;
