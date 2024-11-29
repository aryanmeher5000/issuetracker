import { Flex, Skeleton } from "@radix-ui/themes";
import React from "react";

const ProjectLoading = () => {
  return (
    <Flex direction="column" align="center" gap="5" p="4">
      <Skeleton
        style={{ borderRadius: "100px" }}
        width="100px"
        height="100px"
      />

      <Skeleton width="150px" height="30px" />

      <Skeleton width={{ initial: "100%", md: "50%" }} height="200px" />
    </Flex>
  );
};

export default ProjectLoading;
