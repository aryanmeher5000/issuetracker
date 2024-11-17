import Link from "next/link";
import React from "react";
import { IoIosBug } from "react-icons/io";

const NavBar = () => {
  const links = [
    { name: "Dashboard", href: "/" },
    { name: "Issues", href: "/" },
  ];
  return (
    <nav className="flex gap-4 border-b mb-5 px-4 h-14 items-center">
      <Link href="/">
        <IoIosBug className="size-6 text-zinc-800" />
      </Link>
      <ul className="flex gap-4">
        {links.map((k) => (
          <li
            key={k.name}
            className="text-zinc-500 hover:text-zinc-800 transition-colors font-medium"
          >
            <Link href={k.href}>{k.name}</Link>
          </li>
        ))}
      </ul>
    </nav>
  );
};

export default NavBar;
