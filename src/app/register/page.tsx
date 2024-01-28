"use client";
import Button from "@/components/Button";
import ImageNext from "@/components/Image";
import Input from "@/components/Input";
import Text from "@/components/Text";
import { Controller, useForm } from "react-hook-form";
import { useRegister } from "@/services/auth/useAuth";
import { useRouter } from "next/navigation";
import { useEffect } from "react";

export default function RegisterPage() {
  const router = useRouter();

  const { control, handleSubmit, reset } = useForm({
    defaultValues: {
      email: "",
      password: "",
      confirm_password: "",
      username: "",
    },
  });

  const { mutate: registerUser, isPending: isPendingRegister } = useRegister({
    options: {
      onSuccess: (res: any) => {
        if (res?.data?.message === "User already exists") {
          alert(res?.data?.message);
        } else if (res?.data?.message === "User has been created successfully") {
          alert(res?.data?.message);
          router.push("/");
        }

        reset();
      },
    },
  });

  const onSubmit = async (data: any) => {
    const { email, password, username } = data;

    registerUser({ email, password, username });
  };

  useEffect(() => {
    const handleCheckIsLogin = () => {
      const access_token = localStorage.getItem("access_token");

      if (access_token) {
        router.push("/profile");
      }
    };

    handleCheckIsLogin();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section>
      <div className="flex min-h-full flex-1 flex-col justify-center lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm h-dvh bg-gradient-radial-base px-5">
          <div className="h-5/6">
            <div className="p-3.5 flex items-center gap-2">
              <ImageNext
                onClick={() => router.push("/")}
                src="/back.svg"
                alt="back"
                width={10}
                height={10}
                className="w-auto"
              />
              <Text label="Back" className="font-bold not-italic text-sm text-white" />
            </div>

            <div className="p-3.5">
              <Text label="Register" className="font-bold not-italic text-2xl text-white" />
            </div>

            <Controller
              control={control}
              rules={{
                required: "Email is required",
                pattern: {
                  value: /^\S+@\S+$/i,
                  message: "Invalid email address",
                },
              }}
              name="email"
              render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                <Input
                  onChange={onChange}
                  error={error}
                  onBlur={onBlur}
                  value={value}
                  name="email"
                  type="email"
                  autoComplete="email"
                  required
                  classNameInput="block w-full bg-white/20 rounded-md border-0 p-3 text-white shadow-sm placeholder:text-white/40 sm:text-sm"
                  placeholder="Enter Email"
                />
              )}
            />

            <Controller
              control={control}
              rules={{
                required: "Username is required",
              }}
              name="username"
              render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                <Input
                  onChange={onChange}
                  error={error}
                  onBlur={onBlur}
                  value={value}
                  name="username"
                  type="text"
                  autoComplete="username"
                  required
                  classNameInput="mt-4 block w-full bg-white/20 rounded-md border-0 p-3 text-white shadow-sm placeholder:text-white/40 sm:text-sm"
                  placeholder="Create Username"
                />
              )}
            />

            <Controller
              control={control}
              rules={{
                required: "Password is required",
              }}
              name="password"
              render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                <Input
                  onChange={onChange}
                  error={error}
                  onBlur={onBlur}
                  value={value}
                  name="password"
                  type="password"
                  autoComplete="password"
                  required
                  classNameInput="mt-4 block w-full bg-white/20 rounded-md border-0 p-3 text-white shadow-sm placeholder:text-white/40 sm:text-sm"
                  placeholder="Create Password"
                />
              )}
            />

            <Controller
              control={control}
              rules={{
                required: "Confirm Password is required",
                validate: (value) =>
                  value === control._formValues.password || "The passwords do not match",
              }}
              name="confirm_password"
              render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => (
                <Input
                  onChange={onChange}
                  error={error}
                  onBlur={onBlur}
                  value={value}
                  name="confirm_password"
                  type="password"
                  autoComplete="confirm_password"
                  required
                  classNameInput="mt-4 block w-full bg-white/20 rounded-md border-0 p-3 text-white shadow-sm placeholder:text-white/40 sm:text-sm"
                  placeholder="Confirm Password"
                />
              )}
            />
          </div>

          <div className="h-1/6 flex flex-col justify-end py-5">
            <Button
              disabled={isPendingRegister}
              label="Register"
              onClick={handleSubmit(onSubmit)}
              type="button"
              className="flex items-center w-full justify-center rounded-md px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm bg-gradient-to-r from-[#62CDCB] to-[#4599DB]"
            />

            <div className="flex items-center justify-center gap-2 mt-6">
              <Text label="Have an account?" className="text-white text-xs font-medium" />
              <Text
                onClick={() => router.push("/")}
                label="Login here"
                className="text-[#94783E] text-xs font-medium cursor-pointer"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
