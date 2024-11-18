"use client";
import { createIssueScehma } from "@/app/validationSchema";
import { zodResolver } from "@hookform/resolvers/zod";
import { Button, Heading, TextField } from "@radix-ui/themes";
import { useForm } from "react-hook-form";
import SimpleMde from "react-simplemde-editor";
import "easymde/dist/easymde.min.css";
import { z } from "zod";

type IssueForm = z.infer<typeof createIssueScehma>;

const CreateNewIssue = () => {
  const {} = useForm<IssueForm>({ resolver: zodResolver(createIssueScehma) });
  return (
    <div className="space-y-4 max-w-xl p-4">
      <TextField.Root placeholder="Title"></TextField.Root>
      <SimpleMde></SimpleMde>
      <Button>Submit New Issue</Button>
    </div>
  );
};

export default CreateNewIssue;
