import { Box, Card, Flex, Grid, Skeleton, Text } from "@radix-ui/themes";

const DetailPageLoading = () => {
  return (
    <Grid columns={{ initial: "1", sm: "5" }} p="4" gap="4">
      <Box className="col-span-4">
        <Skeleton mb="4" height="30px" />

        <Flex gap="3" align="center" className="mb-4">
          <Skeleton width="5rem" />
          <Skeleton width="8rem" />
        </Flex>

        <Card mb="4">
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

      <Flex direction="column" gap="2" width="100%">
        <Skeleton height="30px" />
        <Skeleton height="30px" />
        <Skeleton height="30px" />
        <Skeleton height="60px" />
      </Flex>
    </Grid>
  );
};

export default DetailPageLoading;
