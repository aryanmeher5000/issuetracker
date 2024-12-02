import { Button, Flex, Heading, Text } from "@radix-ui/themes";
import { IoIosBug } from "react-icons/io";
import { SiSolus } from "react-icons/si";
import { Metadata } from "next";
import { useRouter } from "next/navigation";

export default function Home() {
  const { push } = useRouter();

  return (
    <Flex direction="column" align="center" gap="6" p="4" width="100%">
      <IoIosBug fontSize="20vh" />

      <Heading size="9" align="center">
        Issue Tracker
      </Heading>

      <Button color="lime" onClick={() => push("/selectproject")}>
        Create or Work on a project
      </Button>

      <Text>
        Our issue tracker is designed to simplify the way you manage and resolve
        issues, whether you’re working on software development, business
        processes, or personal projects. With an intuitive dashboard, you can
        effortlessly track all your tasks, bugs, and issues in one central
        place. The platform offers customizable workflows, allowing you to
        tailor statuses and priorities to fit your specific needs. Collaboration
        is seamless with features like task assignments, comments, and real-time
        notifications to keep everyone on the same page. Built with security and
        reliability in mind, our issue tracker scales effortlessly to
        accommodate teams of any size. Experience a streamlined workflow and
        enhanced productivity today!
      </Text>

      <Flex direction="column" align="center" gap="2">
        <Text weight="bold">Trusted by</Text>
        <SiSolus fontSize="12vh" />
      </Flex>
    </Flex>
  );
}

export const metadata: Metadata = {
  title: "Issue Tracker - Home",
  description:
    "Track the issues in you personal project or team. The most easy and scalable app available out there.",
};
