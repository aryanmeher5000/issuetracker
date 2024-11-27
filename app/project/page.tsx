"use client";
import React from "react";
import useProject from "../store";

const Project = () => {
  const { project, isAdmin } = useProject();
  console.log(project, isAdmin);
  return <div>Project</div>;
};

export default Project;
