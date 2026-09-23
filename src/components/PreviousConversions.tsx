import type { Conversion } from "@/actions/convert";

import styles from "./PreviousConversions.module.css";

const PreviousConversions = ({
  conversions,
}: {
  conversions: Conversion[];
}) => {
  return (
    <div className={styles["previous-conversions"]}>
      <h2>Previous Conversions</h2>
      {conversions.length === 0 ? (
        <p>No previous conversions available.</p>
      ) : (
        <ul>
          {conversions.map((conversion, index) => (
            <li key={index}>
              {conversion.amount} {conversion.from} ={" "}
              {Number(conversion.converted_amount).toFixed(2)} {conversion.to}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
};

export default PreviousConversions;
