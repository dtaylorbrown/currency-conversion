"use client";

import { useState } from "react";

import { convertCurrency } from "@/actions/convert";
import PreviousConversions from "./PreviousConversions";

import type { Currency } from "@/lib/currency";

type currencyFormValues = {
  to: string;
  from: string;
  amount: number;
};

const CurrencyConverter = ({ currencies }: { currencies: Currency[] }) => {
  const [formData, setForm] = useState<currencyFormValues>({
    to: "",
    from: "",
    amount: 0,
  });

  const handleChange = (
    event: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>,
  ) => {
    const { name, value } = event.target;

    setForm((current) => ({
      ...current,
      [name]: value,
    }));
  };

  console.log("form data:", formData);

  return (
    <div>
      <div>
        <p>
          Pick a pair, check the number, and pick up where you left off from
          your recent conversions.
        </p>
        <form
          action={async (formData) => {
            await convertCurrency(formData);
          }}
        >
          <select name="from" value={formData.from} onChange={handleChange}>
            <option value="">Select currency</option>
            {currencies.map((currency) => (
              <option key={currency.short_code} value={currency.short_code}>
                {currency.name} ({currency.short_code})
              </option>
            ))}
          </select>
          <select name="to" value={formData.to} onChange={handleChange}>
            <option value="">Select currency</option>
            {currencies.map((currency) => (
              <option key={currency.short_code} value={currency.short_code}>
                {currency.name} ({currency.short_code})
              </option>
            ))}
          </select>
          <input
            type="number"
            name="amount"
            placeholder="Amount"
            value={formData.amount}
            onChange={handleChange}
          />
          <button type="submit">Convert</button>
        </form>
      </div>
      <PreviousConversions />
    </div>
  );
};

export default CurrencyConverter;
