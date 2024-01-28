"use client";
import { CardComponent } from "@/components/CardComponent";
import ImageNext from "@/components/Image";
import Text from "@/components/Text";
import { useProfile, useUpdateProfile } from "@/services/profile/useProfile";
import { useRouter } from "next/navigation";
import { Dispatch, SetStateAction, useEffect, useState } from "react";
import {
  Control,
  SubmitHandler,
  UseFormGetValues,
  UseFormHandleSubmit,
  UseFormWatch,
  useForm,
} from "react-hook-form";

export interface DTOProfile {
  name: string;
  gender: string;
  birthday: string;
  horoscope: string;
  zodiac: string;
  height: number;
  weight: number;
  interests: string[];
}

export interface OptionInterface {
  label: string;
  value: string;
}

export interface CardComponentInterface {
  title: string;
  watch?: UseFormWatch<{
    name: string;
    birthday: string;
    horosc: string;
    zodiac: string;
    gender: string;
    height: number;
    weight: number;
    interests: never[];
  }>;
  handleSubmit?: UseFormHandleSubmit<
    { name: string; birthday: string; height: number; weight: number; interests: never[] },
    undefined
  >;
  onSubmitAbout?:
    | SubmitHandler<{
        name: string;
        birthday: string;
        height: number;
        weight: number;
        interests: never[];
      }>
    | SubmitHandler<{
        name: string;
        birthday: string;
        height: number;
        weight: number;
        interests: never[];
      }>
    | undefined
    | any;
  control: Control<
    {
      name: string;
      birthday: string;
      horosc: string;
      zodiac: string;
      gender: string;
      height: number;
      weight: number;
      interests: never[];
    },
    any
  >;
  desc: string;
  handleChangeImageBase64: (e: any, type: string) => void;
  isEditAbout?: boolean;
  isEditInterest?: boolean;
  setIsEditAbout?: Dispatch<SetStateAction<boolean>>;
  setIsEditInterest?: Dispatch<SetStateAction<boolean>>;
  onClick: () => void;
  fieldsAbout?:
    | fieldsAboutOjbInterface[]
    | (
        | { label: string; name: string; type: string; placeholder: string; option?: undefined }
        | {
            label: string;
            option: OptionInterface[];
            name: string;
            type: string;
            placeholder: string;
          }
      )[]
    | undefined;
  getValues?: UseFormGetValues<{
    name: string;
    birthday: string;
    horosc: string;
    zodiac: string;
    gender: string;
    height: number;
    weight: number;
    interests: never[];
  }>;
}

export interface fieldsAboutOjbInterface {
  label: string;
  option?: OptionInterface[];
  name: string;
  type: string;
  placeholder: string;
}

export interface FieldsAboutInterface {
  control: Control<
    {
      name: string;
      birthday: string;
      horosc: string;
      zodiac: string;
      gender: string;
      height: number;
      weight: number;
      interests: never[];
    },
    any
  >;
  fieldsAbout:
    | fieldsAboutOjbInterface[]
    | (
        | { label: string; name: string; type: string; placeholder: string; option?: undefined }
        | {
            label: string;
            option: OptionInterface[];
            name: string;
            type: string;
            placeholder: string;
          }
      )[]
    | undefined;
}

export default function ProfilePage() {
  const [isEditAbout, setIsEditAbout] = useState(false);
  const [isEditInterest, setIsEditInterest] = useState(false);

  const router = useRouter();

  const fieldsAbout = [
    {
      label: "Display name:",
      name: "name",
      type: "text",
      placeholder: "Enter name",
    },
    {
      label: "Gender:",
      option: [
        {
          label: "Male",
          value: "male",
        },
        {
          label: "Female",
          value: "female",
        },
      ],
      name: "gender",
      type: "select",
      placeholder: "Select gender",
    },
    {
      label: "Birthday:",
      name: "birthday",
      type: "date",
      placeholder: "DD MM YYYY",
    },
    {
      label: "Horoscope:",
      name: "horosc",
      type: "text",
      placeholder: "Enter horoscope",
    },
    {
      label: "Zodiac:",
      name: "zodiac",
      type: "text",
      placeholder: "Enter zodiac",
    },
    {
      label: "Height:",
      name: "height",
      type: "number",
      placeholder: "Enter height",
    },
    {
      label: "Weight:",
      name: "weight",
      type: "number",
      placeholder: "Enter weight",
    },
  ];

  const { control, handleSubmit, setValue, getValues, reset, watch } = useForm({
    defaultValues: {
      name: "",
      birthday: "",
      horosc: "",
      zodiac: "",
      gender: "Male",
      height: 0,
      weight: 0,
      interests: [],
    },
  });

  const { mutate: updateUser, isPending: isPendingUpdate } = useUpdateProfile({
    options: {
      onSuccess: () => {
        setIsEditAbout(false);
        refetchProfile();
      },
    },
  });

  const onSubmitAbout = (data: any) => {
    updateUser({
      ...data,
      height: Number(data.height),
      weight: Number(data.weight),
      interests: localStorage.getItem("interest")
        ? JSON.parse(localStorage.getItem("interest") as string)
        : [],
    });
  };

  const { data: dataProfile, isPending: isPendingProfile, refetch: refetchProfile } = useProfile();

  useEffect(() => {
    const handlePopulateData = () => {
      setValue("name", dataProfile?.data?.data?.name);
      setValue("birthday", dataProfile?.data?.data?.birthday);
      setValue("horosc", dataProfile?.data?.data?.horoscope);
      setValue("zodiac", dataProfile?.data?.data?.zodiac);
      setValue("gender", "Male");
      setValue("height", dataProfile?.data?.data?.height);
      setValue("weight", dataProfile?.data?.data?.weight);
      setValue("interests", dataProfile?.data?.data?.interests);

      localStorage.setItem("interest", JSON.stringify(dataProfile?.data?.data?.interests || []));
    };

    handlePopulateData();
  }, [dataProfile]);

  const handleChangeImageBase64 = (e: any, type: string) => {
    let url = e.target.value;
    let ext = url.substring(url.lastIndexOf(".") + 1).toLowerCase();

    if (
      e.target.files &&
      e.target.files[0] &&
      (ext == "gif" || ext == "png" || ext == "jpeg" || ext == "jpg")
    ) {
      let reader = new FileReader();

      reader.onload = function (e) {
        switch (type) {
          case "banner":
            localStorage.setItem("banner", reader.result as any);
            break;
          case "avatar":
            localStorage.setItem("avatar", reader.result as any);
            break;
          default:
            break;
        }

        window.location.reload();
      };

      reader.readAsDataURL(e.target.files[0]);
    }
  };

  useEffect(() => {
    const handleCheckIsLogin = () => {
      const access_token = localStorage.getItem("access_token");

      if (!access_token) {
        router.push("/");
      }
    };

    handleCheckIsLogin();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    const handleInterest = () => {
      const parseInterest = localStorage.getItem("interest")
        ? JSON.parse(localStorage.getItem("interest") as string)
        : [];

      if (parseInterest) {
        setValue("interests", parseInterest);
      }
    };

    handleInterest();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  return (
    <section>
      <div className="flex min-h-full flex-1 flex-col justify-center lg:px-8">
        <div className="sm:mx-auto sm:w-full sm:max-w-sm h-dvh bg-[#09141A] px-5 overflow-auto">
          {isPendingProfile || isPendingUpdate ? (
            <Text
              label="Loading..."
              className="font-bold not-italic text-2xl text-white text-center mt-6"
            />
          ) : (
            <div>
              <div className="p-2 flex items-center justify-between">
                <div
                  onClick={() => {
                    const confirm = window.confirm("Are you want to log out ?");
                    if (confirm) {
                      localStorage.removeItem("access_token");
                      router.push("/");
                    }
                  }}
                  className="flex items-center gap-2 cursor-pointer"
                >
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

                <Text
                  label={`@${dataProfile?.data?.data?.username}`}
                  className="font-bold not-italic text-sm text-white"
                />

                <ImageNext
                  src={"/setting.svg"}
                  alt="setting"
                  className="cursor-pointer w-auto"
                  width={20}
                  height={20}
                />
              </div>

              <div className="p-x-0 py-6">
                {/* Card Start */}
                <div className="relative bg-[#162329] rounded-md h-[190px] w-full">
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={(localStorage.getItem("banner") as string) || "/sample_banner.jpeg"}
                    alt="setting"
                    className=" h-[190px] w-full rounded-md bg-cover object-cover object-center bg-center bg-no-repeat"
                  />

                  <label className="cursor-pointer absolute top-2 right-2">
                    <ImageNext
                      src="/pencil.svg"
                      className="shadow-2xl drop-shadow-xl"
                      alt="pencil"
                      width={20}
                      height={20}
                    />

                    <input
                      onChange={(e: any) => handleChangeImageBase64(e, "banner")}
                      id="file-upload"
                      name="file-upload"
                      type="file"
                      className="sr-only"
                    />
                  </label>

                  <Text
                    label={`@${dataProfile?.data?.data?.username}`}
                    className="shadow-2xl drop-shadow-xl font-bold not-italic text-sm text-white absolute bottom-2 left-2"
                  />
                </div>
                {/* Card End */}

                {/* Card Start */}
                <CardComponent
                  onClick={() => setIsEditAbout(true)}
                  title="About"
                  desc="Add in your your to help others know you better"
                  isEditAbout={isEditAbout}
                  setIsEditAbout={setIsEditAbout}
                  handleChangeImageBase64={handleChangeImageBase64}
                  control={control}
                  fieldsAbout={fieldsAbout}
                  onSubmitAbout={onSubmitAbout}
                  handleSubmit={handleSubmit}
                  getValues={getValues}
                  watch={watch}
                />
                {/* Card End */}

                {/* Card Start */}
                <CardComponent
                  onClick={() => router.push("/interest")}
                  title="Interest"
                  desc="Add in your interest to find a better match"
                  isEditInterest={isEditInterest}
                  setIsEditInterest={setIsEditInterest}
                  handleChangeImageBase64={handleChangeImageBase64}
                  control={control}
                  watch={watch}
                />
                {/* Card End */}
              </div>
            </div>
          )}
        </div>
      </div>
    </section>
  );
}
