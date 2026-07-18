interface Item {
  id: number;
  name: string;
}

interface CheckboxFieldProps {
  items: Item[];
  selected: number[];
  select: (ids: number[]) => void;
}

export function CheckboxField(props: CheckboxFieldProps) {
  function toggle(id: number) {
    props.select(props.selected.includes(id)
      ? props.selected.filter((c) => c !== id)
      : [...props.selected, id]);
  }

  return (
    <div className="flex flex-wrap gap-x-4 gap-y-2">
      {props.items.map((item) => (
        <label
          key={item.id}
          className="flex items-center gap-2 cursor-pointer"
        >
          <input
            type="checkbox"
            checked={props.selected.includes(item.id)}
            onChange={() => toggle(item.id)}
            className="w-4 h-4 accent-(--accent) cursor-pointer"
          />
          <span className="text-sm text-(--text-h)">{item.name}</span>
        </label>
      ))}
    </div>
  );
}