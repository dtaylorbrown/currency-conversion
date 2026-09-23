import type { Conversion } from "@/actions/convert";

const PreviousConversions = ({
  conversions,
}: {
  conversions: Conversion[];
}) => {
  return (
    <div>
      <h2>Previous Conversions</h2>
      {conversions.length === 0 ? (
        <p>No previous conversions available.</p>
      ) : (
        <ul>
          {conversions.map((conversion, index) => (
            <li key={index}>
              {conversion.amount} {conversion.from} =
              {Number(conversion.converted_amount).toFixed(2)} {conversion.to}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PreviousConversions;
