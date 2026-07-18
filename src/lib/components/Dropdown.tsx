import { useState } from "react";
import { FiChevronDown, FiChevronUp } from "react-icons/fi";

interface DropdownProps {
  title: string;
  children: React.ReactNode;
  className?: string;
}

export function Dropdown(props: DropdownProps) {
  const [open, setOpen] = useState(false);

  return (
    <div className={props.className}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between text-sm font-semibold text-(--text-h) cursor-pointer"
      >
        <span>{props.title}</span>
        {open ? <FiChevronUp /> : <FiChevronDown />}
      </button>
      {open && (
        <div className="mt-3">
          {props.children}
        </div>
      )}
    </div>
  );
}