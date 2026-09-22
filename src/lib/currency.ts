export type Currency = {
  short_code: string;
  name: string;
};

// Data from top 10 most traded currencies as an example for UI nicety.
// https://www.ig.com/uk/trading-strategies/what-are-the-top-10-most-traded-currencies-in-the-world-200115
export const commonCurrencyShortCodes: Pick<Currency, "short_code">[] = [
  { short_code: "USD" },
  { short_code: "EUR" },
  { short_code: "GBP" },
  { short_code: "JPY" },
  { short_code: "CNY" },
  { short_code: "AUD" },
  { short_code: "AUD" },
  { short_code: "CAD" },
  { short_code: "CHF" },
  { short_code: "HKD" },
  { short_code: "NZD" },
];

export const fetchCurrencies = async () => {
  const response = await fetch("https://api.currencybeacon.com/v1/currencies", {
    headers: {
      Authorization: `Bearer ${process.env.CURRENCY_BEACON_API_KEY}`,
    },
    next: {
      revalidate: 86400, // Revalidate every 24 hours
    },
  });

  const data = await response.json();

  if (!response.ok) {
    throw new Error(`Failed to fetch currencies: ${response.statusText}`);
  }

  const formattedData = data.response.map((currency: Currency) => ({
    short_code: currency.short_code,
    name: currency.name,
  }));

  return {
    success: true,
    data: formattedData,
  };
};
