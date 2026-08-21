import { useMutation } from "@tanstack/react-query";
import { logoutUser } from "@/services/authService";

function useLogout() {
  return useMutation({
    mutationFn: logoutUser,
  });
}

export { useLogout };
