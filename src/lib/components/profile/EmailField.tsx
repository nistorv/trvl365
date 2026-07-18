interface EmailFieldProps {
  value: string;
  setEmail: (v: string) => void;
  error?: string;
}

export function EmailField(props: EmailFieldProps) {
  return (
    <div className="flex flex-col gap-1">
      <input
        type="email"
        value={props.value}
        onChange={(e) => props.setEmail(e.target.value)}
        className={`px-3 py-2 border bg-(--bg) text-(--text-h) outline-none ${
          props.error ? 'border-red-500' : 'border-(--border)'
        }`}
      />
      {props.error && <p className="text-xs text-red-500">{props.error}</p>}
    </div>
  );
}