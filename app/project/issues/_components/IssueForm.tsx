"use client";
import { createIssueSchema, updateIssueSchema } from "@/app/validationSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Issue, Priority, Status } from "@prisma/client";
import {
  Text,
  Box,
  Button,
  Select,
  Spinner,
  TextField,
  Flex,
} from "@radix-ui/themes";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import "easymde/dist/easymde.min.css";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import { Controller, useForm } from "react-hook-form";
import toast, { Toaster } from "react-hot-toast";
import { z } from "zod";
import { Error } from "../../../components";
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
    if (issue) {
      const updatedFields = {};

      // Iterate over entries and add only the updated fields
      Object.entries(data).forEach(([key, value]) => {
        if (value !== issue[key as keyof FormData]) {
          Object.assign(updatedFields, { [key]: value });
        }
      });

      updIssue.mutate({ data: updatedFields, id: issue.id });
    } else {
      crtIssue.mutate(data as CreateIssueSchema);
    }
  };

  return (
    <Box className="max-w-xl" p="4">
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

        {/*Set deadline optional*/}
        <Flex align="center" gap="2">
          <Text>Deadline:</Text>
          <TextField.Root
            type="date"
            {...register("deadline", { valueAsDate: true })}
          />
        </Flex>
        <Error>{errors.deadline?.message}</Error>

        {/*Update status of issue*/}
        {issue && (
          <Controller
            name="status"
            control={control}
            defaultValue={issue.status}
            render={({ field }) => (
              <Select.Root
                value={field.value!} // Bind the value from react-hook-form
                onValueChange={(value) => field.onChange(value)} // Use onValueChange for update
              >
                <Select.Trigger
                  placeholder="Update status of issue"
                  style={{ width: "140px", marginRight: "4px" }}
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
        )}
        {/*Set priority*/}
        <Controller
          name="priority"
          control={control}
          defaultValue={issue?.priority || undefined}
          render={({ field }) => (
            <Select.Root
              value={field.value!} // Bind the value from react-hook-form
              onValueChange={(value) => field.onChange(value)} // Use onValueChange for updates
            >
              <Select.Trigger
                placeholder="Set priority"
                style={{ width: "140px" }}
              />
              <Select.Content>
                {Object.entries(Priority).map(([key, label]) => (
                  <Select.Item key={key} value={key}>
                    {label}
                  </Select.Item>
                ))}
              </Select.Content>
            </Select.Root>
          )}
        />

        {/* Submit Button */}
        <Box>
          <Button type="submit" disabled={isLoading || !isDirty}>
            {issue ? "Update This Issue" : "Submit New Issue"}{" "}
            {isLoading && <Spinner />}
          </Button>
        </Box>
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
      router.push("/project/issues"); // Navigate to the issues page
      router.refresh(); // Refresh the data
      toast.success("Issue created successfully!"); // Add success feedback
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

  return useMutation<
    { message: string }, // The type of the data returned by the mutation
    AxiosError<{ error: string }>, // The type of the error object
    { data: UpdateIssueSchema; id: number } // The input arguments to the mutation
  >({
    mutationFn: async ({ data, id }) => {
      const res = await axios.patch(`/api/issues/${id}`, data);
      return res.data; // Return only the response data
    },
    onSuccess: () => {
      toast.success("Issue updated successfully!");
      router.push("/project/issues");
      // `router.refresh()` is not available in Next.js router. If you're using Next.js App Router, remove the refresh.
    },
    onError: (error) => {
      const errorMessage =
        error.response?.data?.error || "An unexpected error occurred.";
      toast.error(errorMessage);
    },
  });
}

export default IssueForm;
