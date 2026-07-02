"use client";

import { useId } from "react";
import ReactSelect from "react-select";
import WLoader from "@/src/components/shared/WLoader";

export interface SelectOption {
  label: string;
  value: string;
}

interface WSelectProps {
  label?: string;
  error?: string;
  requiredStar?: boolean;
  options: SelectOption[];
  placeholder?: string;
  value?: string | null;
  onChange?: (value: string | null) => void;
  onBlur?: () => void;
  name?: string;
  isClearable?: boolean;
  isSearchable?: boolean;
  isDisabled?: boolean;
  isLoading?: boolean;
  className?: string;
}

function LoadingIndicator() {
  return (
    <div className="flex h-4 w-4 items-center justify-center overflow-hidden px-2">
      <div className="scale-[0.35]">
        <WLoader />
      </div>
    </div>
  );
}

export default function WSelect({
  label,
  error,
  requiredStar,
  options,
  placeholder,
  value,
  onChange,
  onBlur,
  name,
  isClearable = false,
  isSearchable = true,
  isDisabled = false,
  isLoading = false,
  className = "",
}: WSelectProps) {
  const generatedId = useId();
  const selectedOption = options.find((option) => option.value === value) ?? null;

  return (
    <div className={`flex flex-col gap-1 ${className}`}>
      {label && (
        <label htmlFor={generatedId} className="text-sm font-medium text-w-black">
          {label}
          {requiredStar && <span className="ml-0.5 text-red-500">*</span>}
        </label>
      )}
      <ReactSelect<SelectOption, false>
        unstyled
        inputId={generatedId}
        name={name}
        value={selectedOption}
        onChange={(option) => onChange?.(option?.value ?? null)}
        onBlur={onBlur}
        options={options}
        placeholder={placeholder}
        isClearable={isClearable}
        isSearchable={isSearchable}
        isDisabled={isDisabled}
        isLoading={isLoading}
        menuPosition="fixed"
        menuPortalTarget={typeof document !== "undefined" ? document.body : undefined}
        components={{ LoadingIndicator }}
        styles={{ menuPortal: (base) => ({ ...base, zIndex: 9999 }) }}
        classNames={{
          control: (state) =>
            `rounded-md border bg-w-white px-2 py-0.5 transition-colors ${
              state.isFocused ? "border-2 border-w-green" : "border border-w-black/20"
            } ${error ? "!border-w-red" : ""}`,
          placeholder: () => "text-w-black/40",
          singleValue: () => "text-w-black",
          input: () => "text-w-black",
          menu: () => "mt-1 overflow-hidden rounded-md border border-w-black/10 bg-w-white shadow-lg",
          menuList: () => "py-1",
          option: (state) =>
            `cursor-pointer px-3 py-2 text-sm ${
              state.isSelected
                ? "bg-w-green text-w-white"
                : state.isFocused
                  ? "bg-w-green/10 text-w-black"
                  : "text-w-black"
            }`,
          noOptionsMessage: () => "px-3 py-2 text-sm text-w-black/50",
          indicatorSeparator: () => "hidden",
          dropdownIndicator: () => "px-2 text-w-black/50",
          clearIndicator: () => "cursor-pointer px-1 text-w-black/50 hover:text-w-black",
        }}
      />
      {error && <span className="text-sm text-red-500">{error}</span>}
    </div>
  );
}
