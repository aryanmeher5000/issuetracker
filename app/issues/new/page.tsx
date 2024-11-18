"use client";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Callout, Spinner, TextField } from "@radix-ui/themes";
import { Controller, useForm } from "react-hook-form";
import SimpleMde from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";
import { createIssueScehma } from "@/app/validationSchema";
import { z } from "zod";
import axios from "axios";
import { useState } from "react";
import { useRouter } from "next/navigation";

type IssueForm = z.infer<typeof createIssueScehma>;
import { CiCircleInfo } from "react-icons/ci";
import InputErrorMessage from "../../InputErrorMessage";

const CreateNewIssue = () => {
  const {
    register,
    handleSubmit,
    control,
    formState: { errors },
  } = useForm<IssueForm>({
    resolver: zodResolver(createIssueScehma), // Correct schema
  });
  const [err, setErr] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const router = useRouter();
  const onSubmit = async (data: IssueForm) => {
    try {
      setIsSubmitting(true);
      await axios.post("/api/issues", data);
      router.push("/issues");
    } catch (err) {
      console.log(err);
      setIsSubmitting(false);
      setErr("An unexpected error occured!");
    }
  };

  return (
    <div className="max-w-xl  p-4">
      {err && (
        <Callout.Root className="mb-5" color="red">
          <Callout.Icon>
            <CiCircleInfo />
          </Callout.Icon>
          <Callout.Text>{err}</Callout.Text>
        </Callout.Root>
      )}
      <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
        <TextField.Root
          placeholder="Title"
          {...register("title")}
        ></TextField.Root>
        <InputErrorMessage>{errors.title?.message}</InputErrorMessage>

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
        <InputErrorMessage>{errors.description?.message}</InputErrorMessage>

        {/* Submit Button */}
        <Button type="submit" disabled={isSubmitting}>
          Submit New Issue {isSubmitting && <Spinner />}
        </Button>
      </form>
    </div>
  );
};

export default CreateNewIssue;
