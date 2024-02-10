import { InputSelectInterface } from "@/interface/InputSelect";
import Text from "./Text";
import { OptionInterface } from "@/interface/common";

const InputSelect = ({
  name,
  onChange,
  onBlur,
  value,
  error,
  option,
  className,
}: InputSelectInterface) => {
  return (
    <div className="mt-2">
      <select
        onChange={onChange}
        onBlur={onBlur}
        id={name}
        value={value}
        name={name}
        className={className}
      >
        {option?.map((item: OptionInterface, index: number) => {
          const { label, value } = item;

          return (
            <option value={value} key={index}>
              {label}
            </option>
          );
        })}
      </select>
      {error && (
        <Text className="text-[#EB5757] font-roboto mt-2 font-bold text-sm" label={error.message} />
      )}
    </div>
  );
};

export default InputSelect;
