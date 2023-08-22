import { NumberField, NumberFieldProps } from "react-admin";

export const MonthField = (props: NumberFieldProps) => {
  return (
    <NumberField
      textAlign="right"
      options={{ useGrouping: false, minimumIntegerDigits: 2 }}
      {...props}
    />
  );
};

// MonthField.defaultProps = {
//   textAlign: "right",
// };
