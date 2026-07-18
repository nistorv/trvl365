import { Link, useNavigate } from "react-router-dom";
import { Button } from "../Button";
import { RiLogoutBoxRLine, RiPlaneFill } from "react-icons/ri";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import { useAuth } from "../../context/Auth";
import { imageAPI, logoutAPI, userAPI } from "../../api";
import { ProfileIcon } from "../profile/ProfileIcon";

export function Navbar() {
  const auth = useAuth();
  const navigate = useNavigate();
  const [open, setOpen] = useState(false);
  const [username, setUsername] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    async function stageUsername() {
      try {
        const { data } = await axios.get<{
          firstName: string;
          lastName: string;
        }>(userAPI(auth.userId!), {
          headers: { "X-Authorization": auth.token }
        });
        setUsername(`${data.firstName} ${data.lastName}`)
      } catch (err) {
        console.error(err);
      }
    }

    if (!auth.userId || !auth.token) {
      setUsername('');
      return;
    }

    stageUsername();
  }, [auth.userId, auth.token])

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

  async function logout() {
    setOpen(false);
    try {
      await axios.post(logoutAPI, null, {
        headers: { 'X-Authorization': auth.token },
      });
    } catch (err) {
      console.error(err);
    } finally {
      auth.logout();
    }
  }

  const loggedIn = !!(auth.token && auth.userId);

  return (
    <nav className="sticky top-0 z-20 flex items-center justify-between px-[5%] h-16 bg-(--bg) border-b border-(--border)">
      <Link
        to="/"
        className="flex items-center gap-1 text-xl font-bold text-(--text-h) hover:text-(--accent)"
      >
        trvl365
        <RiPlaneFill className="w-5 h-5 rotate-45" />
      </Link>

      {loggedIn ? (
        <div className="relative" ref={dropdownRef}>
          <button
            onClick={() => setOpen((o) => !o)}
            className="flex items-center gap-2 cursor-pointer"
            aria-expanded={open}
          >
            {username && (
              <span className="text-lg font-medium text-(--text-h) mr-0.5">{username}</span>
            )}
            <ProfileIcon img={imageAPI(auth.userId!, 'users')} type="navbar" />
          </button>

          {open && (
            <div className="absolute right-0 mt-1 w-48 border border-(--border) bg-(--bg) shadow-lg overflow-hidden">
              <Link
                to="/blogs/new"
                onClick={() => setOpen(false)}
                className="w-full flex items-center gap-2 px-4 py-3 text-sm text-(--text) hover:bg-(--code-bg)"
              >
                + Create Blog
              </Link>
              <div className="border-t border-(--border)" />
              <Link
                to="/my-blogs"
                onClick={() => setOpen(false)}
                className="w-full flex items-center gap-2 px-4 py-3 text-sm text-(--text) hover:bg-(--code-bg)"
              >
                My Blogs
              </Link>
              <div className="border-t border-(--border)" />
              <Link
                to={`/users/${auth.userId}`}
                onClick={() => setOpen(false)}
                className="w-full flex items-center gap-2 px-4 py-3 text-sm text-(--text) hover:bg-(--code-bg)"
              >
                My Profile
              </Link>
              <div className="border-t border-(--border)" />
              <button
                onClick={logout}
                className="w-full flex items-center gap-2 px-4 py-3 text-sm text-red-500 hover:bg-red-50 dark:hover:bg-red-950 cursor-pointer"
              >
                <RiLogoutBoxRLine className="w-4 h-4" />
                Logout
              </button>
            </div>
          )}
        </div>
      ) : (
        <div className="flex items-center gap-3">
          <Button onClick={() => navigate('/login')}>
            Log in
          </Button>
          <Button buttonStyleType="submit" onClick={() => navigate('/register')}>
            Register
          </Button>
        </div>
      )}
    </nav>
  );
}