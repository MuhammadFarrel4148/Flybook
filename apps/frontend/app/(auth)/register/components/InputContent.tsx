"use client";

import { useState } from "react";
import { useRegister, useRegisterSso } from "@/hooks/useRegister";
import { TextField } from "@/app/components/TextField";
import { GoogleLogin, CredentialResponse } from "@react-oauth/google";

export default function InputForm() {
  const [fullName, setFullName] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [confirmPassword, setConfirmPassword] = useState("");

  const { mutate, isPending, isSuccess, error } = useRegister();
  const {
    mutate: mutateSso,
    isPending: isPendingSso,
    isSuccess: isSuccessSso,
    error: errorSso,
  } = useRegisterSso();

  function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    mutate({ fullName, email, password });
  }

  function handleSsoSuccess(credentialResponse: CredentialResponse) {
    const token = credentialResponse.credential;

    if (token) {
      mutateSso({ credential: token });
    }
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
        {errorSso && <p className="text-sm text-red-600">{errorSso.message}</p>}
        {isSuccess && (
          <p className="text-sm text-green-600">
            Akun berhasil dibuat, silahkan login.
          </p>
        )}
        {isSuccessSso && (
          <p className="text-sm text-green-600">
            Akun berhasil dibuat, kamu sudah login.
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

      <div className="flex gap-2 justify-center items-center rounded-lg min-h-11">
        <GoogleLogin
          onSuccess={handleSsoSuccess}
          onError={() => console.log("Login gagal")}
        />
        {isPendingSso && (
          <span className="text-sm text-slate-500">Signing up...</span>
        )}
      </div>
    </div>
  );
}
