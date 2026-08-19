"use client";

import { useState } from "react";
import { useRegister } from "@/hooks/useRegister";

export default function InputForm() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { mutate, isPending, isSuccess, error } = useRegister();

  function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    mutate({ fullName, email, password });
  }

  return (
    <div className="flex flex-col gap-6">
      <form className="space-y-4" onSubmit={handleSubmit}>
        <TextField
          title="Full Name"
          type="text"
          exampleInput="e.g. Jane Doe"
          value={fullName}
          onChange={setFullName}
        />
        <TextField
          title="Email Address"
          type="text"
          exampleInput="name@example.com"
          value={email}
          onChange={setEmail}
        />
        <TextField
          title="Password"
          type="password"
          exampleInput="********"
          value={password}
          onChange={setPassword}
        />
        <TextField
          title="Confirm Password"
          type="password"
          exampleInput="********"
          value={confirmPassword}
          onChange={setConfirmPassword}
        />

        {error && <p className="text-sm text-red-600">{error.message}</p>}
        {isSuccess && (
          <p className="text-sm text-green-600">
            Akun berhasil dibuat, silahkan login.
          </p>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="w-full h-11 rounded-lg mt-2 bg-blue-600 text-white font-semibold hover:bg-blue-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isPending ? "Creating..." : "Create Account"}
        </button>
      </form>

      <div className="flex gap-2 items-center">
        <div className="h-[1px] flex-1 bg-slate-200" />
        <span className="text-xs font-semibold text-slate-500">OR</span>
        <div className="h-[1px] flex-1 bg-slate-200" />
      </div>

      <div className="flex gap-2 justify-center items-center border border-slate-300 rounded-lg h-11 text-slate-700 font-medium hover:bg-slate-50 transition cursor-pointer">
        <svg className="h-5 w-5" viewBox="0 0 24 24">
          <path
            fill="#4285F4"
            d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
          />
          <path
            fill="#34A853"
            d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
          />
          <path
            fill="#FBBC05"
            d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.06H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.94l2.85-2.22.81-.63z"
          />
          <path
            fill="#EA4335"
            d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.06l3.66 2.84c.87-2.6 3.3-4.52 6.16-4.52z"
          />
        </svg>
        <span>Sign up with Google</span>
      </div>
    </div>
  );
}

export function TextField({
  title,
  type,
  exampleInput,
  value,
  onChange,
}: TextFieldProps) {
  return (
    <div className="flex flex-col gap-1">
      <label htmlFor={title} className="text-sm font-medium text-slate-700">
        {title}
      </label>
      <input
        id={title}
        type={type}
        placeholder={exampleInput}
        className="h-11 w-full rounded-lg border border-slate-300 bg-white px-3 text-sm text-slate-900 placeholder:text-slate-400 focus:outline-none focus:border-blue-600 focus:ring-2 focus:ring-blue-600/20 transition"
        value={value}
        onChange={(e) => onChange(e.target.value)}
      />
    </div>
  );
}

interface TextFieldProps {
  title: string;
  type: string;
  exampleInput: string;
  value: string;
  onChange: (value: string) => void;
}
