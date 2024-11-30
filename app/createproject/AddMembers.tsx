"use client";
import { ProjectType } from "@prisma/client";
import { Button, Flex, Table, TextField, Text } from "@radix-ui/themes";
import { useEffect, useRef, useState } from "react";
import { z } from "zod";
import InputErrorMessage from "../components/InputErrorMessage";
import { useSession } from "next-auth/react";
import { CreateProject } from "../validationSchema";
import { UseFormSetValue } from "react-hook-form";
import { useRouter } from "next/navigation";

const emailSchema = z.string().email("Invalid email format");

const AddMembers = ({
  watchType,
  setValue,
}: {
  watchType: ProjectType;
  setValue: UseFormSetValue<CreateProject>;
}) => {
  const { data: session, status } = useSession();
  const { push } = useRouter();
  const [admins, setAdmins] = useState<string[]>([]);
  const [users, setUsers] = useState<string[]>([]);
  const [error, setError] = useState<string | null>(null);
  const inputRef = useRef<HTMLInputElement | null>(null);

  if (!session || !session.user?.email) push("/api/auth/signin");

  // Add current user's email to admins once session data is ready
  useEffect(() => {
    if (status === "authenticated" && session?.user?.email) {
      setAdmins([session!.user!.email!]);
      setValue("admins", [...admins, session.user.email]);
    }
  }, [session, status, setValue]); // Update when session or status changes

  const handleAddMember = (type: "admin" | "user") => {
    const inputValue = inputRef.current?.value.trim();

    if (!inputValue) {
      setError("Input cannot be empty.");
      return;
    }

    if (!emailSchema.safeParse(inputValue).success) {
      setError("Please enter a valid email address.");
      return;
    }

    setError(null);
    if (type === "admin") {
      setAdmins((prev) => [...prev, inputValue]);
      setValue("admins", [...admins, inputValue]);
    }
    if (type === "user") {
      setUsers((prev) => [...prev, inputValue]);
      setValue("users", [...users, inputValue]);
    }

    if (inputRef.current) inputRef.current.value = "";
  };

  const handleRemoveMember = (type: "admin" | "user", index: number) => {
    if (type === "admin") {
      const updatedAdmins = admins.filter((_, i) => i !== index);
      setAdmins(updatedAdmins);
      setValue("admins", updatedAdmins);
    } else if (type === "user") {
      const updatedUsers = users.filter((_, i) => i !== index);
      setUsers(updatedUsers);
      setValue("users", updatedUsers);
    }
  };

  return (
    <Flex direction="column" gap="4" width="100%" p="4">
      {/* Input and Buttons */}
      {(watchType === "GROUP" || watchType === "ORGANIZATION") && (
        <Flex gap="2" width="100%">
          <TextField.Root
            style={{ flex: 1 }}
            ref={inputRef}
            placeholder="Enter email address"
            onChange={() => error && setError(null)}
          />
          {watchType === "GROUP" ? (
            <Button
              type="button"
              onClick={() => handleAddMember("admin")}
              variant="soft"
            >
              Add
            </Button>
          ) : (
            <>
              <Button
                type="button"
                onClick={() => handleAddMember("admin")}
                variant="soft"
              >
                Add Admin
              </Button>
              <Button
                type="button"
                onClick={() => handleAddMember("user")}
                variant="soft"
                color="blue"
              >
                Add User
              </Button>
            </>
          )}
        </Flex>
      )}
      {error && <InputErrorMessage>{error}</InputErrorMessage>}

      {/* Admins Table */}
      {(watchType === "GROUP" || watchType === "ORGANIZATION") && (
        <TableSection
          title={watchType === "GROUP" ? "Members" : "Admins"}
          data={admins}
          onRemove={(index) => handleRemoveMember("admin", index)}
          currUser={session!.user!.email!}
        />
      )}

      {/* Users Table */}
      {watchType === "ORGANIZATION" && (
        <TableSection
          title="Users"
          data={users}
          onRemove={(index) => handleRemoveMember("user", index)}
          currUser={session!.user!.email!}
        />
      )}
    </Flex>
  );
};

const TableSection = ({
  title,
  data,
  currUser,
  onRemove,
}: {
  title: string;
  data: string[];
  currUser: string;
  onRemove: (index: number) => void;
}) => {
  return (
    <Table.Root variant="surface">
      <Table.Header>
        <Table.Row>
          <Table.ColumnHeaderCell>{title}</Table.ColumnHeaderCell>
        </Table.Row>
      </Table.Header>
      <Table.Body>
        {data.length > 0 ? (
          data.map((item, index) => (
            <Table.Row key={index}>
              <Table.Cell>
                <Flex justify="between" align="center" gap="2">
                  <Text style={{ maxWidth: "100%", whiteSpace: "nowrap" }}>
                    {item}
                  </Text>
                  <Button
                    variant="soft"
                    color="red"
                    disabled={item === currUser}
                    onClick={() => onRemove(index)}
                  >
                    Remove
                  </Button>
                </Flex>
              </Table.Cell>
            </Table.Row>
          ))
        ) : (
          <Table.Row>
            <Table.Cell colSpan={2}>No {title.toLowerCase()} yet.</Table.Cell>
          </Table.Row>
        )}
      </Table.Body>
    </Table.Root>
  );
};

export default AddMembers;
