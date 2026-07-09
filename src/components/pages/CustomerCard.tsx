import { ReactNode } from "react";

interface Props {
  title: string;
  value: string;
  icon: ReactNode;
  color: "blue" | "green" | "red" | "purple";
}

const colors = {
  blue: "bg-blue-100 text-blue-600",
  green: "bg-green-100 text-green-600",
  red: "bg-red-100 text-red-600",
  purple: "bg-purple-100 text-purple-600",
};

export default function CustomerCard({
  title,
  value,
  icon,
  color,
}: Props) {
  return (
    <div className="bg-white rounded-2xl border shadow-sm p-4 md:p-6">
      <div className="flex items-start justify-between gap-3">
        <div className="min-w-0 flex-1">
          <p className="text-xs md:text-base text-slate-500">
            {title}
          </p>

          <h2 className="mt-2 text-xl md:text-3xl font-bold break-words">
            {value}
          </h2>
        </div>

        <div
          className={`w-12 h-12 md:w-14 md:h-14 rounded-xl flex items-center justify-center shrink-0 ${colors[color]}`}
        >
          {icon}
        </div>
      </div>
    </div>
  );
}