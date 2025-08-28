import Company from "../assets/images/svg/Company.svg";
import Search from "../assets/images/svg/Deceased.svg";

import { ReactComponent as CompanyIcon } from "../assets/images/svg/Company.svg";
import { ReactComponent as ClientsIcon } from "../assets/images/svg/Account.svg";
import { ReactComponent as ContractorsIcon } from "../assets/images/svg/Contractor.svg";

export const menuItems = [
  {
    id: "companies",
    icon: Company,
    isSidebarOpen: true,
    path: "/companies",
    sidebarPath: "/companies",
  },
  {
    id: "search",
    isSidebarOpen: false,
    icon: Search,
    path: "/search",
    sidebarPath: "/search",
  },
];

export const companiesItems = [
  {
    id: "organizations",
    label: "Organizations",
    icon: CompanyIcon,
    isSidebarOpen: true,
    path: "/companies",
    sidebarPath: "/companies",
  },
  {
    id: "contractors",
    label: "Contractors",
    isSidebarOpen: true,
    icon: ContractorsIcon,
    path: "/contractors",
    sidebarPath: "/companies",
  },
  {
    id: "clients",
    label: "Clients",
    isSidebarOpen: true,
    icon: ClientsIcon,
    path: "/clients",
    sidebarPath: "/companies",
  },
];

export const companyInfoEditItems = [
  { label: "Agreement number:", key: "contract.no" },
  { label: "Date:", key: "contract.issue_date", type: "date" },
  { label: "Business entity:", key: "businessEntity" },
  { label: "Company type:", key: "type", type: "text" },
];

export const companyInfoItems = [
  { label: "Agreement:", keys: ["contract.no", "contract.issue_date"] },
  { label: "Business entity:", keys: ["businessEntity"] },
  { label: "Company type:", keys: ["type"] },
];

export const contactInfoEditItems = [
  { label: "Responsible person:", key: "firstname lastname", type: "text" },
  { label: "Phone number:", key: "phone" },
  { label: "E-mail:", key: "email", type: "email" },
];

export const contactInfoItems = [
  { label: "Responsible person:", keys: ["firstname", "lastname"] },
  { label: "Phone number:", keys: ["phone"] },
  { label: "E-mail:", keys: ["email"] },
];

export const businessEntityOptions = [
  { value: "Sole Proprietorship", label: "Sole Proprietorship" },
  { value: "Partnership", label: "Partnership" },
  { value: "Limited Liability Company", label: "Limited Liability Company" },
];

export const companyTypeOptions = [
  { value: "funeral_home", label: "Funeral Home" },
  { value: "logistics_services", label: "Logistics services" },
  { value: "burial_care_contractor", label: "Burial care Contractor" },
];

export const companyFieldsForm = [
  {
    type: "text" as const,
    label: "Agreement number:",
    key: "contract.no",
    mask: "agreement" as const,
    errorMessage: "Enter format: digits/digits",
  },
  {
    type: "date" as const,
    label: "Date:",
    mask: "date" as const,
    key: "contract.issue_date",
  },
  {
    type: "select" as const,
    label: "Business entity:",
    key: "businessEntity",
    options: businessEntityOptions,
  },
  {
    type: "multiselect" as const,
    label: "Company type:",
    key: "type",
    options: companyTypeOptions,
  },
];

export const clientFieldsForm = [
  {
    type: "composite" as const,
    label: "Responsible person:",
    key: "firstname",
    mask: "composite" as const,
    compositeKeys: ["firstname", "lastname"],
  },
  {
    type: "text" as const,
    label: "Phone number:",
    key: "phone",
    mask: "phone" as const,
    pattern: /^\+?\d{10,}$/,
  },
  {
    type: "text" as const,
    label: "E-mail:",
    placeholder: "test@mail.com",
    key: "email",
  },
];
