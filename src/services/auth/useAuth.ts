import { useMutation } from "@tanstack/react-query";
import { client } from "../client";

function useRegister({ options }: any) {
  return useMutation({
    mutationFn: (reqBody: any) =>
      client("/register", {
        method: "POST",
        data: reqBody,
      }),
    ...options,
  }) as any;
}

function useSignIn({ options }: any) {
  return useMutation({
    mutationFn: (reqBody) =>
      client("/auth/login", {
        method: "POST",
        data: reqBody,
      }),
    ...options,
  }) as any;
}

export { useRegister, useSignIn };
