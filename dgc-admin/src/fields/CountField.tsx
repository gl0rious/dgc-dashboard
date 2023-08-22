import { NumberField, NumberFieldProps } from "react-admin";

export const CountField = (props: NumberFieldProps) => {
  return (
    <NumberField
      textAlign="right"
      options={{ useGrouping: false }}
      {...props}
    />
  );
};

// CountField.defaultProps = {
//   textAlign: "right",
// };
