import { useMutation } from "@tanstack/react-query";
import { loginUser } from "@/services/authService";

export function useLogin() {
  return useMutation({
    mutationFn: loginUser,
  });
}
