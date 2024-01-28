import { useState } from "react";
import { InputInterface } from "../interface/Input";
import ImageNext from "./Image";
import Text from "./Text";

const Input = ({
  label,
  name,
  type,
  autoComplete,
  required,
  classNameInput,
  classNameLabel,
  onChange,
  onBlur,
  value,
  placeholder,
  error,
}: InputInterface) => {
  const [showPassword, setShowPassword] = useState(false);

  return (
    <div className="relative">
      {label && (
        <label htmlFor={name} className={classNameLabel}>
          {label}
        </label>
      )}

      <div className={label ? "mt-2" : "mt-0"}>
        <input
          className={classNameInput}
          placeholder={placeholder}
          id={name}
          name={name}
          type={showPassword ? "text" : type}
          autoComplete={autoComplete}
          required={required}
          onChange={onChange}
          onBlur={onBlur}
          value={value}
        />
      </div>
      {error && (
        <Text className="text-[#EB5757] font-roboto mt-2 font-bold text-sm" label={error.message} />
      )}

      {type === "password" && (
        <div
          onClick={() => setShowPassword(!showPassword)}
          className="absolute inset-y-0 right-0 flex items-center mr-3 cursor-pointer"
        >
          <ImageNext
            alt="icon"
            src={showPassword ? "/visibility.png" : "/visibility_off.png"}
            width={24}
            height={24}
          />
        </div>
      )}
    </div>
  );
};

export default Input;
