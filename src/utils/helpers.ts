export const formatDate = (dateString: string): string => {
  return new Date(dateString)
    .toLocaleDateString("ru-RU", {
      day: "2-digit",
      month: "2-digit",
      year: "numeric",
    })
    .replace(/\//g, ".");
};

export const formatType = (type: string): string => {
  return type.replace(/_/g, " ").replace(/\b\w/g, (l) => l.toUpperCase());
};

export const formatPhoneNumber = (phone: string): string => {
  const cleaned = phone.replace(/\D/g, "");

  switch (cleaned.length) {
    case 11: // +1 702 555 2345
      return `+${cleaned[0]} ${cleaned.slice(1, 4)} ${cleaned.slice(
        4,
        7
      )} ${cleaned.slice(7)}`;

    case 10: // (702) 555-2345
      return `(${cleaned.slice(0, 3)}) ${cleaned.slice(3, 6)}-${cleaned.slice(
        6
      )}`;

    case 7: // 555-2345
      return `${cleaned.slice(0, 3)}-${cleaned.slice(3)}`;

    default:
      return phone;
  }
};

export const formatPhoneForDisplay = (phone: string): string => {
  if (!phone) return "";

  const cleaned = phone.replace(/\D/g, "");
  if (cleaned.length === 0) return "";

  let formatted = `+${cleaned[0] || ""}`;

  if (cleaned.length > 1) formatted += ` ${cleaned.slice(1, 4)}`;
  if (cleaned.length > 4) formatted += ` ${cleaned.slice(4, 7)}`;
  if (cleaned.length > 7) formatted += ` ${cleaned.slice(7, 9)}`;
  if (cleaned.length > 9) formatted += ` ${cleaned.slice(9, 11)}`;

  return formatted.trim();
};

export const parsePhoneToRaw = (displayPhone: string): string => {
  return displayPhone.replace(/\D/g, "");
};

export const validatePhone = (phone: string): boolean => {
  const cleaned = phone.replace(/\D/g, "");
  return cleaned.length >= 10 && cleaned.length <= 15;
};

export const validateEmail = (email: string): boolean => {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email);
};

export const validateDate = (dateStr: string): boolean => {
  if (!/^\d{2}\.\d{2}\.\d{4}$/.test(dateStr)) return false;

  const [day, month, year] = dateStr.split(".").map(Number);
  const date = new Date(year, month - 1, day);

  return (
    date.getFullYear() === year &&
    date.getMonth() === month - 1 &&
    date.getDate() === day &&
    year >= 1900 &&
    year <= 2100
  );
};

export const formatDateForDisplay = (isoDate: string): string => {
  if (!isoDate) return "";

  try {
    const date = new Date(isoDate);
    if (isNaN(date.getTime())) return "";

    const day = date.getDate().toString().padStart(2, "0");
    const month = (date.getMonth() + 1).toString().padStart(2, "0");
    const year = date.getFullYear();

    return `${day}.${month}.${year}`;
  } catch {
    return "";
  }
};

export const parseDateToISO = (displayDate: string): string => {
  if (!displayDate) return "";

  try {
    const [day, month, year] = displayDate.split(".").map(Number);

    const date = new Date(Date.UTC(year, month - 1, day));

    if (isNaN(date.getTime())) return "";

    return date.toISOString().replace(".000Z", "Z");
  } catch {
    return "";
  }
};

export function getChangedFields(
  updated: Record<string, any>,
  original: Record<string, any> | null
) {
  const changed: Record<string, any> = {};
  if (!original) return updated; 

  Object.keys(updated).forEach((key) => {
    const originalVal = original[key];
    const updatedVal = updated[key];

    if (key === "contract") {
      if (JSON.stringify(originalVal) !== JSON.stringify(updatedVal)) {
        changed.contract = {
          no: updatedVal?.no || "",
          issue_date: updatedVal?.issue_date || "",
        };
      }
      return;
    }

    if (
      typeof originalVal === "object" &&
      typeof updatedVal === "object" &&
      !Array.isArray(originalVal) &&
      !Array.isArray(updatedVal)
    ) {
      const nestedChanges = getChangedFields(updatedVal, originalVal);
      if (Object.keys(nestedChanges).length > 0) {
        changed[key] = nestedChanges;
      }
    } else if (originalVal !== updatedVal) {
      changed[key] = updatedVal;
    }
  });

  return changed;
}
