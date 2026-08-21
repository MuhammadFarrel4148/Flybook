import { useMutation } from "@tanstack/react-query";
import { registerUser } from "@/services/authService";
import { registerUserSso } from "@/services/authService";

function useRegister() {
  return useMutation({
    mutationFn: registerUser,
  });
}

function useRegisterSso() {
  return useMutation({
    mutationFn: registerUserSso,
  });
}

export { useRegister, useRegisterSso };
