"use client";

import { startTransition, useActionState, useState } from "react";

import { convertCurrency } from "@/actions/convert";
import usePreviousConversions from "@/hooks/usePreviousConversions";
import PreviousConversions from "./PreviousConversions";

import type { ConvertState } from "@/actions/convert";
import type { Currency } from "@/lib/currency";

import styles from "./CurrencyConverter.module.css";

const initialState: ConvertState = {};

const CurrencyConverter = ({ currencies }: { currencies: Currency[] }) => {
  const [from, setFrom] = useState("");
  const [to, setTo] = useState("");
  const [amount, setAmount] = useState("");
  const { prevConversions, addConversion } = usePreviousConversions();

  const [state, formAction, isPending] = useActionState(
    async (prevState: ConvertState, formData: FormData) => {
      const nextState = await convertCurrency(prevState, formData);

      if (nextState.result) {
        addConversion(nextState.result);
      }

      return nextState;
    },
    initialState,
  );

  const handleSubmit = (e: React.SubmitEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    startTransition(() => formAction(formData));
  };

  const isSubmitDisabled =
    isPending || !currencies.length || Number(amount) === state?.result?.amount;

  return (
    <div className={styles.converter}>
      <div>
        <p className={styles["converter-description"]}>
          Pick a pair, check the number, and pick up where you left off from
          your recent conversions.
        </p>
        <form onSubmit={handleSubmit} className={styles["converter-form"]}>
          <fieldset>
            <label>From:</label>
            <div>
              <select
                name="from"
                value={from}
                onChange={(e) => setFrom(e.target.value)}
              >
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
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
              />
            </div>
          </fieldset>

          <fieldset>
            <label>To:</label>
            <div>
              <select
                name="to"
                value={to}
                onChange={(e) => setTo(e.target.value)}
              >
                <option value="">Select currency</option>
                {currencies.map((currency) => (
                  <option key={currency.short_code} value={currency.short_code}>
                    {currency.name} ({currency.short_code})
                  </option>
                ))}
              </select>
              <input
                type="number"
                name="amount-to"
                disabled
                value={
                  state?.result
                    ? Number(state.result.converted_amount).toFixed(2)
                    : ""
                }
              />
            </div>
          </fieldset>
          <button type="submit" disabled={isSubmitDisabled}>
            {isPending ? "Converting..." : "Convert"}
          </button>
        </form>

        {state.error && (
          <div className={styles["conversion-error"]}>
            <p>Error: {state.error}</p>
          </div>
        )}
      </div>
      <PreviousConversions conversions={prevConversions} />
    </div>
  );
};

export default CurrencyConverter;
