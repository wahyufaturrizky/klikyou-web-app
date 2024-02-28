import { InputTextArea } from "@/interface/InputTextArea";
import Text from "./Text";

// Author, Software Architect, Software Engineer, Software Developer : https://www.linkedin.com/in/wahyu-fatur-rizky

const InputTextArea = ({
  label,
  name,
  autoComplete,
  required,
  classNameInput,
  classNameLabel,
  onChange,
  onBlur,
  value,
  placeholder,
  error,
  prefixIcon,
}: InputTextArea) => {
  return (
    <div className="relative">
      {label && (
        <label htmlFor={name} className={classNameLabel}>
          {label}
          <span className="text-red">{required ? "*" : ""}</span>
        </label>
      )}

      {prefixIcon && (
        <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
          {prefixIcon}
        </div>
      )}

      <div className={label ? "mt-2" : "mt-0"}>
        <textarea
          className={classNameInput}
          placeholder={placeholder}
          id={name}
          name={name}
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
    </div>
  );
};

export default InputTextArea;
