import { Box, Card, Flex, Skeleton, Text } from "@radix-ui/themes";

const DetailPageLoading = () => {
  return (
    <Box className="p-4 max-w-2xl">
      <Skeleton mb="4" height="30px" width="xl" />

      <Flex gap="3" align="center" className="mb-4">
        <Skeleton width="5rem" />
        <Skeleton width="8rem" />
      </Flex>

      <Card>
        <Text>
          <Skeleton />
        </Text>
        <Text>
          <Skeleton />
        </Text>
        <Text>
          <Skeleton />
        </Text>
      </Card>
    </Box>
  );
};

export default DetailPageLoading;
