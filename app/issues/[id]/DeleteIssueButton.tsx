"use client";
import { AlertDialog, Button, Flex } from "@radix-ui/themes";
import axios from "axios";
import { useRouter } from "next/navigation";
import { useState } from "react";
import { MdDelete } from "react-icons/md";

const DeleteIssueButton = ({ issueId }: { issueId: number }) => {
  const router = useRouter();
  const [err, setErr] = useState<boolean>(false);
  async function deleteIssue() {
    try {
      throw Error();
      await axios.delete("/api/issues/" + issueId);
      router.push("/issues");
      router.refresh();
    } catch (err) {
      setErr(true);
      console.log(err);
    }
  }

  return (
    <>
      <AlertDialog.Root>
        <AlertDialog.Trigger>
          <Button color="red">
            <MdDelete />
            Delete Issue
          </Button>
        </AlertDialog.Trigger>
        <AlertDialog.Content maxWidth="450px">
          <AlertDialog.Title>Confirm Issue Deletion</AlertDialog.Title>
          <AlertDialog.Description size="2">
            Are you sure? This action is irreversible and issue will be deleted
            permanently.
          </AlertDialog.Description>

          <Flex gap="3" mt="4" justify="end">
            <AlertDialog.Cancel>
              <Button variant="soft" color="gray">
                Cancel
              </Button>
            </AlertDialog.Cancel>
            <AlertDialog.Action>
              <Button variant="solid" color="red" onClick={deleteIssue}>
                Delete Issue
              </Button>
            </AlertDialog.Action>
          </Flex>
        </AlertDialog.Content>
      </AlertDialog.Root>

      <AlertDialog.Root open={err}>
        <AlertDialog.Content maxWidth="450px">
          <AlertDialog.Title>Error Deleting</AlertDialog.Title>
          <AlertDialog.Description size="2">
            An error occured while deleting this issue!
          </AlertDialog.Description>

          <AlertDialog.Cancel>
            <Button
              variant="soft"
              color="red"
              onClick={() => setErr(false)}
              mt="4"
            >
              Okay
            </Button>
          </AlertDialog.Cancel>
        </AlertDialog.Content>
      </AlertDialog.Root>
    </>
  );
};

export default DeleteIssueButton;
