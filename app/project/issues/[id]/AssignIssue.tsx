"use client";
import { User } from "@prisma/client";
import { Avatar, Box, Flex, Select, Skeleton, Text } from "@radix-ui/themes";
import { useMutation, useQuery } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";

const AssignIssue = ({ assignee, id }: { assignee?: User; id: number }) => {
  const { data, isLoading, error } = useGetUsers();
  const { mutate, isPending: isMutating } = useAssignIssue();

  if (isLoading) return <Skeleton height="30px" />;

  if (error) return <Text color="red">Failed to load users.</Text>;
  return (
    <Box height="30px">
      <Select.Root
        defaultValue={assignee?.email}
        onValueChange={(e) => mutate({ issueId: id, userId: e })}
        disabled={isMutating}
      >
        <Select.Trigger style={{ width: "100%" }} placeholder="Assign Issue" />
        <Select.Content>
          {/* Unassign Option */}
          <Select.Item key="unassign" value="unassign">
            Unassign
          </Select.Item>

          {data?.admins.length ? (
            <>
              <Select.Group>
                <Select.Label>Admins</Select.Label>
                {data.admins.map((admin) => (
                  <Select.Item key={admin.email} value={admin.email}>
                    <Flex
                      justify="start"
                      align="center"
                      height="fit-content"
                      gap="2"
                    >
                      <Avatar
                        src={admin.image!}
                        fallback={admin.name![0]}
                        referrerPolicy="no-referrer"
                        radius="full"
                        size="1"
                      />
                      <Text>
                        {admin.name.length > 25
                          ? admin.name.slice(0, 25)
                          : admin.name}
                      </Text>
                    </Flex>
                  </Select.Item>
                ))}
              </Select.Group>
            </>
          ) : null}

          {/* Users Section */}
          {data?.users.length ? (
            <>
              <Select.Separator />
              <Select.Group>
                <Select.Label>Users</Select.Label>
                {data.users.map((user) => (
                  <Select.Item key={user.email} value={user.email}>
                    <Flex
                      justify="start"
                      align="center"
                      height="fit-content"
                      gap="2"
                    >
                      <Avatar
                        src={user.image!}
                        fallback={user.name![0]}
                        referrerPolicy="no-referrer"
                        radius="full"
                        size="1"
                      />
                      <Text>
                        {user.name.length > 25
                          ? user.name.slice(0, 25)
                          : user.name}
                      </Text>
                    </Flex>
                  </Select.Item>
                ))}
              </Select.Group>
            </>
          ) : null}

          {/* No Users Available */}
          {!data?.admins.length && !data?.users.length && (
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
  return useQuery<{ admins: User[]; users: User[] }, AxiosError>({
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
export function useAssignIssue() {
  const { refresh } = useRouter();
  return useMutation({
    mutationFn: async ({
      issueId,
      userId,
    }: {
      issueId: number;
      userId?: string;
    }) => {
      const res = await axios.post(`/api/issues/${issueId}`, { userId });
      return res.data;
    },
    onSuccess: ({ message }: { message: string }) => {
      toast.success(message);
      refresh();
    },
    onError: (err: AxiosError<{ error: string }>) => {
      toast.error(err.response?.data?.error || "Failed to update assignment.");
    },
  });
}

export default AssignIssue;
