import { SelectInterface } from "@/interface/Select";
import { Select as AntSelect, ConfigProvider } from "antd";
import Text from "./Text";

const Select = ({
  label,
  name,
  required,
  classNameLabel,
  onChange,
  value,
  error,
  mode,
  options,
  styleSelect,
  tokenSeparators,
  filterOption,
  onSearch,
  onBlur,
  notFoundContent,
  onFocus,
}: SelectInterface) => {
  return (
    <div className="relative">
      {label && (
        <label htmlFor={name} className={classNameLabel}>
          {label}
          <span className="text-red">{required ? "*" : ""}</span>
        </label>
      )}

      <div className={label ? "mt-2" : "mt-0"}>
        <ConfigProvider
          theme={{
            components: {
              Select: {},
            },
          }}
        >
          <AntSelect
            mode={mode}
            style={styleSelect}
            onChange={onChange}
            onSearch={onSearch}
            onBlur={onBlur}
            onFocus={onFocus}
            notFoundContent={notFoundContent}
            filterOption={filterOption}
            tokenSeparators={tokenSeparators}
            options={options}
            value={value}
          />
        </ConfigProvider>
      </div>
      {error && (
        <Text className="text-[#EB5757] font-roboto mt-2 font-bold text-sm" label={error.message} />
      )}
    </div>
  );
};

export default Select;
