interface Props {
  active: string;
  onChange: (value: string) => void;
}

const filters = [
  "All",
  "Due",
  "Paid",
  "Overdue",
  "Recent",
];

export default function CustomerFilters({
  active,
  onChange,
}: Props) {
  return (
    <div className="flex flex-wrap gap-3">

      {filters.map((item) => (
        <button
          key={item}
          onClick={() => onChange(item)}
          className={`px-5 py-2 rounded-full transition font-medium

          ${
            active === item
              ? "bg-emerald-600 text-white shadow-lg"
              : "bg-white border hover:bg-slate-100"
          }`}
        >
          {item}
        </button>
      ))}

    </div>
  );
}