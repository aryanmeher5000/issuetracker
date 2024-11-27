"use client";
import { Project } from "@prisma/client";
import { Flex, Heading, Table, Text, Button, Grid } from "@radix-ui/themes";
import useProject from "../store";
import { useRouter } from "next/navigation";
import UserAvatar from "../components/UserAvatar";
import { useSession } from "next-auth/react";

const SelectProject = ({ projects }: { projects: Project[] }) => {
  // Filter projects based on type
  const personalProjects = projects?.filter((p) => p.type === "PERSONAL");
  const groupProjects = projects?.filter((p) => p.type === "GROUP");
  const organizationalProjects = projects?.filter(
    (p) => p.type === "ORGANIZATION"
  );
  const { push } = useRouter();

  return (
    <Flex justify="center" align="center" direction="column" p="4" gap="6">
      {/* User Avatar */}
      <UserAvatar size="9" />

      {/* Heading and Subtext */}
      <Flex justify="center" align="center" direction="column" gap="1">
        <Heading>Select Project</Heading>
        <Text>Select project you want to work on today</Text>
      </Flex>

      {/* Create New Project Button */}
      <Button onClick={() => push("/createproject")}>Create New Project</Button>

      {/* Project Tables */}
      <Grid
        columns={{ initial: "1", md: "3" }}
        gap="6"
        width={{ initial: "100%", sm: "70%", md: "80%" }}
      >
        {personalProjects.length > 0 && (
          <RenderTable title="Personal" projects={personalProjects} />
        )}
        {groupProjects.length > 0 && (
          <RenderTable title="Group" projects={groupProjects} />
        )}
        {organizationalProjects.length > 0 && (
          <RenderTable
            title="Organizational"
            projects={organizationalProjects}
          />
        )}
      </Grid>
    </Flex>
  );
};

function RenderTable({
  title,
  projects,
}: {
  title: string;
  projects: Project[];
}) {
  const { data } = useSession();
  const { setProjectInfo } = useProject();
  const { push } = useRouter();
  function handleClick(project: Project) {
    setProjectInfo(data?.user?.email, project);
    push("/project");
  }
  return (
    <Flex direction="column" gap="3" align="center">
      <Heading as="h6">{title}</Heading>
      <Table.Root variant="surface" className="w-full">
        <Table.Body>
          {projects.map((project) => (
            <Table.Row
              style={{ minWidth: "100%" }}
              key={project.id}
              className="hover:bg-gray-200 cursor-pointer"
              onClick={() => handleClick(project)}
            >
              <Table.Cell className="text-center">
                <Text>{project.name}</Text>
              </Table.Cell>
            </Table.Row>
          ))}
        </Table.Body>
      </Table.Root>
    </Flex>
  );
}

export default SelectProject;
