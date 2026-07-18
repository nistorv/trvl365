import { Link } from "react-router-dom";
import { RiArticleLine, RiExternalLinkLine, RiInformationLine, RiPlaneFill, RiUser3Line } from "react-icons/ri";
import { useState, useEffect, useRef } from "react";
import { liveUser } from "../../liveSession";
import { ProfileIcon } from "../profile/ProfileIcon";

export function Navbar() {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  const username = `${liveUser.firstName} ${liveUser.lastName}`;

  useEffect(() => {
    function mouseDropdownHandler(e: MouseEvent) {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target as Node)) {
        setOpen(false);
      }
    }

    if (!open) {
      return;
    }

    document.addEventListener('mousedown', mouseDropdownHandler);
    return () => {
      document.removeEventListener('mousedown', mouseDropdownHandler);
    };
  }, [open])

  return (
    <nav className="sticky top-0 z-20 flex items-center justify-between px-[5%] h-16 bg-(--bg) border-b border-(--border)">
      <Link
        to="/"
        className="flex items-center gap-1 text-xl font-bold text-(--text-h) hover:text-(--accent)"
      >
        trvl365
        <RiPlaneFill className="w-5 h-5 rotate-45" />
      </Link>

      <div className="relative" ref={dropdownRef}>
        <button
          onClick={() => setOpen((o) => !o)}
          className="flex items-center gap-2 cursor-pointer"
          aria-expanded={open}
        >
          <span className="text-lg font-medium text-(--text-h) mr-0.5">{username}</span>
          <ProfileIcon type="navbar" />
        </button>

        {open && (
          <div className="absolute right-0 mt-1 w-48 border border-(--border) bg-(--bg) shadow-lg overflow-hidden">
            <Link
              to="/my-blogs"
              onClick={() => setOpen(false)}
              className="w-full flex items-center gap-2 px-4 py-3 text-sm text-(--text) hover:bg-(--code-bg)"
            >
              <RiArticleLine className="w-4 h-4" />
              My Blogs
            </Link>
            <div className="border-t border-(--border)" />
            <Link
              to="/profile"
              onClick={() => setOpen(false)}
              className="w-full flex items-center gap-2 px-4 py-3 text-sm text-(--text) hover:bg-(--code-bg)"
            >
              <RiUser3Line className="w-4 h-4" />
              My Profile
            </Link>
            <div className="border-t border-(--border)" />
            <Link
              to="/about"
              onClick={() => setOpen(false)}
              className="w-full flex items-center gap-2 px-4 py-3 text-sm text-(--text) hover:bg-(--code-bg)"
            >
              <RiInformationLine className="w-4 h-4" />
              About
            </Link>
            <div className="border-t border-(--border)" />
            <a
              href="https://nistorv.me"
              onClick={() => setOpen(false)}
              className="w-full flex items-center gap-2 px-4 py-3 text-sm text-blue-500 hover:bg-blue-50 dark:hover:bg-blue-950"
            >
              <RiExternalLinkLine className="w-4 h-4" />
              nistorv.me
            </a>
          </div>
        )}
      </div>
    </nav>
  );
}