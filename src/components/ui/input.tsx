"use client";

import { InputHTMLAttributes, ReactNode, useState, useEffect, useRef } from "react";
import { FaEye, FaEyeSlash } from "react-icons/fa";
import Image from "next/image";
import { Country, countries } from "@/utils";

interface BaseInputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string;
  error?: string;
  icon?: ReactNode;
  eye?: boolean;
  variant?: "default" | "icon" | "phone";
  required?: boolean;
  color?: "dark" | "light"; // <-- Nova prop
}

interface InputPhoneSpecificProps {
  variant: "phone";
  value?: string;
  className?: string;
  onChange?: (value: string) => void;
  required?: boolean;
  label?: string;
  error?: string;
  color?: "dark" | "light"; // <-- Nova prop
}

interface OtherInputProps extends BaseInputProps {
  variant?: "default" | "icon";
}

type InputProps = InputPhoneSpecificProps | OtherInputProps;

export function Input(props: InputProps) {
  if (props.variant === "phone") return <InputPhone {...props} />;
  return <StandardInput {...props} />;
}

// --------------------
// Standard Input
// --------------------

function StandardInput({
  label,
  error,
  icon,
  eye = false,
  type,
  className = "",
  variant = "default",
  color = "dark", // <-- default
  ...props
}: OtherInputProps) {
  const [showPassword, setShowPassword] = useState(false);
  const isPassword = type === "password" && eye;
  const inputType = isPassword && showPassword ? "text" : type;

  const baseInputClass = `bg-transparent outline-none flex-1 text-sm placeholder-gray-500 ${
    variant === "default" ? "w-full" : ""
  } ${className}`;

  const inputContainerClass = `flex items-center border rounded-lg px-4 py-3 flex-1 transition-all duration-200 focus-within:ring-2 focus-within:border-transparent ${
    color === "dark"
      ? "bg-gray-800 border-gray-600 focus-within:ring-blue-500"
      : "bg-white border-gray-300 focus-within:ring-blue-400"
  } ${error ? "border-red-500" : ""}`;

  const renderInput = () => (
    <div className={inputContainerClass}>
      {icon && <span className="mr-2 text-gray-400 text-lg flex items-center justify-center">{icon}</span>}
      <input className={baseInputClass} type={inputType} {...props} />
      {isPassword && (
        <button
          type="button"
          className="text-gray-400 text-lg ml-2 cursor-pointer flex items-center justify-center"
          onClick={() => setShowPassword((prev) => !prev)}
        >
          {showPassword ? <FaEyeSlash /> : <FaEye />}
        </button>
      )}
    </div>
  );

  if (label)
    return (
      <div className="space-y-2 w-full">
        <label className={`block text-sm font-medium ${color === "dark" ? "text-gray-200" : "text-gray-800"}`}>
          {label}
        </label>
        {renderInput()}
        {error && <p className="text-red-400 text-sm">{error}</p>}
      </div>
    );

  return renderInput();
}

// --------------------
// Phone Input
// --------------------

function InputPhone({
  value = "",
  onChange,
  className = "",
  error,
  label,
  required,
  color = "dark",
  ...props
}: InputPhoneSpecificProps & { error?: string; label?: string }) {
  const findCountryByValue = (val: string) => {
    if (!val || !val.startsWith("+")) return countries[0];
    let best: Country | undefined;
    for (const c of countries) if (val.startsWith(c.code) && (!best || c.code.length > best.code.length)) best = c;
    return best || countries[0];
  };

  const initialCountry = findCountryByValue(value);
  const [country, setCountry] = useState(initialCountry);
  const [number, setNumber] = useState(value ? value.replace(initialCountry.code, "") : "");
  const [focused, setFocused] = useState(false);
  const [dropdown, setDropdown] = useState(false);
  const wrapperRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (value) {
      const match = findCountryByValue(value);
      setCountry(match);
      setNumber(value.replace(match.code, ""));
    } else setNumber("");
  }, [value]);

  useEffect(() => {
    function handleClickOutside(e: MouseEvent) {
      if (!wrapperRef.current) return;
      if (!wrapperRef.current.contains(e.target as Node)) {
        setFocused(false);
        setDropdown(false);
      }
    }
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const emit = (code: string, num: string) => onChange?.(`${code}${num || ""}`);
  const handleNumberChange = (v: string) => {
    const onlyDigits = v.replace(/\D/g, "");
    setNumber(onlyDigits);
    emit(country.code, onlyDigits);
  };
  const handleCountryChange = (c: Country) => {
    setCountry(c);
    emit(c.code, number);
    setDropdown(false);
  };

  const containerClass = `border rounded-lg transition-all duration-200 focus-within:ring-2 focus-within:border-transparent ${
    color === "dark"
      ? "bg-gray-800 border-gray-600 focus-within:ring-blue-500"
      : "bg-white border-gray-300 focus-within:ring-blue-400"
  } ${error ? "border-red-500" : ""} ${className}`;

  if (!focused) {
    const compactInput = (
      <div
        ref={wrapperRef}
        role="button"
        tabIndex={0}
        onClick={() => setFocused(true)}
        onKeyDown={(e) => {
          if (e.key === "Enter" || e.key === " ") setFocused(true);
        }}
        className={`flex items-center px-4 py-3 cursor-pointer ${containerClass}`}
      >
        <Image
          src={`https://flagcdn.com/w20/${country.iso}.png`}
          alt={country.code}
          width={20}
          height={15}
          className="mr-2"
        />
        <span className="text-sm">{value || `${country.code} Phone number`}</span>
      </div>
    );
    if (label)
      return (
        <div className="space-y-2 w-full">
          <label className={`block text-sm font-medium ${color === "dark" ? "text-gray-200" : "text-gray-800"}`}>
            {label}
          </label>
          {compactInput}
          {error && <p className="text-red-400 text-sm">{error}</p>}
        </div>
      );
    return compactInput;
  }

  const expandedInput = (
    <div ref={wrapperRef} className={`flex items-center relative ${containerClass}`}>
      <div
        onClick={() => setDropdown(!dropdown)}
        className={`flex items-center gap-2 px-3 py-3 rounded-l-lg cursor-pointer select-none ${
          color === "dark" ? "bg-gray-700" : "bg-gray-100"
        }`}
      >
        <Image src={`https://flagcdn.com/w20/${country.iso}.png`} alt={country.code} width={20} height={15} />
        <span className="text-sm">{country.code}</span>
      </div>
      {dropdown && (
        <div
          className="absolute top-full left-0 mt-1 max-h-60 w-48 overflow-y-auto border rounded-lg shadow-lg z-50"
          style={{
            backgroundColor: color === "dark" ? "#1f2937" : "#f9fafb",
            borderColor: color === "dark" ? "#4b5563" : "#d1d5db",
          }}
        >
          {countries.map((c) => (
            <div
              key={c.code + c.iso}
              onClick={() => handleCountryChange(c)}
              className="flex items-center gap-2 px-3 py-2 cursor-pointer hover:bg-gray-700 text-sm"
            >
              <Image src={`https://flagcdn.com/w20/${c.iso}.png`} alt={c.code} width={20} height={15} />
              <span>{c.code}</span>
            </div>
          ))}
        </div>
      )}
      <input
        type="tel"
        autoFocus
        value={number}
        onChange={(e) => handleNumberChange(e.target.value)}
        className="flex-1 bg-transparent outline-none text-sm placeholder-gray-500 px-3 py-3"
        placeholder="Phone number"
        required={required}
        {...props}
      />
    </div>
  );

  if (label)
    return (
      <div className="space-y-2 w-full">
        <label className={`block text-sm font-medium ${color === "dark" ? "text-gray-200" : "text-gray-800"}`}>
          {label}
        </label>
        {expandedInput}
        {error && <p className="text-red-400 text-sm">{error}</p>}
      </div>
    );
  return expandedInput;
}