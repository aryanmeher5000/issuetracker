"use client";
import { Box, Button } from "@radix-ui/themes";
import { useRouter } from "next/navigation";
import React from "react";

const IssuesToolbar = () => {
  const router = useRouter();
  return (
    <Box>
      <Button onClick={() => router.push("/project/issues/new")}>
        New Issue
      </Button>
    </Box>
  );
};

export default IssuesToolbar;
