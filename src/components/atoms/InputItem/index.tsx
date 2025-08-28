import { useState, useEffect, useCallback } from "react";
import { IMaskInput } from "react-imask";
import "./styles.scss";
import {
  formatDateForDisplay,
  formatPhoneNumber,
  parseDateToISO,
} from "../../../utils/helpers";

interface InputItemProps {
  label: string;
  value: string;
  onChange: (value: string) => void;
  type?: string;
  className?: string;
  placeholder?: string;
  keyValue: string;
  pattern?: RegExp;
  validate?: (value: string) => boolean;
  errorMessage?: string;
  mask?: "date" | "phone" | "agreement" | "email" | "composite";
  compositeKeys?: string[];
  onCompositeChange?: (values: { [key: string]: string }) => void;
  data?: any;
}

const InputItem: React.FC<InputItemProps> = ({
  label,
  value,
  onChange,
  mask,
  className = "",
  type = "text",
  placeholder,
  keyValue,
  validate,
  compositeKeys,
  onCompositeChange,
  data,
}) => {
  const [isValid, setIsValid] = useState(true);
  const [displayValue, setDisplayValue] = useState("");
  const [originalValue, setOriginalValue] = useState("");

  const validateValue = useCallback(
    (valueToValidate: string) => {
      let isValid = true;
      switch (mask) {
        case "date":
          if (!valueToValidate) {
            isValid = false;
          } else {
            isValid =
              /^\d{4}-(?:0[1-9]|1[0-2])-(?:0[1-9]|[12]\d|3[01])T(?:[01]\d|2[0-3]):[0-5]\d:[0-5]\d(?:\.\d{3})?Z$/.test(
                valueToValidate
              );
            if (isValid) {
              const date = new Date(valueToValidate);
              isValid =
                !isNaN(date.getTime()) &&
                date.getFullYear() >= 1800 &&
                date.getFullYear() <= 2099;
            }
          }
          break;
        case "agreement":
          isValid = /^\d+\/\d+(?:-\d+)?$/.test(valueToValidate);
          break;
        case "composite":
          const words = valueToValidate
            .split(/\s+/)
            .filter((word) => word.length > 0);
          isValid = words.length >= 1 && words.length <= 2;
          break;
        case "phone":
          isValid = /^\+?[\d\s\-\(\)]{10,20}$/.test(valueToValidate);
          break;
        case "email":
          isValid = /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(valueToValidate);
          break;
        default:
          isValid = !validate || validate(valueToValidate);
      }

      setIsValid(isValid);
      return isValid;
    },
    [mask, validate]
  );

  useEffect(() => {
    if (mask === "date" && value) {
      const formatted = formatDateForDisplay(value);
      setDisplayValue(formatted || "");
      setOriginalValue(formatted || "");
    } else if (mask === "phone" && value) {
      const formatted = formatPhoneNumber(value);
      setDisplayValue(formatted || "");
      setOriginalValue(formatted || "");
    } else if (compositeKeys && compositeKeys.length > 0 && data) {
      const compositeValue = compositeKeys
        .map((key) => {
          const keys = key.split(".");
          return keys.reduce((obj, k) => obj && obj[k], data) || "";
        })
        .filter((val) => val)
        .join(" ");

      if (!displayValue) {
        setDisplayValue(compositeValue);
        setOriginalValue(compositeValue);
      }
    } else {
      setDisplayValue(value || "");
      setOriginalValue(value || "");
    }

    validateValue(value);
  }, [value, mask, data, compositeKeys, displayValue, validateValue]);

  const handleAccept = (newDisplayValue: string) => {
    setDisplayValue(newDisplayValue);

    if (compositeKeys && compositeKeys.length > 0 && onCompositeChange) {
      const parts = newDisplayValue.split(/\s+/).filter((part) => part);
      const updatedValues: { [key: string]: string } = {};
      compositeKeys.forEach((key, index) => {
        updatedValues[key] = parts[index] || "";
      });
      onCompositeChange(updatedValues);
    } else {
      let valueToSend = newDisplayValue;

      if (mask === "date") {
        if (!newDisplayValue) {
          valueToSend = "";
        } else {
          valueToSend = parseDateToISO(newDisplayValue);
        }
      } else if (mask === "phone") {
        valueToSend = newDisplayValue.replace(/[^\d]/g, "");
      }

      if (validateValue(valueToSend)) {
        onChange(valueToSend);
      }
    }
  };

  const handleClick = () => {
    setDisplayValue("");

    if (compositeKeys && compositeKeys.length > 0 && onCompositeChange) {
      const clearedValues: { [key: string]: string } = {};
      compositeKeys.forEach((key) => {
        clearedValues[key] = "";
      });
      onCompositeChange(clearedValues);
    } else {
      onChange("");
    }
  };

  const handleBlur = () => {
    if (displayValue.trim() === "" || displayValue === originalValue) {
      setDisplayValue(originalValue);
      if (mask === "date" && originalValue) {
        onChange(value);
      } else if (
        compositeKeys &&
        compositeKeys.length > 0 &&
        onCompositeChange
      ) {
        const originalParts = originalValue.split(/\s+/).filter((part) => part);
        const restoredValues: { [key: string]: string } = {};
        compositeKeys.forEach((key, index) => {
          restoredValues[key] = originalParts[index] || "";
        });
        onCompositeChange(restoredValues);
      }
    } else if (mask === "date" && displayValue) {
      const isoValue = parseDateToISO(displayValue);
      if (validateValue(isoValue)) {
        onChange(isoValue);
      } else {
        setDisplayValue(originalValue);
        onChange(value);
      }
    } else if (compositeKeys && compositeKeys.length > 0 && onCompositeChange) {
      const parts = displayValue.split(/\s+/).filter((part) => part);
      const updatedValues: { [key: string]: string } = {};
      compositeKeys.forEach((key, index) => {
        updatedValues[key] = parts[index] || "";
      });

      if (parts.length >= compositeKeys.length) {
        onCompositeChange(updatedValues);
      } else {
        setDisplayValue(originalValue);
        const originalParts = originalValue.split(/\s+/).filter((part) => part);
        const restoredValues: { [key: string]: string } = {};
        compositeKeys.forEach((key, index) => {
          restoredValues[key] = originalParts[index] || "";
        });
        onCompositeChange(restoredValues);
      }
    }
  };

  const getMaskConfig = () => {
    if (mask === "composite") return;
    switch (mask) {
      case "date":
        return {
          mask: "00.00.0000",
          definitions: {
            "0": /[0-9]/,
          },
          lazy: false,
        };
      case "agreement":
        return {
          mask: "0000/[0000][-0000]",
          definitions: {
            "0": /[0-9]/,
          },
          overwrite: true,
          autofix: true,
        };
      case "phone":
        return {
          mask: "+0 000 000 0000",
          definitions: {
            "0": /[0-9]/,
          },
          overwrite: true,
          autofix: true,
        };
      default:
        return undefined;
    }
  };

  const maskConfig = getMaskConfig();
  const placeholderValue = placeholder
    ? placeholder
    : mask === "date"
    ? "dd.mm.yyyy"
    : mask === "agreement"
    ? "1234/5678-9012"
    : mask === "phone"
    ? "+1 234 567 8900"
    : mask === "composite"
    ? "Firstname Lastname"
    : "";

  return (
    <div className={`input-field ${className}`}>
      <label className="input-field__label" htmlFor={keyValue}>
        {label}
      </label>
      {maskConfig ? (
        <IMaskInput
          {...maskConfig}
          value={displayValue}
          id={keyValue}
          onAccept={handleAccept}
          onClick={handleClick}
          onBlur={handleBlur}
          placeholder={placeholderValue}
          className={`input-field__input ${
            !isValid ? "input-field__input--error" : ""
          }`}
          unmask={false}
        />
      ) : (
        <input
          id={keyValue}
          type={type}
          value={displayValue}
          onChange={(e) => handleAccept(e.target.value)}
          onClick={handleClick}
          onBlur={handleBlur}
          placeholder={placeholderValue}
          className={`input-field__input ${
            !isValid ? "input-field__input--error" : ""
          }`}
        />
      )}
    </div>
  );
};

export default InputItem;
