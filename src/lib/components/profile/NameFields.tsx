interface NameFieldsProps {
  firstName: string;
  lastName: string;
  setFirstName: (v: string) => void;
  setLastName: (v: string) => void;
  errors?: Record<string, string>;
}

export function NameFields(props: NameFieldsProps) {
  return (
    <div className="flex gap-3">
      <div className="flex-1 flex flex-col gap-1">
        <label className="text-sm font-medium text-(--text-h)">First name</label>
        <input
          type="text"
          value={props.firstName}
          onChange={(e) => props.setFirstName(e.target.value)}
          autoComplete="given-name"
          className={`w-full px-3 py-2 border bg-(--bg) text-(--text-h) outline-none ${
            props.errors?.firstName ? 'border-red-500' : 'border-(--border)'
          }`}
        />
        {props.errors?.firstName && <p className="text-xs text-red-500">{props.errors.firstName}</p>}
      </div>
      <div className="flex-1 flex flex-col gap-1">
        <label className="text-sm font-medium text-(--text-h)">Last name</label>
        <input
          type="text"
          value={props.lastName}
          onChange={(e) => props.setLastName(e.target.value)}
          autoComplete="family-name"
          className={`w-full px-3 py-2 border bg-(--bg) text-(--text-h) outline-none ${
            props.errors?.lastName ? 'border-red-500' : 'border-(--border)'
          }`}
        />
        {props.errors?.lastName && <p className="text-xs text-red-500">{props.errors.lastName}</p>}
      </div>
    </div>
  );
}