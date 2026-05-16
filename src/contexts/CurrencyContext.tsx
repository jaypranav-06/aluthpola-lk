"use client";

import React, { createContext, useContext, useState, useEffect } from "react";

export interface Currency {
  code: string;
  symbol: string;
  name: string;
  rate: number; // Exchange rate relative to USD
}

export const CURRENCIES: Currency[] = [
  { code: "LKR", symbol: "Rs.", name: "Sri Lankan Rupee", rate: 1 },
  { code: "USD", symbol: "$", name: "US Dollar", rate: 0.0031 }, // 1 LKR ≈ 0.0031 USD
  { code: "EUR", symbol: "€", name: "Euro", rate: 0.0029 }, // 1 LKR ≈ 0.0029 EUR
  { code: "GBP", symbol: "£", name: "British Pound", rate: 0.0025 }, // 1 LKR ≈ 0.0025 GBP
  { code: "INR", symbol: "₹", name: "Indian Rupee", rate: 0.26 }, // 1 LKR ≈ 0.26 INR
  { code: "AUD", symbol: "A$", name: "Australian Dollar", rate: 0.0048 }, // 1 LKR ≈ 0.0048 AUD
];

interface CurrencyContextType {
  currency: Currency;
  setCurrency: (currency: Currency) => void;
  convertPrice: (priceInLKR: number) => number;
  formatPrice: (priceInLKR: number) => string;
}

const CurrencyContext = createContext<CurrencyContextType | undefined>(
  undefined
);

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState<Currency>(CURRENCIES[0]); // Default to LKR

  // Load saved currency from localStorage
  useEffect(() => {
    const savedCurrency = localStorage.getItem("selectedCurrency");
    if (savedCurrency) {
      const parsedCurrency = JSON.parse(savedCurrency);
      const foundCurrency = CURRENCIES.find(
        (c) => c.code === parsedCurrency.code
      );
      if (foundCurrency) {
        setCurrencyState(foundCurrency);
      }
    }
  }, []);

  const setCurrency = (newCurrency: Currency) => {
    setCurrencyState(newCurrency);
    localStorage.setItem("selectedCurrency", JSON.stringify(newCurrency));
  };

  const convertPrice = (priceInLKR: number): number => {
    return priceInLKR * currency.rate;
  };

  const formatPrice = (priceInLKR: number): string => {
    const convertedPrice = convertPrice(priceInLKR);
    return `${currency.symbol}${convertedPrice.toLocaleString(undefined, {
      minimumFractionDigits: 2,
      maximumFractionDigits: 2,
    })}`;
  };

  return (
    <CurrencyContext.Provider
      value={{ currency, setCurrency, convertPrice, formatPrice }}
    >
      {children}
    </CurrencyContext.Provider>
  );
}

export function useCurrency() {
  const context = useContext(CurrencyContext);
  if (context === undefined) {
    throw new Error("useCurrency must be used within a CurrencyProvider");
  }
  return context;
}
