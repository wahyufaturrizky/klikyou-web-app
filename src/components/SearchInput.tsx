import { InputSearchInterface } from "../interface/InputSearch";

const SearchInput = ({
  name,
  type,
  autoComplete,
  required,
  className,
  onChange,
  onBlur,
  value,
  placeholder,
  showIcon,
}: InputSearchInterface) => {
  return (
    <div className="relative">
      {showIcon && (
        <div className="absolute inset-y-0 start-0 flex items-center ps-3 pointer-events-none">
          <svg
            className="w-4 h-4 text-gray-500"
            aria-hidden="true"
            xmlns="http://www.w3.org/2000/svg"
            fill="none"
            viewBox="0 0 20 20"
          >
            <path
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2"
              d="m19 19-4-4m0-7A7 7 0 1 1 1 8a7 7 0 0 1 14 0Z"
            />
          </svg>
        </div>
      )}

      <input
        type={type}
        id={name}
        name={name}
        autoComplete={autoComplete}
        className={className}
        placeholder={placeholder}
        required={required}
        onChange={onChange}
        onBlur={onBlur}
        value={value}
      />
    </div>
  );
};

export default SearchInput;
