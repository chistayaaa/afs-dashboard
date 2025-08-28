import { useState, forwardRef, useImperativeHandle } from "react";
import "./styles.scss";

import { ReactComponent as CheckIcon } from "../../../assets/images/svg/Check.svg";
import { ReactComponent as XIcon } from "../../../assets/images/svg/X.svg";

import SelectItem from "../../atoms/SelectItem/index";
import InputItem from "../../atoms/InputItem";

import { Company, Contact } from "../../../types/types";

interface CompanyEditFormProps<T extends Company | Contact> {
  initialData: T;
  title: string;
  fields: {
    type: "text" | "date" | "select" | "multiselect" | "composite";
    label: string;
    key: string;
    options?: { value: string; label: string }[];
    pattern?: RegExp;
    validate?: (value: string) => boolean;
    errorMessage?: string;
    placeholder?: string;
    mask?: "date" | "phone" | "agreement" | "email" | "composite";
    compositeKeys?: string[];
  }[];
  onSave: (data: T) => void;
  onCancel: () => void;
}
const CompanyEditForm = forwardRef(
  (
    { initialData, title, fields, onSave, onCancel }: CompanyEditFormProps<any>,
    ref
  ) => {
    const [data, setData] = useState(initialData);
    const [loading, setLoading] = useState(false);

    useImperativeHandle(ref, () => ({
      setLoading: (isLoading: boolean) => {
        setLoading(isLoading);
      },
    }));

    const handleInputChange = (
      field: string,
      value: string | string[] | { [key: string]: string }
    ) => {
      setData((prev: Record<string, any>) => {
        const keys = field.split(".");
        if (keys.length > 1) {
          const prevNested = prev[keys[0]] || {};
          if (typeof value === "object" && !Array.isArray(value)) {
            return {
              ...prev,
              [keys[0]]: {
                ...prevNested,
                ...value,
              },
            };
          }
          return {
            ...prev,
            [keys[0]]: {
              ...prevNested,
              [keys[1]]: value,
            },
          };
        }
        return {
          ...prev,
          [field]: value,
        };
      });
    };
    const handleCompositeChange = (updatedValues: {
      [key: string]: string;
    }) => {
      const newData = structuredClone(data);

      Object.entries(updatedValues).forEach(([key, value]) => {
        const keys = key.split(".");

        if (keys.length === 1) {
          newData[key] = value;
        } else {
          let current = newData;
          for (let i = 0; i < keys.length - 1; i++) {
            if (!current[keys[i]]) {
              current[keys[i]] = {};
            }
            current = current[keys[i]];
          }
          current[keys[keys.length - 1]] = value;
        }
      });

      setData(newData);
    };
    const getFieldValue = (key: string) => {
      const keys = key.split(".");
      return (
        keys.reduce((obj, k) => obj && obj[k], data) ||
        (keys.length > 1 ? {} : "")
      );
    };
    const handleSave = (e: React.MouseEvent<HTMLButtonElement>) => {
      e.preventDefault();
      onSave(data);
    };

    return (
      <div className="edit-form">
        <div className="edit-form__header">
          <h5 className="edit-form__title">{title}</h5>
          <div className="edit-form__actions">
            <button className="btn btn__flattened" onClick={handleSave}>
              {loading ? (
                <span className="loader"></span>
              ) : (
                <>
                  <CheckIcon width={16} height={16} /> Save changes
                </>
              )}
            </button>
            <button className="btn btn__flattened" onClick={onCancel}>
              <XIcon width={16} height={16} /> Cancel
            </button>
          </div>
        </div>
        <form>
          {fields.filter(
            (f) => f.key === "contract.no" || f.key === "contract.issue_date"
          ).length > 0 ? (
            <div className="form-row">
              {fields
                .filter(
                  (f) =>
                    f.key === "contract.no" || f.key === "contract.issue_date"
                )
                .map((field) => {
                  const value = getFieldValue(field.key);

                  let extraClass =
                    field.type === "date"
                      ? "label_reduced input_reduced"
                      : "input_reduced";

                  return (
                    <InputItem
                      className={extraClass}
                      key={field.key}
                      keyValue={field.key}
                      label={field.label}
                      value={typeof value === "string" ? value : ""}
                      onChange={(val) => handleInputChange(field.key, val)}
                      type={field.type}
                      placeholder={field?.placeholder}
                      pattern={field.pattern}
                      validate={field.validate}
                      mask={field.mask}
                      errorMessage={field.errorMessage}
                    />
                  );
                })}
            </div>
          ) : null}

          {fields
            .filter(
              (f) => f.key !== "contract.no" && f.key !== "contract.issue_date"
            )
            .map((field) => {
              const value = getFieldValue(field.key);

              if (field.type === "composite" && field.compositeKeys) {
                const compositeValue = field.compositeKeys
                  .map((key) => {
                    const keys = key.split(".");
                    return keys.reduce((obj, k) => obj && obj[k], data) || "";
                  })
                  .filter(Boolean)
                  .join(" ");

                return (
                  <InputItem
                    key={field.key}
                    keyValue={field.key}
                    label={field.label}
                    mask={field.mask}
                    placeholder={field?.placeholder}
                    value={compositeValue}
                    onChange={(val) => console.log(val)}
                    compositeKeys={field.compositeKeys}
                    onCompositeChange={(updatedValues) =>
                      handleCompositeChange(updatedValues)
                    }
                    data={data}
                    type="text"
                  />
                );
              }

              if (field.type === "select") {
                return (
                  <SelectItem
                    keyValue={field.key}
                    label={field.label}
                    value={typeof value === "string" ? value : ""}
                    onChange={(val) =>
                      handleInputChange(field.key, val as string)
                    }
                    options={field.options || []}
                  />
                );
              }
              if (field.type === "multiselect") {
                return (
                  <SelectItem
                    keyValue={field.key}
                    label={field.label}
                    value={Array.isArray(value) ? value : []}
                    onChange={(val) =>
                      handleInputChange(field.key, val as string[])
                    }
                    options={field.options || []}
                    multiple
                  />
                );
              }

              return (
                <InputItem
                  key={field.key}
                  keyValue={field.key}
                  label={field.label}
                  value={typeof value === "string" ? value : ""}
                  onChange={(val) => handleInputChange(field.key, val)}
                  type={field.type}
                  pattern={field.pattern}
                  placeholder={field?.placeholder}
                  validate={field.validate}
                  mask={field.mask}
                  errorMessage={field.errorMessage}
                />
              );
            })}
        </form>
      </div>
    );
  }
);

export default CompanyEditForm;
