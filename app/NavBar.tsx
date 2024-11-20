"use client";
import {
  Avatar,
  Box,
  Button,
  Container,
  DropdownMenu,
  Flex,
  Skeleton,
} from "@radix-ui/themes";
import classNames from "classnames";
import { useSession } from "next-auth/react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { IoIosBug } from "react-icons/io";

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
  const links = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Issues", href: "/issues" },
    { name: "Assigned to You", href: "/assignedToYou" },
  ];
  const currentPath = usePathname();

  return (
    <Flex gap="6">
      <Link href="/">
        <IoIosBug className="size-6 text-zinc-800" />
      </Link>
      <ul className="flex gap-4">
        {links.map((k) => (
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
        ))}
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
          <Skeleton height="25px" width="70px"></Skeleton>
        )}
      </Box>
      <Box>
        {status === "unauthenticated" && (
          <Button color="blue">
            <Link href="/api/auth/signin">Signup</Link>
          </Button>
        )}
      </Box>
      <Box>
        {status === "authenticated" && (
          <DropdownMenu.Root>
            <DropdownMenu.Trigger>
              <Avatar
                src={session.user!.image!}
                fallback={session.user!.name![0]}
                radius="full"
                className="cursor-pointer"
                referrerPolicy="no-referrer"
              />
            </DropdownMenu.Trigger>
            <DropdownMenu.Content>
              <DropdownMenu.Label>{session.user?.email}</DropdownMenu.Label>
              <DropdownMenu.Item>
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
