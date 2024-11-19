"use client";
import Link from "next/link";
import { usePathname } from "next/navigation";
import React from "react";
import { IoIosBug } from "react-icons/io";
import classNames from "classnames";
import { useSession } from "next-auth/react";

const NavBar = () => {
  const links = [
    { name: "Dashboard", href: "/dashboard" },
    { name: "Issues", href: "/issues" },
  ];
  const currentPath = usePathname();
  const { status } = useSession();
  return (
    <nav className="flex gap-4 border-b mb-5 px-4 h-14 items-center">
      <Link href="/">
        <IoIosBug className="size-6 text-zinc-800" />
      </Link>
      <ul className="flex gap-4">
        {links.map((k) => (
          <li
            key={k.name}
            className={classNames({
              "text-zinc-400": k.href !== currentPath,
              "text-zinc-900": k.href === currentPath,
              "hover:text-zinc-800 transition-colors": true,
            })}
          >
            <Link href={k.href}>{k.name}</Link>
          </li>
        ))}
      </ul>
      <div>{status === "authenticated" && <p>Logout</p>}</div>
    </nav>
  );
};

export default NavBar;
