"use client";
import Button from "@/components/Button";
import ImageNext from "@/components/Image";
import Input from "@/components/Input";
import Text from "@/components/Text";
import { FormLoginValues, ResLogin } from "@/interface/login.interface";
import { useSignIn } from "@/services/auth/useAuth";
import { message } from "antd";
import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { Controller, SubmitHandler, useForm } from "react-hook-form";

// Author, Software Architect, Software Engineer, Software Developer : https://www.linkedin.com/in/wahyu-fatur-rizky

export default function Home() {
  const [messageApi, contextHolder] = message.useMessage();
  const router = useRouter();

  const { control, handleSubmit } = useForm<FormLoginValues>({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const { mutate: loginUser, isPending: isPendingLogin } = useSignIn({
    options: {
      onSuccess: (res: ResLogin) => {
        if (res.status === 200) {
          messageApi.open({
            type: "success",
            content: "Success login",
          });

          localStorage.setItem("access_token", res.data.data.access_token);
          localStorage.setItem("user_profile", JSON.stringify(res.data.data));

          localStorage.setItem("currentMenu", "1");
          localStorage.setItem("openKeys", "[]");

          router.push("/dashboard");
        }
      },
      onError: () => {},
    },
  });

  const onSubmit: SubmitHandler<FormLoginValues> = (data) => {
    loginUser(data);
  };

  useEffect(() => {
    const handleCheckIsLogin = () => {
      const access_token = localStorage.getItem("access_token");

      if (access_token) {
        router.push("/dashboard");
      }
    };

    handleCheckIsLogin();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section>
      <div className="flex min-h-full flex-1 flex-col justify-start px-6 py-12 lg:px-8 bg-img-login bg-center h-lvh overflow-auto">
        {contextHolder}
        <div className="sm:mx-auto sm:w-full sm:max-w-sm">
          <ImageNext
            src="/logo-klikyou.svg"
            width={406}
            height={139}
            priority
            alt="logo-klikyou"
            className="mx-auto h-auto w-[270px]"
          />

          <Text label="👋 Welcome" className="mt-10 text-center text-xl font-normal text-white" />
        </div>

        <div className="mt-10 sm:mx-auto sm:w-full sm:max-w-sm bg-white rounded-md p-6">
          <div className="space-y-6">
            <Text label="Login" className="text-xl font-bold text-black" />

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
                  placeholder="Enter email"
                  classNameInput="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-blue sm:text-sm sm:leading-6"
                  classNameLabel="block text-sm font-bold leading-6 text-black"
                  label="Email address"
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
                  required
                  placeholder="Enter password"
                  classNameInput="block w-full rounded-md border-0 p-1.5 text-gray-900 shadow-sm ring-1 ring-inset ring-gray-300 placeholder:text-gray-400 focus:ring-2 focus:ring-inset focus:ring-primary-blue sm:text-sm sm:leading-6"
                  classNameLabel="block text-sm font-bold leading-6 text-black"
                  label="Password"
                />
              )}
            />

            <div>
              <Button
                type="submit"
                onClick={handleSubmit(onSubmit)}
                label="Login"
                disabled={isPendingLogin}
                loading={isPendingLogin}
                className="flex w-full justify-center items-center rounded-md bg-primary-blue px-3 py-1.5 text-sm font-semibold leading-6 text-white shadow-sm hover:bg-primary-blue/90 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-indigo-600"
              />
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
