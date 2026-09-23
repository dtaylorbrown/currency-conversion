"use server";

export type Conversion = {
  from: string;
  to: string;
  amount: number;
  converted_amount: number;
};

export type ConvertState = {
  result?: Conversion;
  error?: string;
};

export async function convertCurrency(
  _prevState: ConvertState,
  formData: FormData,
): Promise<ConvertState> {
  const fromCurrency = formData.get("from") as string;
  const toCurrency = formData.get("to") as string;
  const amount = parseFloat(formData.get("amount") as string);

  if (!fromCurrency || !toCurrency || isNaN(amount)) {
    return { error: "Please pick both currencies and enter an amount." };
  }

  const params = new URLSearchParams({
    from: fromCurrency,
    to: toCurrency,
    amount: amount.toString(),
  });

  const response = await fetch(
    `https://api.currencybeacon.com/v1/convert?${params}`,
    {
      method: "GET",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${process.env.CURRENCY_BEACON_API_KEY}`,
      },
      next: {
        revalidate: 86400, // Revalidate every 24 hours
      },
    },
  );

  if (!response.ok) {
    return { error: "Failed to fetch conversion rate." };
  }

  const data = await response.json();

  return {
    result: {
      from: fromCurrency,
      to: toCurrency,
      amount,
      converted_amount: data.response.value,
    },
  };
}
