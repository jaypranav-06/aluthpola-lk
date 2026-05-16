"use client";

import { useState, useRef, useEffect } from "react";
import { Globe } from "lucide-react";
import { useCurrency, CURRENCIES, Currency } from "@/contexts/CurrencyContext";

export default function CurrencyChanger() {
  const { currency, setCurrency } = useCurrency();
  const [isOpen, setIsOpen] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    function handleClickOutside(event: MouseEvent) {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setIsOpen(false);
      }
    }

    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleCurrencyChange = (newCurrency: Currency) => {
    setCurrency(newCurrency);
    setIsOpen(false);
  };

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="flex items-center gap-2 rounded-lg border border-gray-300 bg-white px-3 py-2 text-sm font-medium text-gray-700 hover:bg-gray-50 transition-colors"
      >
        <Globe className="h-4 w-4" />
        <span className="hidden sm:inline">{currency.code}</span>
        <span className="sm:hidden">{currency.symbol}</span>
      </button>

      {isOpen && (
        <div className="absolute right-0 z-50 mt-2 w-56 origin-top-right rounded-lg border border-gray-200 bg-white shadow-lg">
          <div className="p-2">
            <div className="mb-2 px-2 py-1 text-xs font-semibold text-gray-500 uppercase">
              Select Currency
            </div>
            {CURRENCIES.map((curr) => (
              <button
                key={curr.code}
                onClick={() => handleCurrencyChange(curr)}
                className={`w-full flex items-center justify-between rounded-md px-3 py-2 text-left text-sm transition-colors ${
                  currency.code === curr.code
                    ? "bg-primary/10 text-primary font-medium"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <div>
                  <div className="font-medium">{curr.code}</div>
                  <div className="text-xs text-gray-500">{curr.name}</div>
                </div>
                <span className="text-lg">{curr.symbol}</span>
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
}
