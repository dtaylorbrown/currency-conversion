"use server";

export async function convertCurrency(formData: FormData): Promise<number> {
  const fromCurrency = formData.get("from") as string;
  const toCurrency = formData.get("to") as string;
  const amount = parseFloat(formData.get("amount") as string);

  console.log("Form Data:", { fromCurrency, toCurrency, amount });

  if (!fromCurrency || !toCurrency || isNaN(amount)) {
    throw new Error("Invalid form data");
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
    throw new Error("Failed to fetch conversion rate");
  }

  const data = await response.json();
  console.log("Conversion Data:", data);
  return data.result;
}
