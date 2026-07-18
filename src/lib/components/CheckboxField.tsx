interface CheckboxFieldProps {
  items: string[];
  selected: string[];
  select: (items: string[]) => void;
}

export function CheckboxField(props: CheckboxFieldProps) {
  function toggle(item: string) {
    props.select(props.selected.includes(item)
      ? props.selected.filter((c) => c !== item)
      : [...props.selected, item]);
  }

  return (
    <div className="flex flex-wrap gap-x-4 gap-y-2">
      {props.items.map((item) => (
        <label
          key={item}
          className="flex items-center gap-2 cursor-pointer"
        >
          <input
            type="checkbox"
            checked={props.selected.includes(item)}
            onChange={() => toggle(item)}
            className="w-4 h-4 accent-(--accent) cursor-pointer"
          />
          <span className="text-sm text-(--text-h)">{item}</span>
        </label>
      ))}
    </div>
  );
}