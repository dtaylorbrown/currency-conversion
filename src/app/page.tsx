import CurrencyConverter from "@/components/CurrencyConverter";

import {
  fetchCurrencies,
  Currency,
  commonCurrencyShortCodes,
} from "@/lib/currency";

const preferredCurrencies = commonCurrencyShortCodes.map(
  (currency) => currency.short_code,
);

export default async function Home() {
  const currencies = await fetchCurrencies();

  const sortedCurrencies = currencies.success
    ? [
        ...currencies.data.filter((currency: Currency) =>
          preferredCurrencies.includes(currency.short_code),
        ),
        ...currencies.data.filter(
          (currency: Currency) =>
            !preferredCurrencies.includes(currency.short_code),
        ),
      ]
    : [];

  return (
    <>
      <header>
        <h1>Currency Converter</h1>
      </header>
      <main>
        <CurrencyConverter currencies={sortedCurrencies} />
      </main>
    </>
  );
}
