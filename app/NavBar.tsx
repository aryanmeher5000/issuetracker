"use client";
import {
  Box,
  Button,
  Container,
  DropdownMenu,
  Flex,
  Skeleton,
  Text,
} from "@radix-ui/themes";
import classNames from "classnames";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { IoIosBug } from "react-icons/io";
import UserAvatar from "./components/UserAvatar";
import useProject from "./store";
import NavbarSkeleton from "./NavbarSkeleton";

const NavBar = () => {
  return (
    <nav className="flex gap-4 border-b mb-5 px-4 h-14 items-center">
      <Container>
        <Flex justify="between" align="center" py="20px">
          <RenderLinks />
          <RenderAuth />
        </Flex>
      </Container>
    </nav>
  );
};

const RenderLinks = () => {
  const currentPath = usePathname();
  const { project } = useProject();
  if (!project?.type) return <NavbarSkeleton />;
  const links = [
    {
      name: "Project",
      href: "/project",
      condition: true,
    },
    {
      name: "Dashboard",
      href: "/project/dashboard",
      condition: true,
    },
    {
      name: "Issues",
      href: "/project/issues",
      condition: true,
    },
    {
      name: project?.type === "GROUP" ? "Pledged" : "Delegated",
      href: "/project/delegated",
      condition: project?.type !== "PERSONAL",
    },
  ];

  return (
    <Flex gap="4" className="font-medium">
      <Link href="/">
        <IoIosBug className="size-6 text-zinc-800" />
      </Link>
      <ul className="flex gap-4">
        {links.map(
          (k) =>
            k.condition && (
              <li
                key={k.name}
                className={classNames({
                  "text-zinc-400": k.href !== currentPath,
                  "text-zinc-900 border-b-2 border-b-violet-500":
                    k.href === currentPath,
                  "hover:text-zinc-800 transition-colors": true,
                })}
              >
                <Link href={k.href}>{k.name}</Link>
              </li>
            )
        )}
      </ul>
    </Flex>
  );
};

const RenderAuth = () => {
  const { status, data: session } = useSession();

  return (
    <Box>
      <Box>
        {status === "loading" && (
          <Skeleton height="50px" width="50px"></Skeleton>
        )}
      </Box>
      <Box>
        {status === "unauthenticated" && (
          <Button color="blue">
            <Link href="/api/auth/signin">Signup/Login</Link>
          </Button>
        )}
      </Box>
      <Box>
        {status === "authenticated" && (
          <DropdownMenu.Root>
            <DropdownMenu.Trigger>
              <UserAvatar size="4" />
            </DropdownMenu.Trigger>
            <DropdownMenu.Content>
              <DropdownMenu.Label>
                <Text weight="bold" size="3" color="gray">
                  {session.user?.email}
                </Text>
              </DropdownMenu.Label>
              <DropdownMenu.Item color="red">
                <Link href="/api/auth/signout">Signout</Link>
              </DropdownMenu.Item>
            </DropdownMenu.Content>
          </DropdownMenu.Root>
        )}
      </Box>
    </Box>
  );
};

export default NavBar;
