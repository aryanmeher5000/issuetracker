import { Flex, Skeleton } from "@radix-ui/themes";
import React from "react";

const CreateProjectLoading = () => {
  return (
    <Flex direction="column" align="center" gap="6" p="4">
      <Skeleton
        style={{ borderRadius: "100px" }}
        width="160px"
        height="160px"
      />

      <Skeleton width="200px" height="50px" />

      <Skeleton width="400px" height="30px" />

      <Skeleton width="150px" height="30px" />

      <Skeleton width={{ initial: "100%", md: "50%" }} height="200px" />
    </Flex>
  );
};

export default CreateProjectLoading;
