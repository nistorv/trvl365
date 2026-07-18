import { useState } from "react";
import { RiEyeLine, RiEyeOffLine } from "react-icons/ri";

interface PasswordFieldProps {
  value: string;
  setPassword: (v: string) => void;
  error?: string;
}

export function PasswordField(props: PasswordFieldProps) {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="flex flex-col gap-1">
      <div className={`flex border overflow-hidden ${ props.error
        ? 'border-red-500'
        : 'border-(--border)'
      }`}>
        <input
          type={showPassword ? 'text' : 'password'}
          value={props.value}
          onChange={(e) => props.setPassword(e.target.value)}
          className="flex-1 px-3 py-2 bg-(--bg) text-(--text-h) outline-none min-w-0"
        />
        <button
          type="button"
          onClick={() => setShowPassword((state) => !state)}
          className="flex items-center justify-center w-10 shrink-0 bg-(--code-bg) border-l border-(--border) text-(--text) hover:text-(--text-h) hover:bg-(--border) cursor-pointer"
        >
          {showPassword ? <RiEyeLine className="w-4 h-4" /> : <RiEyeOffLine className="w-4 h-4" />}
        </button>
      </div>
      {props.error && <p className="text-xs text-red-500">{props.error}</p>}
    </div>
  );
}