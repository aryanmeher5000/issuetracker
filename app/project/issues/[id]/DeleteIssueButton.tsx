"use client";
import { Spinner } from "@/app/components";
import { AlertDialog, Button, Flex } from "@radix-ui/themes";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import toast, { Toaster } from "react-hot-toast";
import { MdDelete } from "react-icons/md";

const DeleteIssueButton = ({ issueId }: { issueId: number }) => {
  const { mutate, isPending, error, reset } = useDeleteIssue();

  return (
    <>
      <AlertDialog.Root>
        <AlertDialog.Trigger>
          <Button color="red" disabled={isPending}>
            <MdDelete />
            Delete Issue {isPending && <Spinner />}
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
              <Button
                variant="solid"
                color="red"
                onClick={() => mutate({ issueId })}
              >
                Delete Issue
              </Button>
            </AlertDialog.Action>
          </Flex>
        </AlertDialog.Content>
      </AlertDialog.Root>

      {/* Error Dialog */}
      <AlertDialog.Root open={!!error}>
        <AlertDialog.Content maxWidth="450px">
          <AlertDialog.Title>Error Deleting</AlertDialog.Title>
          <AlertDialog.Description size="2">
            {error?.response?.data?.error ||
              error?.message ||
              "Error deleting issue."}
          </AlertDialog.Description>

          <AlertDialog.Cancel>
            <Button
              variant="soft"
              color="blue"
              mt="4"
              onClick={() => reset()} // Close the dialog
            >
              Okay
            </Button>
          </AlertDialog.Cancel>
        </AlertDialog.Content>
      </AlertDialog.Root>

      <Toaster />
    </>
  );
};

function useDeleteIssue() {
  const { push } = useRouter();
  return useMutation<
    { message: string },
    AxiosError<{ error: string }>,
    { issueId: number }
  >({
    mutationFn: async ({ issueId }) => {
      const resp = await axios.delete(`/api/issues/${issueId}`);
      return resp.data;
    },
    onSuccess: (data) => {
      toast.success(data.message || "Issue deleted successfully.");
      push("/project/issues");
    },
  });
}
export default DeleteIssueButton;
