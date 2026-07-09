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
    <div className="bg-white rounded-2xl shadow-md p-6 border hover:shadow-xl transition">

      <div className="flex justify-between items-center">

        <div>

          <p className="text-slate-500">
            {title}
          </p>

          <h2 className="text-3xl font-bold mt-2">
            {value}
          </h2>

        </div>

        <div
          className={`w-14 h-14 rounded-xl flex items-center justify-center ${colors[color]}`}
        >
          {icon}
        </div>

      </div>

    </div>
  );
}