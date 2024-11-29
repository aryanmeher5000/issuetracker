"use client";
import { Project } from "@prisma/client";
import {
  Flex,
  Heading,
  Table,
  Text,
  Button,
  Tabs,
  Box,
} from "@radix-ui/themes";
import { useRouter } from "next/navigation";
import UserAvatar from "../components/UserAvatar";
import Cookie from "js-cookie";

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
      <Button onClick={() => push("/createproject")} color="lime">
        Create New Project
      </Button>

      {/* Project Tables */}

      <Tabs.Root defaultValue="personal" className="w-full md:w-7/12 lg:w-5/12">
        <Tabs.List size="2" justify="center" color="amber">
          <Tabs.Trigger value="personal">Personal</Tabs.Trigger>
          <Tabs.Trigger value="group">Group</Tabs.Trigger>
          <Tabs.Trigger value="organization">Organization</Tabs.Trigger>
        </Tabs.List>

        <Box pt="3">
          <Tabs.Content value="personal">
            <RenderTable projects={personalProjects} />
          </Tabs.Content>

          <Tabs.Content value="group">
            <RenderTable projects={groupProjects} />
          </Tabs.Content>

          <Tabs.Content value="organization">
            <RenderTable projects={organizationalProjects} />
          </Tabs.Content>
        </Box>
      </Tabs.Root>
    </Flex>
  );
};

function RenderTable({ projects }: { projects: Project[] }) {
  const { push } = useRouter();
  function handleSelectProject(id: number) {
    Cookie.set("projectId", id);
    push("/project");
  }

  return (
    <Flex direction="column" gap="3" align="center">
      <Table.Root className="w-full">
        <Table.Body>
          {projects?.length > 0 ? (
            projects.map((project) => (
              <Table.Row
                style={{ minWidth: "100%" }}
                key={project.id}
                className="hover:bg-gray-200 cursor-pointer"
                onClick={() => handleSelectProject(project.id)}
              >
                <Table.Cell className="text-center">
                  <Text>{project.name}</Text>
                </Table.Cell>
              </Table.Row>
            ))
          ) : (
            <Table.Row>
              <Table.Cell className="text-center">
                No projects found.
              </Table.Cell>
            </Table.Row>
          )}
        </Table.Body>
      </Table.Root>
    </Flex>
  );
}

export default SelectProject;
