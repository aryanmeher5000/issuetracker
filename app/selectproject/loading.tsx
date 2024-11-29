import { Flex, Skeleton } from "@radix-ui/themes";

const SelectProjectLoading = () => {
  return (
    <Flex justify="center" align="center" direction="column" p="4" gap="6">
      <Skeleton
        style={{ borderRadius: "100px" }}
        width="150px"
        height="150px"
      />

      <Flex gap="2" direction="column">
        <Skeleton width="200px" height="50px" />
        <Skeleton width="200px" height="25px" />
      </Flex>
      <Skeleton width="200px" height="30px" />

      <Skeleton width={{ initial: "100%", md: "50%" }} height="200px" />
    </Flex>
  );
};

export default SelectProjectLoading;
