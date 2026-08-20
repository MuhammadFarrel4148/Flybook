import { Plane } from "lucide-react";

export default function Header() {
  return (
    <div className="flex flex-col gap-2">
      <div className="flex items-center gap-2 text-blue-700">
        <Plane size={28} />
        <span className="text-lg font-bold tracking-tight">Flybook</span>
      </div>
      <div className="flex flex-col gap-1">
        <h1 className="text-2xl font-bold text-slate-900">Welcome Back</h1>
        <p className="text-sm text-slate-500">
          Please enter your details to sign in.
        </p>
      </div>
    </div>
  );
}
