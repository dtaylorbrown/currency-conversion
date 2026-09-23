"use client";

import { useMemo, useState } from "react";

import type { Currency } from "@/lib/currency";

import styles from "./CurrencySelect.module.css";

type CurrencySelectProps = {
  id: string;
  name: string;
  currencies: Currency[];
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
};

const formatCurrency = (currency: Currency) =>
  `${currency.name} (${currency.short_code})`;

const CurrencySelect = ({
  id,
  name,
  currencies,
  value,
  onChange,
  placeholder = "Select currency",
}: CurrencySelectProps) => {
  const [isOpen, setIsOpen] = useState(false);
  const [searchValue, setSearchValue] = useState("");

  const selected = currencies.find((currency) => currency.short_code === value);

  const filteredCurrencies = useMemo(() => {
    const search = searchValue.trim().toLowerCase();
    if (!search) return currencies;

    return currencies.filter(
      (currency) =>
        currency.name.toLowerCase().includes(search) ||
        currency.short_code.toLowerCase().includes(search),
    );
  }, [currencies, searchValue]);

  const open = () => {
    setIsOpen(true);
  };

  const close = () => {
    setIsOpen(false);
    setSearchValue("");
  };

  const select = (currency: Currency) => {
    onChange(currency.short_code);
    close();
  };

  return (
    <div className={styles["currency-select"]}>
      <input
        id={id}
        type="text"
        role="combobox"
        aria-expanded={isOpen}
        aria-controls="currency-list"
        placeholder={selected ? formatCurrency(selected) : placeholder}
        value={isOpen ? searchValue : selected ? formatCurrency(selected) : ""}
        onClick={() => !isOpen && open()}
        onBlur={close}
        onChange={(e) => {
          setSearchValue(e.target.value);
          setIsOpen(true);
        }}
      />
      <input type="hidden" name={name} value={value} />

      {isOpen && (
        <ul id="currency-list" role="listbox" className={styles["options"]}>
          {filteredCurrencies.length ? (
            filteredCurrencies.map((currency, index) => (
              <li
                key={currency.short_code}
                id={`currency-list-option-${index}`}
                role="option"
                aria-selected={currency.short_code === value}
                className={styles["option"]}
                onClick={() => select(currency)}
                onMouseDown={(e) => e.preventDefault()}
              >
                {formatCurrency(currency)}
              </li>
            ))
          ) : (
            <li className={styles["no-results"]}>No currencies found</li>
          )}
        </ul>
      )}
    </div>
  );
};

export default CurrencySelect;
