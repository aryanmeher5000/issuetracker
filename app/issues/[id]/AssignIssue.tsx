"use client";
import { User } from "@prisma/client";
import { Avatar, Box, Flex, Select, Skeleton, Text } from "@radix-ui/themes";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import toast, { Toaster } from "react-hot-toast";

const AssignIssue = ({ assignee, id }: { assignee?: User; id: number }) => {
  const { data, isLoading, error } = useGetUsers();
  const { mutate, isPending: isMutating } = useAssignIssue();

  if (isLoading) return <Skeleton height="30px" />;

  if (error) return <Text color="red">Failed to load users.</Text>;

  return (
    <Box height="30px">
      <Select.Root
        defaultValue={assignee?.id}
        onValueChange={(e) => mutate({ issueId: id, userId: e })}
        disabled={isMutating}
      >
        <Select.Trigger placeholder="Assign Issue" />
        <Select.Content>
          <Select.Item key="unassign" value="unassign">
            Unassign
          </Select.Item>
          {data?.length ? (
            data.map((k) => (
              <Select.Item key={k.id} value={k.id}>
                <Flex
                  justify="start"
                  align="center"
                  height="fit-content"
                  gap="2"
                >
                  <Avatar
                    src={k.image!}
                    fallback={k.name![0]}
                    referrerPolicy="no-referrer"
                    radius="full"
                    size="1"
                  />
                  <Text>{k.name}</Text>
                </Flex>
              </Select.Item>
            ))
          ) : (
            <Select.Item key="no-users" value="none" disabled>
              No users available
            </Select.Item>
          )}
        </Select.Content>
      </Select.Root>

      <Toaster position="top-center" />
    </Box>
  );
};

// Fetch users
function useGetUsers() {
  return useQuery<User[], AxiosError>({
    queryKey: ["Users"],
    queryFn: async () => {
      const res = await axios.get("/api/users");
      return res.data;
    },
    staleTime: 60 * 60 * 1000,
    retry: 2,
  });
}

// Change assignee with toast notifications and refetch
function useAssignIssue() {
  return useMutation({
    onMutate: () => {
      toast.loading("Assigning issue to user", { duration: 1 * 1000 });
    },
    mutationFn: async ({
      issueId,
      userId,
    }: {
      issueId: number;
      userId?: string;
    }) => {
      const res = await axios.post(`/api/issues/${issueId}`, {
        userId: userId === "unassign" ? null : userId,
      });
      return res.data;
    },
    onSuccess: ({ msg }: { msg: string }) => {
      toast.success(msg);
    },
    onError: (err: AxiosError<{ error: string }>) => {
      toast.error(err.response?.data?.error || "Failed to update assignment.");
    },
  });
}

export default AssignIssue;
