import { useState, useRef, useEffect } from "react";
import "./styles.scss";

import { ReactComponent as DropdownIcon } from "../../../assets/images/svg/Dropdown.svg";

interface Option {
  label: string;
  value: string;
}

interface SelectItemProps {
  label: string;
  keyValue: string;
  options: Option[];
  value: string | string[];
  onChange: (val: string | string[]) => void;
  multiple?: boolean;
}

const SelectItem: React.FC<SelectItemProps> = ({
  label,
  options,
  value,
  onChange,
  multiple = false,
}) => {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  const toggleOption = (val: string) => {
    if (multiple) {
      const selected = Array.isArray(value) ? [...value] : [];
      if (selected.includes(val)) {
        onChange(selected.filter((v) => v !== val));
      } else {
        onChange([...selected, val]);
      }
    } else {
      onChange(val);
      setOpen(false);
    }
  };

  const isSelected = (val: string) =>
    multiple ? Array.isArray(value) && value.includes(val) : value === val;

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const displayValue = multiple
    ? Array.isArray(value) && value.length > 0
      ? options
          .filter((o) => value.includes(o.value))
          .map((o) => o.label)
          .join(", ")
      : "Select..."
    : options.find((o) => o.value === value)?.label || "Select...";

  return (
    <div className="select-item" ref={ref}>
      <label className="select-item__label">{label}</label>
      <div className="select-item__wrapper">
        <div className="select-item__control" onClick={() => setOpen(!open)}>
          <span>{displayValue}</span>
          <DropdownIcon width={16} height={16} />
        </div>

        {open && (
          <div className="select-item__dropdown">
            {options.map((opt) => (
              <div
                key={opt.value}
                className={`select-item__option ${
                  isSelected(opt.value) ? "selected" : ""
                }`}
                onClick={() => toggleOption(opt.value)}
              >
                {multiple && (
                  <span
                    className={`custom-checkbox ${
                      isSelected(opt.value) ? "checked" : ""
                    }`}
                  >
                    {isSelected(opt.value) && (
                      <svg
                        width="20"
                        height="20"
                        viewBox="0 0 20 20"
                        fill="none"
                        xmlns="http://www.w3.org/2000/svg"
                      >
                        <path
                          d="M16.875 5.62537L8.125 14.375L3.75 10.0004"
                          stroke="rgba(0, 0, 0, 0.8)"
                          stroke-width="1.5"
                          stroke-linecap="round"
                          stroke-linejoin="round"
                        />
                      </svg>
                    )}
                  </span>
                )}
                <span>{opt.label}</span>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default SelectItem;
