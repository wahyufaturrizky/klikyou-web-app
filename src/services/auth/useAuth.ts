import { UseMutationResult, useMutation } from "@tanstack/react-query";
import { client } from "../client";
import { FormLoginValues } from "@/interface/login.interface";

function useSignIn({ options }: { options: any }) {
  return useMutation({
    mutationFn: (reqBody) =>
      client("/auth/login", {
        method: "POST",
        data: reqBody,
      }),
    ...options,
  }) as UseMutationResult<FormLoginValues, Error>;
}

function useLogOut({ options }: any) {
  return useMutation({
    mutationFn: (reqBody) =>
      client("/auth/logout", {
        method: "POST",
        data: reqBody,
      }),
    ...options,
  }) as UseMutationResult<{ email: string }, Error>;
}

export { useSignIn, useLogOut };
