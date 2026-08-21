import { useMutation } from "@tanstack/react-query";
import { loginUser, loginUserSso } from "@/services/authService";

function useLogin() {
  return useMutation({
    mutationFn: loginUser,
  });
}

function useLoginSso() {
  return useMutation({
    mutationFn: loginUserSso,
  });
}

export { useLogin, useLoginSso };
