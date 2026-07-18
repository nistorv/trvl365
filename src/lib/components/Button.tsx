import type { ButtonHTMLAttributes } from "react";

interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  buttonStyleType?: 'basic' | 'submit' | 'remove';
}

function styleTypeStyling(type: 'basic' | 'submit' | 'remove') {
  if (type === 'submit') {
    return 'bg-(--accent) text-white hover:bg-(--accent-border) disabled:bg-(--accent-bg)';
  }

  if (type === 'remove') {
    return 'border border-(--border) text-(--text) hover:border-red-500 hover:text-red-500';
  }

  return 'border border-(--border) text-(--text) hover:border-(--accent) hover:text-(--accent)';
}

export function Button({
                         buttonStyleType = 'basic',
                         className = '',
                         ...props
}: ButtonProps) {
  return (
    <button
      className={`px-3 py-2 text-sm cursor-pointer ${styleTypeStyling(buttonStyleType)} ${className}`}
      {...props}
    />
  );
}