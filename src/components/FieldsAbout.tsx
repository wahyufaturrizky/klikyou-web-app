import { FieldsAboutInterface, fieldsAboutOjbInterface } from "@/app/profile/page";
import Input from "@/components/Input";
import Text from "@/components/Text";
import { Controller } from "react-hook-form";
import InputSelect from "./InputSelect";

export const FieldsAbout = (props: FieldsAboutInterface): any => {
  const { control, fieldsAbout } = props;
  return (
    <div>
      {fieldsAbout?.map((data: fieldsAboutOjbInterface, index: number) => {
        const { label, placeholder, name, type, option } = data;
        return (
          <div key={index} className="mt-6 grid grid-cols-2 items-center gap-4">
            <Text
              label={label}
              className="shadow-2xl drop-shadow-xl font-medium not-italic text-xs text-white/30"
            />

            <Controller
              control={control}
              rules={{
                required: "Name is required",
              }}
              name={name as "name" | "birthday" | "height" | "weight" | "interests"}
              render={({ field: { onChange, onBlur, value }, fieldState: { error } }) => {
                if (type === "select") {
                  return (
                    <InputSelect
                      onChange={onChange}
                      option={option}
                      error={error}
                      onBlur={onBlur}
                      value={value}
                      name={name}
                      required
                      className="block w-full bg-white/20 rounded-md border-0 p-3 text-white shadow-sm placeholder:text-white/40 sm:text-sm"
                    />
                  );
                } else {
                  return (
                    <Input
                      onChange={onChange}
                      error={error}
                      onBlur={onBlur}
                      value={value}
                      name={name}
                      type={type}
                      required
                      classNameInput="block w-full bg-white/20 rounded-md border-0 p-3 text-white shadow-sm placeholder:text-white/40 sm:text-sm"
                      placeholder={placeholder}
                    />
                  );
                }
              }}
            />
          </div>
        );
      })}
    </div>
  );
};
