import { Plane } from "lucide-react";

export default function Header() {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2 text-blue-700">
        <Plane size={28} />
        <span className="text-lg font-bold tracking-tight">Flybook</span>
      </div>
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-slate-900">
          Create your account
        </h1>
        <p className="text-sm text-slate-500">
          Enter your details below to get started or{" "}
          <a href="#" className="text-blue-700 font-semibold hover:underline">
            sign in
          </a>
          .
        </p>
      </div>
    </div>
  );
}
