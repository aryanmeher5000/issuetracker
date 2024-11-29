"use client";
import {
  Flex,
  Heading,
  Button,
  Text,
  Table,
  TextField,
  Box,
  Tabs,
  AlertDialog,
} from "@radix-ui/themes";
import { useRouter } from "next/navigation";
import useProject from "../store";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useState } from "react";
import { z } from "zod";
import InputErrorMessage from "../components/InputErrorMessage";
import toast, { Toaster } from "react-hot-toast";
import { useSession } from "next-auth/react";
import UserAvatar from "../components/UserAvatar";
import ProjectLoading from "./loading";

export interface Props {
  userEmail: string;
  action: "add" | "remove" | "leave";
  type?: "users" | "admins";
}

const AddOrRemoveMembers = ({
  projectInfo,
}: {
  projectInfo: { admins: string[]; users: string[] };
}) => {
  const { project, isAdmin } = useProject();
  const { push } = useRouter();
  const { data } = useSession();

  if (!project) return <ProjectLoading />;

  return (
    <Flex direction="column" align="center" gap="5" p="4">
      <UserAvatar size="6" />

      <Button onClick={() => push("/selectproject")} color="lime">
        Work on a different project
      </Button>

      <Tabs.Root defaultValue="current" className="w-full lg:w-9/12">
        <Tabs.List color="amber" justify="center" size="2">
          <Tabs.Trigger value="current">Your Project</Tabs.Trigger>
          {project.type !== "PERSONAL" && (
            <Tabs.Trigger value="members">Members</Tabs.Trigger>
          )}
          <Tabs.Trigger value="settings">Settings</Tabs.Trigger>
        </Tabs.List>

        <Box pt="3" className="w-full">
          <Tabs.Content value="current">
            <Flex direction="column" gap="2" align="center">
              <Heading align="center">{project.name}</Heading>
              <Text size="1">(This is your {project.type} project)</Text>
            </Flex>
          </Tabs.Content>

          <Tabs.Content value="members" className="w-full">
            <Flex direction="column" align="center" gap="4" className="w-full">
              {isAdmin && (
                <>
                  <Heading>Add Members</Heading>
                  <AddMember type={project.type} />
                </>
              )}

              {isAdmin && (
                <RenderTable
                  arr={projectInfo.admins}
                  label={
                    project.type === "ORGANIZATION"
                      ? "Admins"
                      : project.type === "GROUP"
                      ? "Members"
                      : ""
                  }
                />
              )}
              {projectInfo?.users?.length > 0 && (
                <RenderTable arr={projectInfo.users} label="Users" />
              )}
            </Flex>
          </Tabs.Content>

          <Tabs.Content value="settings">
            <Flex justify="center" gap="4">
              {projectInfo.admins.length > 1 && data?.user?.email && (
                <LeaveButton
                  userEmail={data.user.email}
                  isDisabled={projectInfo.admins.length < 2}
                />
              )}
              {isAdmin && <DeleteButton />}
            </Flex>
          </Tabs.Content>
        </Box>
      </Tabs.Root>

      <Toaster />
    </Flex>
  );
};

function AddMember({ type }: { type: string }) {
  const [email, setEmail] = useState(""); // Use state to track input value
  const [error, setError] = useState<string>(""); // State for error messages
  const emailSchema = z.string().email("Invalid email format");

  const { mutate, isPending } = useHandleMembers(); // Hook for mutation handling

  const handleAddMember = (roleType: "admins" | "users") => {
    const validEmail = emailSchema.safeParse(email); // Validate email format
    if (!validEmail.success) {
      setError(validEmail.error.errors[0]?.message || "Invalid email schema");
      return;
    }
    setError(""); // Clear any existing errors
    mutate({ userEmail: validEmail.data, action: "add", type: roleType }); // Trigger mutation
    setEmail(""); // Clear the input after submission
  };

  return (
    <Box className="w-full lg:w-7/12">
      <Flex
        gap="2"
        direction={{ initial: "column", md: "row" }}
        align="center"
        width="100%"
      >
        {/* Controlled Input */}
        <TextField.Root
          placeholder="Enter Email ID"
          value={email}
          onChange={(e) => {
            setEmail(e.target.value);
            if (error) setError(""); // Clear error when input changes
          }}
          className="w-full md:w-8/12"
        />
        {type === "GROUP" ? (
          <Button
            variant="soft"
            disabled={!!error || isPending || !email.trim()} // Prevent submission if invalid
            onClick={() => handleAddMember("admins")}
          >
            Add Member
          </Button>
        ) : (
          <Flex justify="center" gap="2">
            <Button
              variant="soft"
              disabled={!!error || isPending || !email.trim()}
              onClick={() => handleAddMember("admins")}
            >
              Add Admin
            </Button>
            <Button
              variant="soft"
              color="blue"
              disabled={!!error || isPending || !email.trim()}
              onClick={() => handleAddMember("users")}
            >
              Add Member
            </Button>
          </Flex>
        )}
      </Flex>
      {/* Show Error Message */}
      {error && <InputErrorMessage>{error}</InputErrorMessage>}
    </Box>
  );
}

function RenderTable({ arr, label }: { arr: string[]; label: string }) {
  const { mutate, isPending } = useHandleMembers();
  const { data } = useSession();

  return (
    <Table.Root className="w-full md:w-7/12">
      <Table.Header>
        <Table.Row>
          <Table.ColumnHeaderCell>{label}</Table.ColumnHeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {arr?.length > 0 ? (
          arr.map((user) => (
            <Table.Row key={user}>
              <Table.Cell>
                <Flex align="center" justify="between" gap="4">
                  <Text>{user}</Text>
                  <Button
                    variant="soft"
                    color="red"
                    disabled={isPending || user == data?.user?.email}
                    onClick={() =>
                      mutate({
                        userEmail: user,
                        action: "remove",
                        type: "admins",
                      })
                    }
                  >
                    Remove
                  </Button>
                </Flex>
              </Table.Cell>
            </Table.Row>
          ))
        ) : (
          <Table.Row>
            <Table.Cell>No members found.</Table.Cell>
          </Table.Row>
        )}
      </Table.Body>
    </Table.Root>
  );
}

function LeaveButton({
  userEmail,
  isDisabled,
}: {
  userEmail: string;
  isDisabled: boolean;
}) {
  const { mutate } = useHandleMembers();

  return (
    <AlertDialog.Root>
      <AlertDialog.Trigger>
        <Button color="red" variant="soft">
          Leave Project
        </Button>
      </AlertDialog.Trigger>
      <AlertDialog.Content maxWidth="450px">
        <AlertDialog.Title>Leave Project?</AlertDialog.Title>
        <AlertDialog.Description size="2">
          Are you sure? This action is irreversible!
        </AlertDialog.Description>

        <Flex gap="3" mt="4" justify="end">
          <AlertDialog.Cancel>
            <Button variant="soft" color="gray">
              Cancel
            </Button>
          </AlertDialog.Cancel>
          <AlertDialog.Action>
            <Button
              color="orange"
              variant="soft"
              disabled={isDisabled}
              onClick={() => {
                mutate({ userEmail, action: "leave", type: "admins" });
              }}
            >
              Leave this project
            </Button>
          </AlertDialog.Action>
        </Flex>
      </AlertDialog.Content>
    </AlertDialog.Root>
  );
}

function DeleteButton() {
  const { mutate } = useDeleteProject();
  return (
    <AlertDialog.Root>
      <AlertDialog.Trigger>
        <Button color="red">Delete This Project</Button>
      </AlertDialog.Trigger>
      <AlertDialog.Content maxWidth="450px">
        <AlertDialog.Title>Leave Project?</AlertDialog.Title>
        <AlertDialog.Description size="2">
          Are you sure? This action is irreversible and all the project related
          data will be lost!
        </AlertDialog.Description>

        <Flex gap="3" mt="4" justify="end">
          <AlertDialog.Cancel>
            <Button variant="soft" color="gray">
              Cancel
            </Button>
          </AlertDialog.Cancel>
          <AlertDialog.Action>
            <Button
              color="red"
              onClick={() => {
                mutate();
              }}
            >
              Delete this project
            </Button>
          </AlertDialog.Action>
        </Flex>
      </AlertDialog.Content>
    </AlertDialog.Root>
  );
}

function useHandleMembers() {
  const { refresh, push } = useRouter();
  return useMutation<{ message: string }, AxiosError<{ error: string }>, Props>(
    {
      mutationFn: async ({ userEmail, action, type }) => {
        const res = await axios.put("/api/project", {
          userEmail,
          action,
          type,
        });
        return res.data;
      },
      onSuccess: (data, { action }) => {
        toast.success(data.message || "Member updated successfully.");
        if (action === "leave") {
          push("/selectproject");
        } else refresh();
      },
      onError: (err) => {
        toast.error(err?.response?.data?.error || "An error occurred!");
      },
    }
  );
}

function useDeleteProject() {
  const { push } = useRouter();
  return useMutation<{ message: string }, AxiosError<{ error: string }>>({
    mutationFn: async () => {
      const res = await axios.delete("/api/project");
      return res.data;
    },
    onSuccess: (data) => {
      toast.success(data.message || "Project deleted successfully");
      push("/selectproject");
    },
    onError: (err) => {
      toast.error(err?.response?.data?.error || "An error occurred!");
    },
  });
}

export default AddOrRemoveMembers;
