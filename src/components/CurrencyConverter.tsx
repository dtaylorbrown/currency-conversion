"use client";

import { useActionState } from "react";

import { convertCurrency } from "@/actions/convert";
import usePreviousConversions from "@/hooks/usePreviousConversions";
import PreviousConversions from "./PreviousConversions";

import type { ConvertState } from "@/actions/convert";
import type { Currency } from "@/lib/currency";

const initialState: ConvertState = {};

const CurrencyConverter = ({ currencies }: { currencies: Currency[] }) => {
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

  const isSubmitDisabled = isPending || !currencies.length;

  return (
    <div>
      <div>
        <p>
          Pick a pair, check the number, and pick up where you left off from
          your recent conversions.
        </p>
        <form action={formAction}>
          <select name="from" required>
            <option value="">Select currency</option>
            {currencies.map((currency) => (
              <option key={currency.short_code} value={currency.short_code}>
                {currency.name} ({currency.short_code})
              </option>
            ))}
          </select>
          <select name="to">
            <option value="">Select currency</option>
            {currencies.map((currency) => (
              <option key={currency.short_code} value={currency.short_code}>
                {currency.name} ({currency.short_code})
              </option>
            ))}
          </select>
          <input type="number" name="amount" placeholder="Amount" required />
          <button type="submit" disabled={isSubmitDisabled}>
            {isPending ? "Converting..." : "Convert"}
          </button>
        </form>

        {state.result && (
          <div>
            <p>
              {state.result.amount} {state.result.from} ={" "}
              {state.result.converted_amount} {state.result.to}
            </p>
          </div>
        )}

        {state.error && (
          <div>
            <p>Error: {state.error}</p>
          </div>
        )}
      </div>
      <PreviousConversions conversions={prevConversions} />
    </div>
  );
};

export default CurrencyConverter;
