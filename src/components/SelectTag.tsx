import { SelectTagInterface } from "@/interface/SelectTag";
import Select from "rc-select";
import "rc-select/assets/index.css";
import { useEffect, useState } from "react";
import "./SelectTag.css";
import Text from "./Text";

const SelectTag = ({
  label,
  name,
  type,
  autoComplete,
  required,
  classNameSelect,
  classNameTag,
  onChange,
  onBlur,
  value,
  placeholder,
  error,
  disabled,
  maxTagCount,
}: SelectTagInterface) => {
  const [val, setVal] = useState<string[]>();

  const children: string[] = [];

  const tagRender = (props: any) => {
    const { label, closable, onClose } = props;

    return (
      <span
        style={{
          padding: 8,
          backgroundColor: "rgba(255, 255, 255, 0.10)",
          display: "flex",
          alignItems: "center",
          gap: 4,
          color: "white",
          fontSize: 12,
          fontWeight: 600,
          borderRadius: 4,
          marginRight: 4,
        }}
      >
        {label}
        {closable ? (
          <button type="button" onClick={onClose}>
            x
          </button>
        ) : null}
      </span>
    );
  };

  useEffect(() => {
    setVal(value);
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [value]);

  return (
    <div>
      <Select
        dropdownStyle={{
          backgroundColor: "rgba(217, 217, 217, 0.06)",
          color: "white",
          borderRadius: 10,
          boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
          fontSize: 14,
          border: "none",
        }}
        mode="tags"
        style={{
          width: "100%",
          backgroundColor: "rgba(217, 217, 217, 0.06)",
          borderRadius: 10,
          padding: 12,
          color: "white",
          boxShadow: "0 1px 2px 0 rgb(0 0 0 / 0.05)",
          fontSize: 14,
          marginTop: 14,
        }}
        disabled={disabled}
        maxTagCount={maxTagCount}
        maxTagTextLength={10}
        value={val}
        onChange={(val: string[], option) => {
          setVal(val);
          localStorage.setItem("interest", JSON.stringify(val));
        }}
        onSelect={(val, option) => {}}
        onDeselect={(val, option) => {}}
        tokenSeparators={[","]}
        tagRender={tagRender}
        onBlur={onBlur}
      >
        {children}
      </Select>
      {error && (
        <Text className="text-[#EB5757] font-roboto mt-2 font-bold text-sm" label={error.message} />
      )}
    </div>
  );
};

export default SelectTag;
