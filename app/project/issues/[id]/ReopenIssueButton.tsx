"use client";
import { Button } from "@radix-ui/themes";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import toast from "react-hot-toast";
import { GoIssueReopened } from "react-icons/go";

const ReopenIssueButton = ({ id }: { id: number }) => {
  const { mutate } = useReopenIssue();

  return (
    <Button onClick={() => mutate(id)} variant="soft" color="orange">
      <GoIssueReopened />
      Reopen Issue
    </Button>
  );
};

function useReopenIssue() {
  const { refresh } = useRouter();
  return useMutation<{ message: string }, AxiosError, number>({
    mutationFn: async (id: number) => {
      const res = await axios.patch(`/api/issues/${id}`, { status: "OPEN" });
      return res.data;
    },
    onSuccess: () => {
      toast.success("Issue reopened.");
      refresh();
    },
  });
}

export default ReopenIssueButton;
