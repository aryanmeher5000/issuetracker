"use client";
import { Button, Flex, Heading, Select, TextField } from "@radix-ui/themes";
import UserAvatar from "../components/UserAvatar";
import { ProjectType } from "@prisma/client";
import { Controller, useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { CreateProject, createProjectScehma } from "../validationSchema";
import AddMembers from "./AddMembers";
import { useMutation } from "@tanstack/react-query";
import axios, { AxiosError } from "axios";
import toast, { Toaster } from "react-hot-toast";
import { useRouter } from "next/navigation";

const CreateNewProject = () => {
  const {
    register,
    handleSubmit,
    control,
    setValue,
    watch,
    formState: { isValid },
  } = useForm<CreateProject>({
    resolver: zodResolver(createProjectScehma),
  });
  const watchType = watch("type");

  const { mutate } = useCreateProject();

  return (
    <Flex direction="column" align="center" gap="6" p="4">
      <UserAvatar size="8" />
      <Heading>Create New Project</Heading>
      <form onSubmit={handleSubmit((d) => mutate(d))}>
        <Flex
          direction="column"
          align="center"
          gap="3"
          width={{ initial: "100vw", sm: "40vw" }}
          p="4"
        >
          <TextField.Root
            placeholder="Name of the project"
            style={{ width: "100%" }}
            {...register("name")}
          ></TextField.Root>

          <Controller
            name="type"
            control={control}
            render={({ field }) => (
              <Select.Root
                value={field.value!} // Bind the value from react-hook-form
                onValueChange={(value) => field.onChange(value)}
              >
                <Select.Trigger placeholder="Project Type" />
                <Select.Content>
                  {Object.entries(ProjectType).map(([key, label]) => (
                    <Select.Item key={key} value={key}>
                      {label}
                    </Select.Item>
                  ))}
                </Select.Content>
              </Select.Root>
            )}
          />

          <AddMembers watchType={watchType} setValue={setValue} />

          <Button disabled={!isValid}>Create Project</Button>
        </Flex>
      </form>
      <Toaster />
    </Flex>
  );
};

function useCreateProject() {
  const { push } = useRouter();

  return useMutation<
    { message: string },
    AxiosError<{ message: string }>,
    CreateProject
  >({
    mutationFn: async (data) => {
      const res = await axios.post("/api/project", data);
      return res.data;
    },
    onSuccess: (data) => {
      toast.success(data.message);
      push("/selectproject");
    },
    onError: (err) => {
      toast.error(err.response.data.message || "Error creating project");
    },
  });
}
export default CreateNewProject;
