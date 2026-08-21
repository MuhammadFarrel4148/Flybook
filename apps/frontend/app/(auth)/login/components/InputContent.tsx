"use client";

import { TextField } from "@/app/components/TextField";
import { useLogin, useLoginSso } from "@/hooks/useLogin";
import React, { useState } from "react";
import { GoogleLogin, CredentialResponse } from "@react-oauth/google";

export default function InputContent() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");

  const { mutate, isPending, isSuccess, error } = useLogin();
  const {
    mutate: mutateSso,
    isPending: isPendingSso,
    isSuccess: isSuccessSso,
    error: errorSso,
  } = useLoginSso();

  function handleSubmit(e: React.SubmitEvent<HTMLFormElement>) {
    e.preventDefault();
    mutate({ email, password });
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

        {error && <p className="text-sm text-red-600">{error.message}</p>}
        {errorSso && <p className="text-sm text-red-600">{errorSso.message}</p>}
        {isSuccess && <p className="text-sm text-green-600">Berhasil Login</p>}
        {isSuccessSso && (
          <p className="text-sm text-green-600">Berhasil Login</p>
        )}

        <button
          type="submit"
          disabled={isPending}
          className="w-full h-11 rounded-lg mt-2 bg-blue-600 text-white font-semibold hover:bg-blue-700 transition disabled:opacity-60 disabled:cursor-not-allowed"
        >
          {isPending ? "Loading..." : "Login"}
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
          <span className="text-sm text-slate-500">Signing in...</span>
        )}
      </div>
    </div>
  );
}
