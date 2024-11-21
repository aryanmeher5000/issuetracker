"use client";
import { createIssueSchema, updateIssueSchema } from "@/app/validationSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Issue, Status } from "@prisma/client";
import { Box, Button, Select, Spinner, TextField } from "@radix-ui/themes";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import "easymde/dist/easymde.min.css";
import { z } from "zod";
import { Error } from "../../components";
import dynamic from "next/dynamic";
const SimpleMde = dynamic(() => import("react-simplemde-editor"), {
  ssr: false,
});

type CreateIssueSchema = z.infer<typeof createIssueSchema>;
type UpdateIssueSchema = z.infer<typeof updateIssueSchema>;

const IssueForm = ({ issue }: { issue?: Issue }) => {
  const schema = issue ? updateIssueSchema : createIssueSchema;
  type FormData = typeof issue extends undefined
    ? CreateIssueSchema
    : UpdateIssueSchema;

  const {
    register,
    handleSubmit,
    control,
    formState: { errors, isDirty },
  } = useForm<FormData>({
    defaultValues: issue,
    resolver: zodResolver(schema), // Correct schema
  });

  const crtIssue = useCreateIssue();
  const updIssue = useUpdateIssue();
  const isLoading = crtIssue.isPending || updIssue.isPending;
  const onSubmit = async (data: FormData) => {
    if (issue) updIssue.mutate(data);
    else crtIssue.mutate(data);
  };

  return (
    <Box className="max-w-xl  p-4">
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <TextField.Root
          placeholder="Title"
          {...register("title")}
        ></TextField.Root>
        <Error>{errors.title?.message}</Error>

        <Controller
          name="description"
          control={control}
          render={({ field }) => (
            <SimpleMde
              {...field}
              onChange={(value) => field.onChange(value)}
              value={field.value || ""}
              placeholder="Description of issue."
            />
          )}
        />
        <Error>{errors.description?.message}</Error>

        {/*Update status of issue*/}
        {issue && (
          <Box>
            <Controller
              name="status"
              control={control}
              defaultValue={issue.status}
              render={({ field }) => (
                <Select.Root
                  value={field.value!} // Bind the value from react-hook-form
                  onValueChange={(value) => field.onChange(value)} // Use onValueChange for updates
                >
                  <Select.Trigger
                    placeholder="Update status of issue"
                    style={{ width: "140px" }}
                  />
                  <Select.Content>
                    {Object.entries(Status).map(([key, label]) => (
                      <Select.Item key={key} value={key}>
                        {label}
                      </Select.Item>
                    ))}
                  </Select.Content>
                </Select.Root>
              )}
            />
          </Box>
        )}

        {/* Submit Button */}
        <Button type="submit" disabled={isLoading || !isDirty}>
          {issue ? "Update This Issue" : "Submit New Issue"}{" "}
          {isLoading && <Spinner />}
        </Button>
      </form>
      <Toaster />
    </Box>
  );
};

function useCreateIssue() {
  const router = useRouter();

  return useMutation<string, AxiosError<{ error: string }>, CreateIssueSchema>({
    mutationFn: async (data) => {
      const res = await axios.post("/api/issues", data);
      return res.data; // Return only the response data
    },
    onSuccess: () => {
      toast.success("Issue created successfully!"); // Add success feedback
      router.push("/issues"); // Navigate to the issues page
      router.refresh(); // Refresh the data
    },
    onError: (err) => {
      const errorMessage =
        err.response?.data?.error || "An unexpected error occurred.";
      toast.error(errorMessage); // Show error message
    },
  });
}

function useUpdateIssue() {
  const router = useRouter();

  return useMutation<string, AxiosError<{ error: string }>, UpdateIssueSchema>({
    mutationFn: async (data) => {
      const res = await axios.patch("/api/issues", data);
      return res.data; // Return only the response data
    },
    onSuccess: () => {
      toast.success("Issue created successfully!"); // Add success feedback
      router.push("/issues"); // Navigate to the issues page
      router.refresh(); // Refresh the data
    },
    onError: (err) => {
      const errorMessage =
        err.response?.data?.error || "An unexpected error occurred.";
      toast.error(errorMessage); // Show error message
    },
  });
}

export default IssueForm;
