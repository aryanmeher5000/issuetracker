import { AlertDialog, Button, Flex } from "@radix-ui/themes";
import { UseMutateFunction } from "@tanstack/react-query";
import { AxiosError } from "axios";
import { Props } from "./AddOrRemoveMembers";

const LeaveButton = ({
  userEmail,
  mutate,
  isDisabled,
}: {
  userEmail: string;
  mutate: UseMutateFunction<
    {
      message: string;
    },
    AxiosError<
      {
        error: string;
      },
      any
    >,
    Props,
    unknown
  >;
  isDisabled: boolean;
}) => {
  return (
    <AlertDialog.Root>
      <AlertDialog.Trigger>
        <Button color="red">Revoke access</Button>
      </AlertDialog.Trigger>
      <AlertDialog.Content maxWidth="450px">
        <AlertDialog.Title>Revoke access</AlertDialog.Title>
        <AlertDialog.Description size="2">
          Are you sure you want to leave this project? This process is
          irreversible!
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
                mutate({ userEmail, action: "leave" });
              }}
            >
              Leave this project
            </Button>
          </AlertDialog.Action>
        </Flex>
      </AlertDialog.Content>
    </AlertDialog.Root>
  );
};

export default LeaveButton;
